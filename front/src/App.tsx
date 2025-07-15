import React, { useState } from 'react';
import MediaSelectionScreen from './screens/faceAI/MediaSelectionScreen';
import FaceResultScreen, { type Scores } from './screens/MainSceen/FaceResultScreen';

type Step = 'media-selection' | 'face-result';

function App() {
  const [step, setStep] = useState<Step>('media-selection');
  const [scores, setScores] = useState<Scores | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female'); // Default gender

  const handleMediaSelectionNext = (newScores: Scores, newPhotoUri: string) => {
    setScores(newScores);
    setPhotoUri(newPhotoUri);
    setStep('face-result');
  };

  const handleGoBack = () => {
    if (step === 'face-result') {
      setStep('media-selection');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'media-selection':
        return (
          <MediaSelectionScreen
            onNext={handleMediaSelectionNext}
            gender={gender}
            setGender={setGender}
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
        return (
          <MediaSelectionScreen
            onNext={handleMediaSelectionNext}
            gender={gender}
            setGender={setGender}
          />
        );
    }
  };

  return (
    <div className="flex flex-col font-sans ">
      <main className="flex-grow max-w-screen-lg mx-auto p-8">
        {renderStep()}
      </main>

      {/* 수정된 푸터 */}
      {/* 중앙 정렬된 푸터 */}
      <footer className="footer bg-base-300 p-6">
        <div className="flex flex-col items-center gap-2">
          {/* 저작권 문구 */}
          <p className="text-sm">© 2025 SERN. All Rights Reserved.</p>

{/* 링크들을 가로 배치 & 중앙 정렬 (인라인 스타일 버전) */}
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <a
    href="https://kind-walkover-f46.notion.site/..."
    target="_blank"
    rel="noopener noreferrer"
    style={{
      marginRight: '1.5rem',   // ← 32px 만큼 띄우기
      textDecoration: 'none',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      color: '#000',
    }}
  >
    Privacy
  </a>
  <a
    href="https://www.instagram.com/tegenai_official?…"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: 'none',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      color: '#000',
    }}
  >
    Instagram
  </a>
</div>

        </div>
      </footer>

    </div>
  );
}

export default App;
