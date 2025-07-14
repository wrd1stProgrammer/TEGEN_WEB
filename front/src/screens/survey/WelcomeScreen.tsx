import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/config/store';
import { setLanguage } from '../../redux/reducers/languageSlice';

type LangCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

const translations: Record<LangCode, { greet: string; btn: string }> = {
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

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const lang = useSelector((s: RootState) => s.language.lang) as LangCode;
  const { greet, btn } = translations[lang];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value as LangCode));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4 sm:p-8 bg-base-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 sm:p-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 text-center">{greet}</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-10 text-center">TETO EGEN AI FACE TEST</p>

        {/* 언어 선택 영역 */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <label
            htmlFor="lang-select"
            className="block text-lg sm:text-xl font-semibold mb-1 text-primary text-center"
          >
            Language
          </label>
          <select
            id="lang-select"
            value={lang}
            onChange={handleChange}
            className="w-full max-w-xs text-lg sm:text-xl py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary bg-gray-50 font-medium text-gray-800"
            style={{
              width: "100%",
              alignItems:'center',
              minHeight: 48,
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              borderRadius: "50px",
              marginBlock: "5px",
            }}
          >
            {Object.entries(langText).map(([code, label]) => (
              <option key={code} value={code}>
                {flags[code as LangCode]} {label}
              </option>
            ))}
          </select>
        </div>

        {/* 시작하기 버튼 */}
        <button
          onClick={onNext}
          className="w-full max-w-xs py-10 text-lg sm:text-xl font-bold tracking-tight
            bg-primary text-white rounded-full shadow-lg
            hover:bg-primary/90 transition-all duration-150
            flex items-center justify-center
          "
          style={{
            marginTop: '1.5rem',
            
            marginBottom: '0.5rem',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
          }}
        >
          {btn}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
