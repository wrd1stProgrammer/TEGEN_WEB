import React, { useState } from 'react';
import WelcomeScreen from './screens/survey/WelcomeScreen';
import GenderScreen from './screens/survey/GenderScreen';
import MediaSelectionScreen from './screens/faceAI/MediaSelectionScreen';
import FaceResultScreen, { type Scores } from './screens/MainSceen/FaceResultScreen';

type Step = 'welcome' | 'gender' | 'media-selection' | 'face-result';

function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleWelcomeNext = () => {
    setStep('gender');
  };

  const handleGenderNext = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setStep('media-selection');
  };

  const handleMediaSelectionNext = (newScores: Scores, newPhotoUri: string) => {
    setScores(newScores);
    setPhotoUri(newPhotoUri);
    setStep('face-result');
  };

  const handleGoBack = () => {
    if (step === 'gender') {
      setStep('welcome');
    } else if (step === 'media-selection') {
      setStep('gender');
    } else if (step === 'face-result') {
      setStep('media-selection');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onNext={handleWelcomeNext} />;
      case 'gender':
        return <GenderScreen onNext={handleGenderNext} />;
      case 'media-selection':
        return (
          <MediaSelectionScreen
            onNext={handleMediaSelectionNext}
            onBack={handleGoBack}
            gender={gender}
          />
        );
      case 'face-result':
        return (
          <FaceResultScreen
            scores={scores}
            sex={gender === 'male' ? '남' : '여'}
            photoUri={photoUri}
            onBack={handleGoBack}
          />
        );
      default:
        return <WelcomeScreen onNext={handleWelcomeNext} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <main className="flex-grow max-w-screen-lg mx-auto p-8">
        {renderStep()}
      </main>
      <footer className="footer footer-center bg-base-300 text-base-content p-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <a
            href="https://kind-walkover-f46.notion.site/226566b53c5b802cb11dd952e8a74b12?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1 rounded-full bg-base-100 no-underline hover:bg-base-200 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.instagram.com/tegenai_official?igsh=MWQ0bHZnbmc5ZmlrOQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1 rounded-full bg-base-100 no-underline hover:bg-base-200 transition-colors"
          >
            Instagram
          </a>
        </div>
        <aside>
          <p className="text-sm">© 2025 Developed by @mins2k</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
