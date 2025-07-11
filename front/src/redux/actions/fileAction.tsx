// src/actions/uploadFile.ts

import { appAxios } from '../config/apiConfig';

/**
 * 파일 업로드 액션 (웹 전용)
 * @param file File 객체 (input type="file" 또는 드롭존 등에서 얻음)
 * @param mediaType (ex: 'face_image', 'profile_image')
 * @returns Promise<string|null> 업로드된 이미지 URL
 */
export const uploadFile =
  (file: File, mediaType: string) => async (dispatch: any) => {
    try {
      const formData = new FormData();
      // 'image' key는 서버 multer.single('image')와 반드시 일치해야 함
      formData.append('image', file);
      formData.append('mediaType', mediaType);

      // 실제 업로드
      const res = await appAxios.post(`/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 서버 응답: { mediaUrl: ... }
      return res.data.mediaUrl;
    } catch (error) {
      console.error('[uploadFile error]', error);
      return null;
    }
  };
