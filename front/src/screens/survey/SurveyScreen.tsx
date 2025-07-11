import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// 20문항, 5카테고리, 4지선다
const getQuestions = (gender: '남' | '여') => [
  // 연애 성향 (1~4)
  {
    category: '연애 성향',
    question: `첫 데이트에서 정적이 흐른다. 내 반응은?`,
    options: [
      '분위기를 내가 먼저 풀려고 농담한다',
      '상대의 반응을 기다린다',
      '조용히 미소만 짓는다',
      '딱히 신경 안 쓴다'
    ]
  },
  {
    category: '연애 성향',
    question: `${gender === '남' ? '여자친구' : '남자친구'}에게 서운한 일이 생겼다. 나는?`,
    options: [
      '곧장 솔직하게 말한다',
      '돌려서 표현한다',
      '혼자 삭힌다',
      '서운함을 그냥 넘긴다'
    ]
  },
  {
    category: '연애 성향',
    question: `${gender === '남' ? '남사친' : '여사친'}과 술을 먹는다고 한다. 나는?`,
    options: [
      '불편하다, 싫다고 말한다',
      '조용히 신경 쓴다',
      '괜찮다, 믿는다',
      '같이 만나자고 제안한다'
    ]
  },
  {
    category: '연애 성향',
    question: `데이트 계획은 누가 세우나?`,
    options: [
      '내가 다 세운다',
      '상대가 세운다',
      '서로 번갈아 세운다',
      '아무도 안 세운다'
    ]
  },
  // 삶 태도 (5~8)
  {
    category: '삶 태도',
    question: `목표가 생기면 나는?`,
    options: [
      '즉시 계획 세우고 실천',
      '주변 조언을 구함',
      '시간 두고 고민함',
      '귀찮아서 미룸'
    ]
  },
  {
    category: '삶 태도',
    question: `일상생활 중 스트레스를 받으면 나는?`,
    options: [
      '운동이나 취미로 해소',
      '친구에게 털어놓음',
      '혼자 이겨냄',
      '쌓아두다 폭발'
    ]
  },
  {
    category: '삶 태도',
    question: `팀 프로젝트나 모임에서 나는?`,
    options: [
      '리더를 자처함',
      '맡은 역할만 함',
      '의견 내는 편',
      '조용히 따름'
    ]
  },
  {
    category: '삶 태도',
    question: `내가 원하는 삶은?`,
    options: [
      '도전적이고 변화 많은 삶',
      '안정적이고 평화로운 삶',
      '공감 많은 관계 중심',
      '혼자만의 시간 중요'
    ]
  },
  // 성격 (9~12)
  {
    category: '성격',
    question: `새로운 사람을 만나면 나는?`,
    options: [
      '먼저 말을 건다',
      '상대가 다가오길 기다림',
      '분위기 따라 다름',
      '대화보다 관찰'
    ]
  },
  {
    category: '성격',
    question: `친구에게 서운한 일이 생겼다. 나는?`,
    options: [
      '곧장 말한다',
      '티 안내고 넘어간다',
      '에둘러 표현',
      '그냥 멀어진다'
    ]
  },
  {
    category: '성격',
    question: `갈등 상황에서 나는?`,
    options: [
      '상대 입장 충분히 듣는다',
      '내 주장 먼저 말함',
      '상대가 화풀 때까지 기다림',
      '아무 말도 안 함'
    ]
  },
  {
    category: '성격',
    question: `팀 프로젝트/모임에서 발표를 자주 맡는다.`,
    options: [
      '항상 맡는다',
      '가끔 맡는다',
      '거의 안 한다',
      '절대 안 한다'
    ]
  },
  // 취미 (13~16)
  {
    category: '취미',
    question: `내가 선호하는 운동 종류는?`,
    options: [
      '헬스/피트니스',
      '수영/러닝/싸이클',
      '구기종목(축구/농구 등)',
      '운동 안 함'
    ]
  },
  {
    category: '취미',
    question: `야외 캠핑·등산 같은 자연 속 활동에 자주 나간다.`,
    options: [
      '매주 나간다',
      '가끔 나간다',
      '가고 싶지만 잘 못 감',
      '아예 안 감'
    ]
  },
  {
    category: '취미',
    question: `스포츠 활동을 할 때 나는?`,
    options: [
      '직접 참가',
      '관람만',
      '주최/진행',
      '운동 자체를 안 좋아함'
    ]
  },
  {
    category: '취미',
    question: `최근 7일 이내 땀이 많이 나는 운동을 한 적이 있다.`,
    options: [
      '3회 이상',
      '1~2회',
      '한 번',
      '없다'
    ]
  },
  // 욕구 (17~20)
  {
    category: '욕구',
    question: `요새 나는 성욕이 많다.`,
    options: [
      '매우 그렇다',
      '약간 그렇다',
      '보통이다',
      '전혀 아니다'
    ]
  },
  {
    category: '욕구',
    question: `이성을 볼 때 몸매가 자주 들어온다.`,
    options: [
      '자주 그렇다',
      '가끔 그렇다',
      '별로 신경 안 씀',
      '외모보다 성격'
    ]
  },
  {
    category: '욕구',
    question: `대화 중 은근히 스킨십 시그널을 보내는 편이다.`,
    options: [
      '거의 항상',
      '가끔',
      '상황 따라 다름',
      '전혀 안 함'
    ]
  },
  {
    category: '욕구',
    question: `썸${gender === '남' ? '녀' : '남'}와 밤에 만나기로 했다. 만나고 싶은 장소는?`,
    options: [
      '분위기 좋은 바',
    '영화관',
      '공원 산책',
      '집'
    ]
  },
];

type Question = ReturnType<typeof getQuestions>[number];

const SurveyScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gender = (location.state?.gender || '남') as '남' | '여';
  const questions = getQuestions(gender);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const score = calculateTegenScore(newAnswers, gender);
      navigate('/result', { state: { answers: newAnswers, gender, score } });
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigate(-1);
    } else {
      setStep(step - 1);
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const q = questions[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button onClick={handleBack} className="btn btn-ghost btn-circle btn-sm">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <progress className="progress progress-primary w-full ml-4" value={step} max={questions.length}></progress>
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-xl text-center p-6 sm:p-8">
        <div className="card-body p-0">
          <p className="text-sm sm:text-base font-semibold text-primary mb-4">{q.category}</p>
          <h1 className="card-title justify-center text-xl sm:text-2xl font-bold text-neutral-content mb-10 leading-tight">{q.question}</h1>
          <div className="card-actions flex flex-col items-center w-full">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className="btn btn-outline btn-primary btn-lg w-full rounded-full my-2 text-base sm:text-lg"
                onClick={() => handleSelect(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateTegenScore(answers: number[], gender: string) {
  const catIndices: { [key: string]: number[] } = {
    '연애 성향': [0, 1, 2, 3],
    '삶 태도': [4, 5, 6, 7],
    '성격': [8, 9, 10, 11],
    '취미': [12, 13, 14, 15],
    '욕구': [16, 17, 18, 19]
  };

  const categoryScore = (idxArr: number[]) =>
    Math.round(
      (idxArr.map(i => (3 - answers[i]) * 100 / 3).reduce((a, b) => a + b, 0)) /
        idxArr.length
    );

  const catScores = Object.entries(catIndices).map(([k, idxArr]) => ({
    cat: k,
    score: categoryScore(idxArr)
  }));

  let total = catScores.reduce((a, b) => a + b.score, 0) / 5;
  let type =
    gender === '남'
      ? total >= 60
        ? '에겐남'
        : '테토남'
      : total >= 60
      ? '에겐녀'
      : '테토녀';
  return { catScores, total, type };
}

export default SurveyScreen;
