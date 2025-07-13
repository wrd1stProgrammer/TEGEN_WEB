import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/config/store';
import { translations, type LangCode } from '../../utils/translations';
import {
  ChevronLeftIcon,
  PhotoIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { uploadFile } from '../../redux/actions/fileAction';
import { geminiImageAction } from '../../redux/actions/geminiAction';
import { type Scores } from '../MainSceen/FaceResultScreen';

interface MediaSelectionScreenProps {
  onNext: (scores: Scores, photoUri: string) => void;
  onBack: () => void;
  gender: 'male' | 'female' | null;
}

const MediaSelectionScreen: React.FC<MediaSelectionScreenProps> = ({ onNext, onBack, gender }) => {
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const t = translations.mediaTranslations[lang];

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedImage || !gender) return;
    setLoading(true);
    try {
      const mediaUrl = await dispatch(uploadFile(selectedImage, 'face_image'));
      if (!mediaUrl) throw new Error('업로드 실패');

      const sex = gender === 'male' ? '남' : '여';
      const res = await dispatch(geminiImageAction(mediaUrl, sex, lang));
      if (!res) throw new Error('분석 실패');

      onNext(res.data, mediaUrl);
    } catch (error) {
      alert(t.errorText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-160px)] bg-base-200 px-2 sm:px-4 py-8">
      <div className="w-full max-w-md flex items-center">
        <button
          onClick={onBack}
          aria-label="뒤로가기"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(245,245,245,0.88)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
            border: 'none',
            cursor: 'pointer',
            marginLeft: 2,
            marginTop: 2,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(225,225,225,0.92)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(245,245,245,0.88)')}
        >
          <ChevronLeftIcon style={{ width: 22, height: 22, color: '#7c7c7c' }} />
        </button>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white shadow-md flex flex-col items-center py-7 px-4 sm:px-8 gap-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">{t.title}</h1>

        <div className="w-full flex flex-col items-center gap-2">
          {preview ? (
            <div className="relative flex flex-col items-center w-full mb-2">
              <img
                src={preview}
                alt="Preview"
                className="object-cover rounded-xl border-2 border-primary shadow"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: 'auto',
                  maxHeight: '220px',
                  aspectRatio: '1/1',
                }}
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreview(null);
                  if (preview) URL.revokeObjectURL(preview);
                }}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.14)',
                  border: 'none',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                aria-label="이미지 삭제"
              >
                <XMarkIcon style={{ width: 18, height: 18, color: '#444' }} />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="flex flex-col justify-center items-center border-2 border-dashed border-primary bg-base-100 hover:bg-primary/10 cursor-pointer rounded-xl py-10 px-2 w-full transition focus:ring-2 focus:ring-primary outline-none"
              tabIndex={0}
            >
              <input {...getInputProps()} />
              <PhotoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
              <span className="text-base sm:text-lg font-medium text-gray-700">
                {t.pickGalleryText}
              </span>
            </div>
          )}
        </div>

        <div className="h-2 sm:h-4" />

        <div className="w-full mt-1 text-center">
          <p className="text-xs sm:text-sm text-gray-400 mt-1"></p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedImage || loading}
          className={`
            w-full rounded-full py-3
            text-base sm:text-lg font-bold flex justify-center items-center gap-2
            bg-primary text-white shadow
            hover:scale-105 transition
            disabled:opacity-60 disabled:cursor-not-allowed
            ${(!selectedImage || loading) && 'opacity-60'}
          `}
          style={{ minHeight: '3.2rem' }}
        >
          <SparklesIcon style={{ width: '1.4rem', height: '1.4rem', minWidth: '1.4rem' }} />
          {loading ? t.analyzingText : t.analyzeButton}
        </button>

        <div className="h-5 sm:h-5" />

        <div className="w-full mt-1 text-center">
          <p className="text-xs sm:text-sm text-gray-500">{t.tip1}</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{t.tip2}</p>
        </div>
      </div>

      {modalVisible && (
        <dialog id="ad_modal" className="modal modal-open z-50">
          <div className="modal-box rounded-2xl p-6 sm:p-8 bg-white text-center">
            <SparklesIcon style={{ width: '2rem', height: '2rem' }} className="mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-lg sm:text-xl mb-2">{t.modalTitle}</h3>
            <p className="py-2 text-sm sm:text-base leading-relaxed">
              {t.modalDescPart1}
              <span className="font-bold text-primary">{t.modalDescHighlight}</span>
              {t.modalDescPart2}
            </p>
            <div className="modal-action flex flex-col sm:flex-row justify-center gap-3 mt-5">
              <button
                onClick={() => setModalVisible(false)}
                className="btn btn-ghost btn-md flex-1 rounded-full"
              >
                {t.cancelText}
              </button>
              <button
                onClick={handleAnalyze}
                className="btn btn-primary btn-md flex-1 rounded-full"
              >
                {t.confirmText}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {loading && (
        <div className="fixed inset-0 bg-base-200 bg-opacity-60 flex flex-col justify-center items-center z-50">
          <span className="loading loading-spinner loading-md text-primary mb-3"></span>
          <p className="text-base sm:text-lg text-primary">{t.analyzingText}</p>
        </div>
      )}

      <div className="w-full max-w-md mt-8 flex justify-center">
    <ins
     className="kakao_ad_area"
     style={{ display: 'none', width: '320px', height: '100px' }}
     data-ad-unit="DAN-GOQPydEh03UEEZCj"
     data-ad-width="320"
     data-ad-height="100"
   ></ins>
      </div>
    </div>
  );
};

export default MediaSelectionScreen;
