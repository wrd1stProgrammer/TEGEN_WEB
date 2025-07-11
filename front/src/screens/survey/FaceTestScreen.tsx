import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FaceTestScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, gender, score } = location.state || {};

  const goResult = () => navigate('/result', { state: { answers, gender, score, faceTest: false } });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl text-center p-10">
        <div className="card-body p-0">
          <h1 className="card-title justify-center text-3xl font-bold text-neutral-content mb-8 leading-tight">AI 얼굴상 테스트를 시작할까요?</h1>
          <p className="text-lg text-base-content mb-12">얼굴 분석을 통해 맞춤 결과를 제공해요.</p>
          <div className="card-actions flex flex-col items-center w-full">
            <button
              className="btn btn-primary btn-lg w-full rounded-full mb-6 text-xl"
              onClick={() =>
                navigate('/result', { state: { answers, gender, score, faceTest: true } })
              }
            >
              AI 얼굴상 테스트 시작
            </button>
            <button
              className="btn btn-outline btn-lg w-full rounded-full text-xl"
              onClick={goResult}
            >
              건너뛰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceTestScreen;
