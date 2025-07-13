// GenderScreen.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { Mars, Venus } from 'lucide-react';

interface GenderScreenProps {
  onNext: (gender: 'male' | 'female') => void;
}

const GenderScreen: React.FC<GenderScreenProps> = ({ onNext }) => {
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const { question, male, female } = translations.genderTranslations[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4 sm:p-8 bg-base-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl text-center p-8 sm:p-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-10">
          {question}
        </h1>
        <div className="flex flex-row gap-8 w-full max-w-xs mx-auto justify-center">
          {/* 남성 선택 */}
          <button
            onClick={() => onNext('male')}
            className="
              flex flex-col items-center gap-2 
              text-lg sm:text-xl font-bold text-primary 
              bg-transparent border-none shadow-none 
              transition-transform hover:scale-105 focus:outline-none
            "
          >
            <Mars size={48} strokeWidth={2.2} />
            <span>{male}</span>
          </button>

          {/* 여성 선택 */}
          <button
            onClick={() => onNext('female')}
            className="
              flex flex-col items-center gap-2 
              text-lg sm:text-xl font-bold text-primary 
              bg-transparent border-none shadow-none 
              transition-transform hover:scale-105 focus:outline-none
            "
          >
            <Venus size={48} strokeWidth={2.2} />
            <span>{female}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderScreen;
