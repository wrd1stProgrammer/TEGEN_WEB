import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { Mars, Venus } from 'lucide-react';

const GenderScreen: React.FC = () => {
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const { question, male, female } = translations.genderTranslations[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4 sm:p-8 bg-base-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl text-center p-8 sm:p-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-10">{question}</h1>
        <div className="flex flex-row gap-8 w-full max-w-xs mx-auto justify-center">
          <Link
            to="/media-selection?gender=male"
            className="flex flex-col items-center justify-center gap-2 btn btn-primary btn-lg w-32 h-32 rounded-2xl text-lg sm:text-xl font-bold shadow hover:scale-105 transition"
            style={{ minWidth: 110, minHeight: 110 }}
          >
            <Mars size={48} strokeWidth={2.2} className="mb-1" />
            <span>{male}</span>
          </Link>
          <Link
            to="/media-selection?gender=female"
            className="flex flex-col items-center justify-center gap-2 btn btn-secondary btn-lg w-32 h-32 rounded-2xl text-lg sm:text-xl font-bold shadow hover:scale-105 transition"
            style={{ minWidth: 110, minHeight: 110 }}
          >
            <Venus size={48} strokeWidth={2.2} className="mb-1" />
            <span>{female}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenderScreen;
