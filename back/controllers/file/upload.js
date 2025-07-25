const cloudinary = require("../../config/cloudinary");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../errors");
const streamifier = require("streamifier"); // ?
const { Transform } = require("stream"); // ?

const uploadMedia = async (req, res) => {
  if (!req.file || !req.body.mediaType) {
    throw new BadRequestError("No file or media type provided");
  }

  try {
    const mediaType = req.body.mediaType;
//
    let folder;
    if (mediaType === "face_image") {
      folder = "face_image";
    } else if (mediaType === "profile_image") {
      folder = "profile_image";
    } else if (mediaType === "patient_image"){
      folder = "patient_image";
    }
     else {
      throw new BadRequestError("이상한 타입.");
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let uploadedBytes = 0;
        const totalBytes = req.file.size;

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            use_filename: false,
            unique_filename: false,
            overwrite: false,
            resource_type: mediaType === "image",
          },
          (error, result) => {
            if (result) {
              console.log(result);
              resolve(result);
            } else {
              console.log(error)
              reject(error);
            }
          }
        );

        const progressStream = new Transform({
          transform(chunk, encoding, callback) {
            uploadedBytes += chunk.length;
            const progress = (uploadedBytes / totalBytes) * 100;
            console.log(`Upload progress: ${progress.toFixed(2)}%`);
            callback(null, chunk);
          },
        });

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(progressStream)
          .pipe(uploadStream);
      });
    };

    const result = await streamUpload(req);

    res.status(StatusCodes.OK).json({ mediaUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Media upload failed");
  }
};

module.exports = { uploadMedia };