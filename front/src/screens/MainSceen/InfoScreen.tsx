import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { XMarkIcon, GlobeAltIcon, StarIcon, ShareIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const { title, rows, menu } = translations.infoTranslations[lang];

  const menuLinks = [
    'https://www.instagram.com/tegenai_official?igsh=MWQ0bHZnbmc5ZmlrOQ%3D%3D&utm_source=qr',
    '', // Placeholder for review link
    '', // Placeholder for share link
  ];

  const onPressMenu = (idx: number) => {
    const url = menuLinks[idx];
    if (url) {
      window.open(url, '_blank');
    } else if (idx === 1) {
      alert('평점 및 리뷰 기능은 웹에서 지원되지 않습니다.');
    } else if (idx === 2) {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          text: '테겐상 테스트 앱을 경험해보세요!',
          url: window.location.href,
        }).catch(console.error);
      } else {
        alert('앱 공유 기능은 웹에서 지원되지 않습니다.');
      }
    }
  };

  const getRowIcon = (idx: number) => {
    switch (idx) {
      case 0: return <GlobeAltIcon className="h-6 w-6 text-primary" />;
      case 1: return <StarIcon className="h-6 w-6 text-primary" />;
      case 2: return <ShareIcon className="h-6 w-6 text-primary" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-8">
      <div className="w-full max-w-lg flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-content">{title}</h1>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle btn-lg">
          <XMarkIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-10">
        <div className="card-body p-0">
          <div className="mb-10">
            {rows.map((text, idx) => (
              <div key={idx} className="flex items-start mb-6 last:mb-0">
                <div className="mr-6 mt-1">
                  {getRowIcon(idx)}
                </div>
                <p className="flex-1 text-base-content text-lg leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <ul className="menu bg-base-100 w-full rounded-box">
            {menu.map((label, idx) => (
              <li key={idx}>
                <a onClick={() => onPressMenu(idx)} className="flex justify-between items-center text-lg py-4">
                  <span>{label}</span>
                  <ChevronRightIcon className="h-6 w-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoScreen;
