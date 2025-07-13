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
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-10">{question}</h1>
        <div className="flex flex-row gap-8 w-full max-w-xs mx-auto justify-center">
          <button
            onClick={() => onNext('male')}
            className="flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-2xl text-lg sm:text-xl font-bold shadow transform transition hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
            style={{ minWidth: 110, minHeight: 110 }}
          >
            <Mars size={48} strokeWidth={2.2} className="mb-1" />
            <span>{male}</span>
          </button>
          <button
            onClick={() => onNext('female')}
            className="flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-2xl text-lg sm:text-xl font-bold shadow transform transition hover:scale-105 bg-red-500 hover:bg-red-600 text-white"
            style={{ minWidth: 110, minHeight: 110 }}
          >
            <Venus size={48} strokeWidth={2.2} className="mb-1" />
            <span>{female}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderScreen;
