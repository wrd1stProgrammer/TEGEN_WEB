import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { VictoryChart, VictoryPolarAxis, VictoryGroup, VictoryArea, VictoryScatter, VictoryTheme } from 'victory';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

interface ScoreData {
  score: number;
  desc: string;
}
interface Scores {
  expression: ScoreData;
  face_shape: ScoreData;
  physiognomy: ScoreData;
  style: ScoreData;
  atmosphere: ScoreData;
  total?: ScoreData;
}
interface FaceResultScreenState {
  scores: Scores;
  sex: '남' | '여';
  photoUri: string;
}

const CHART_SIZE_MOBILE = 220;
const CHART_SIZE_PC = 350;

const barGradients = [
  { from: '#fa7bff', to: '#fcdff4' }, // 분홍→연핑
  { from: '#43e97b', to: '#38f9d7' }, // 초록→민트
  { from: '#38b6ff', to: '#ecf5ff' }, // 파랑→밝은파랑
  { from: '#ffd66c', to: '#ffd6e0' }, // 노랑→핑크
  { from: '#b388ff', to: '#f3e8ff' }, // 보라→연보라
];
const barLabelColors = [
  '#fa7bff', '#43e97b', '#38b6ff', '#ffd66c', '#b388ff'
];

const FaceResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scores, sex, photoUri } = location.state as FaceResultScreenState;
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const t = translations.faceResultTranslations[lang];

  const axes = [
    { key: 'expression', label: t.axes.expression },
    { key: 'face_shape', label: t.axes.face_shape },
    { key: 'physiognomy', label: t.axes.physiognomy },
    { key: 'style', label: t.axes.style },
    { key: 'atmosphere', label: t.axes.atmosphere },
  ];
  const data = axes.map(a => ({ x: a.label, y: scores[a.key as keyof Scores].score }));

  // 반응형
  const chartSize = window.innerWidth < 600 ? CHART_SIZE_MOBILE : CHART_SIZE_PC;
  const avatarSize = window.innerWidth < 600 ? 92 : 132;
  const badgeFont = window.innerWidth < 600 ? 13 : 17;

  // 모달
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [selectedDesc, setSelectedDesc] = useState('');

  function getLevel(score: number, tLevels: any) {
    if (score >= 80) return { label: tLevels.teto, color: '#FF6B81' };
    if (score >= 65) return { label: tLevels.semiTeto, color: '#FFB347' };
    if (score >= 50) return { label: tLevels.tegen, color: '#4B4B4B' };
    if (score >= 30) return { label: tLevels.semiEgen, color: '#83B0FF' };
    return { label: tLevels.egen, color: '#F78FB3' };
  }
  const avg = axes.reduce((s, d) => s + scores[d.key as keyof Scores].score, 0) / axes.length;
  const { label: levelLabel, color } = getLevel(avg, t.levels);
  let sexSuffix = sex === '여' ? t.sexSuffix.female : t.sexSuffix.male;
  const resultLabel = `${levelLabel}${sexSuffix}`;

  // 안내 설명
  const openDesc = (desc: string) => {
    setSelectedDesc(desc || '설명이 없습니다');
    setDescModalVisible(true);
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-160px)] px-1 py-2 sm:px-4 sm:py-8 bg-base-200 transition-all">
      {/* 뒤로가기 */}
      <div className="w-full max-w-lg flex justify-start mb-2 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(245,245,245,0.92)', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.04)',
            border: 'none', marginLeft: 2, marginTop: 2, transition: 'background 0.2s'
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(225,225,225,0.97)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(245,245,245,0.92)')}
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon style={{ width: 26, height: 26, color: '#7c7c7c' }} />
        </button>
      </div>

      {/* 결과 카드 */}
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl p-5 sm:p-10 flex flex-col items-center">
        {/* 프로필 이미지 + 뱃지 */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{
            width: avatarSize, height: avatarSize, borderRadius: '50%',
            overflow: 'hidden', border: `4px solid ${color}`,
            boxShadow: '0 4px 16px rgba(240,120,210,0.13)',
            margin: '0 auto',
            background: '#f3f4f6'
          }}>
            <img
              src={photoUri}
              alt="Profile"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', borderRadius: '50%',
                display: 'block'
              }}
            />
          </div>
          {/* 뱃지 */}
          <div
            style={{
              position: 'absolute', right: -8, bottom: 0,
              background: color, color: '#fff', fontWeight: 700,
              borderRadius: '1.7rem', padding: '5px 18px',
              fontSize: badgeFont, letterSpacing: '-0.01em',
              boxShadow: '0 2px 9px 0 rgba(230,110,180,0.17)'
            }}
          >
            {resultLabel}
          </div>
        </div>

        {/* 요약 설명 */}
        <div
          className="shadow mb-5 py-3 px-4 rounded-xl"
          style={{
            background: 'linear-gradient(95deg,#f1f8fd,#fbe9fb 55%)',
            color: '#4B4B4B',
            fontSize: window.innerWidth < 600 ? 15 : 18,
            fontWeight: 500,
            lineHeight: 1.5
          }}>
          <span>{scores.total?.desc}</span>
        </div>

        {/* 레이더 차트 */}
        <div className="w-full flex flex-col items-center py-1 sm:py-4">
          <h2 className="card-title text-xl sm:text-3xl font-bold text-primary mb-4 sm:mb-8">{t.title}</h2>
          <VictoryChart
            polar
            theme={VictoryTheme.material}
            width={chartSize}
            height={chartSize}
            padding={window.innerWidth < 600 ? 35 : 50}
            domain={{ y: [0, 100] }}
          >
            {axes.map((a, i) => (
              <VictoryPolarAxis
                key={i}
                dependentAxis
                axisValue={a.label}
                label={a.label}
                labelPlacement="perpendicular"
                style={{
                  axis: { stroke: '#E6D8E8', strokeWidth: 1.1 },
                  axisLabel: { fontSize: window.innerWidth < 600 ? 12 : 16, fill: '#4B4B4B', fontWeight: 600 },
                  grid: { stroke: '#F7BFD8', strokeDasharray: '4,9' },
                  tickLabels: { fill: 'transparent' },
                }}
                tickValues={[20, 40, 60, 80, 100]}
              />
            ))}
            <VictoryGroup colorScale={[color]} style={{ data: { fillOpacity: 0.29, strokeWidth: 2.3 } }}>
              <VictoryArea data={data} />
              <VictoryScatter
                data={data}
                size={window.innerWidth < 600 ? 3.3 : 5}
                style={{ data: { fill: color, stroke: '#fff', strokeWidth: 1.2 } }}
              />
            </VictoryGroup>
          </VictoryChart>
          <div className="badge badge-outline badge-primary mt-6 text-sm sm:text-base">
            <p className="font-medium">{t.radarExplain}</p>
          </div>
        </div>

        {/* 각 항목별 게이지 */}
        <div className="w-full mt-8">
          <p className="text-center text-sm sm:text-base text-gray-500 mb-3">클릭 시 AI가 분석한 결과가 보여요</p>
          {axes.map((a, i) => {
            const val = scores[a.key as keyof Scores].score ?? 0;
            const desc = scores[a.key as keyof Scores].desc ?? '';
            const fg = barGradients[i % barGradients.length].from;
            const to = barGradients[i % barGradients.length].to;
            const labelColor = barLabelColors[i % barLabelColors.length];

            return (
              <div
                key={i}
                onClick={() => openDesc(desc)}
                style={{
                  cursor: 'pointer',
                  marginBottom: window.innerWidth < 600 ? 14 : 18,
                  display: 'flex',
                  alignItems: 'center',
                  height: window.innerWidth < 600 ? 40 : 54,
                  borderRadius: 999,
                  background: '#fff',
                  boxShadow: '0 1.5px 6px 0 rgba(220,220,220,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  userSelect: 'none'
                }}
              >
                {/* 전면 컬러바 */}
                <div
                  style={{
                    height: '100%',
                    width: `${val}%`,
                    background: `linear-gradient(90deg, ${fg} 25%, ${to} 100%)`,
                    borderRadius: 999,
                    transition: 'width 0.8s cubic-bezier(.4,1.5,.58,1)',
                    position: 'absolute', top: 0, left: 0,
                    zIndex: 1,
                  }}
                />
                {/* 항목명 */}
                <span
                  style={{
                    position: 'absolute', left: 18,
                    fontWeight: 700, 
                    color: 'white',
                    zIndex: 2,
                    fontSize: window.innerWidth < 600 ? 16 : 20,
                    textShadow: '0 1px 8px #fff6',
                    letterSpacing: '-0.01em'
                    
                  }}
                >
                  {a.label}
                </span>
                {/* 점수 */}
                <span
                  style={{
                    position: 'absolute',
                    right: 22,
                    zIndex: 3,
                    fontWeight: 700,
                    fontSize: window.innerWidth < 600 ? 16 : 20,
                    color: labelColor,
                    textShadow: '0 1px 8px #fff7, 0 2px 12px #fff',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {val}%
                </span>
                {/* 높이 보정용(안보이는) */}
                <span style={{ opacity: 0, fontSize: window.innerWidth < 600 ? 16 : 20, fontWeight: 700 }}>|</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 설명 모달 */}
      {descModalVisible && (
        <dialog id="desc_modal" className="modal modal-open">
          <div className="modal-box text-center p-7 sm:p-10 rounded-2xl">
            <h3 className="font-bold text-lg sm:text-2xl mb-6">{t.detail || "분석 설명"}</h3>
            <p className="py-3 sm:py-4 text-base sm:text-lg leading-relaxed">{selectedDesc}</p>
            <div className="modal-action mt-7 sm:mt-8">
              <button
                onClick={() => setDescModalVisible(false)}
                className="btn btn-primary btn-md sm:btn-lg"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default FaceResultScreen;
