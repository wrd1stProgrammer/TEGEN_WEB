import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/config/store';
import { setLanguage } from '../../redux/reducers/languageSlice';
import { translations as allTranslations, type LangCode } from '../../utils/translations';
import {
  PhotoIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Mars, Venus } from 'lucide-react';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { uploadFile } from '../../redux/actions/fileAction';
import { geminiImageAction } from '../../redux/actions/geminiAction';
import { type Scores } from '../MainSceen/FaceResultScreen';
// At the top of your component file:


// 1. WelcomeScreen에서 가져온 변수들 (수정 없이 그대로 사용)
const welcomeTranslations: Record<LangCode, { greet: string; btn: string }> = {
  ko: { greet: '테토·에겐 테스트', btn: '시작하기' },
  en: { greet: 'Teto vs Egen Test', btn: 'Start' },
  ja: { greet: 'テト・エゲン テスト', btn: '始める' },
  zh: { greet: 'Teto vs Egen 测试', btn: '开始' },
  vi: { greet: 'Bài kiểm tra Teto và Egen', btn: 'Bắt đầu' },
};

const flags: Record<LangCode, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  vi: '🇻🇳',
};

const langText: Record<LangCode, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  vi: 'Tiếng Việt',
};

interface MediaSelectionScreenProps {
  onNext: (scores: Scores, photoUri: string) => void;
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
}

const MediaSelectionScreen: React.FC<MediaSelectionScreenProps> = ({ onNext, gender, setGender }) => {
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const t = allTranslations.mediaTranslations[lang];
  const { greet } = welcomeTranslations[lang];

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value as LangCode));
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
    <div className="w-full max-w-md mx-auto flex flex-col items-center min-h-[calc(100vh-160px)] bg-base-200 px-2 sm:px-4 py-8">
      {/* 2 & 3. 제목 및 언어 선택 */}
      {/* 1. 환영 문구 */}
      <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
        {greet}
      </h1>


      {/* 2. 언어 선택 (환영 아래로 이동) */}
      <div className="mt-4 w-full flex justify-center">
        <select
          value={lang}
          onChange={handleLangChange}
          className="text-sm sm:text-base py-2 px-3 rounded-full border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-primary"
        >
          {Object.entries(langText).map(([code, label]) => (
            <option key={code} value={code}>
              {flags[code as LangCode]} {label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-base sm:text-lg text-gray-600 text-center">
        TETO EGEN 
        Google AI FACE TEST
      </p>

      {/* 4. 성별 선택 */}
      <div className="flex flex-row gap-8 w-full max-w-xs mx-auto justify-center">
          <button
            onClick={() => setGender('male')}
            className="
              flex flex-col items-center gap-2 
              text-lg sm:text-xl font-bold text-primary 
              bg-transparent border-none shadow-none 
              transition-transform hover:scale-105 focus:outline-none
            "
          >
          <Mars
            size={52}
            strokeWidth={2.5}
            color={gender === 'male' ? '#3B82F6' : '#9CA3AF'}  // blue-500 vs gray-400
          />
          </button>
          <button
            onClick={() => setGender('female')}
            className="
              flex flex-col items-center gap-2 
              text-lg sm:text-xl font-bold text-primary 
              bg-transparent border-none shadow-none 
              transition-transform hover:scale-105 focus:outline-none
            "
          >
          <Venus
            size={52}
            strokeWidth={2.5}
            color={gender === 'female' ? '#EC4899' : '#9CA3AF'}  // pink-500 vs gray-400
          />
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
            ${
              (!selectedImage || loading) && 'opacity-60'
            }
          `}
          style={{ minHeight: '3.2rem' }}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              <span>{t.analyzingText}</span>
            </>
          ) : (
            <>
              <SparklesIcon style={{ width: '1.4rem', height: '1.4rem', minWidth: '1.4rem' }} />
              <span>{t.analyzeButton}</span>
            </>
          )}
        </button>

        <div className="w-full mt-1 text-center">
          <p className="text-xs sm:text-sm text-gray-500">{t.tip1}</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{t.tip2}</p>
        </div>
      </div>

      {/* <div className="w-full max-w-md mt-8 flex justify-center">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none', width: '320px', height: '100px' }}
          data-ad-unit="DAN-GOQPydEh03UEEZCj"
          data-ad-width="320"
          data-ad-height="100"
        ></ins>
      </div> */}
    </div>
  );
};

export default MediaSelectionScreen;