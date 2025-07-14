import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { VictoryChart, VictoryPolarAxis, VictoryGroup, VictoryArea, VictoryScatter, VictoryTheme } from 'victory';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// Interface definitions (assuming they are correct and unchanged)
interface ScoreData {
  score: number;
  desc: string;
}
export interface Scores {
  expression: ScoreData;
  face_shape: ScoreData;
  physiognomy: ScoreData;
  style: ScoreData;
  atmosphere: ScoreData;
  total?: ScoreData;
}
interface FaceResultScreenProps {
  scores: Scores | null;
  sex: '남' | '여';
  photoUri: string | null;
  onBack: () => void;
}

// Adjusted constants for better PC screen ratio
const CHART_SIZE_MOBILE = 220;
const CHART_SIZE_PC = 320; // Reduced from 350

const barGradients = [
  { from: '#fa7bff', to: '#fcdff4' }, // Pink
  { from: '#43e97b', to: '#38f9d7' }, // Green
  { from: '#38b6ff', to: '#ecf5ff' }, // Blue
  { from: '#ffd66c', to: '#ffd6e0' }, // Yellow
  { from: '#b388ff', to: '#f3e8ff' }, // Purple
];
const barLabelColors = [
  '#fa7bff', '#43e97b', '#38b6ff', '#ffd66c', '#b388ff'
];

const FaceResultScreen: React.FC<FaceResultScreenProps> = ({ scores, sex, photoUri, onBack }) => {
  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const t = translations.faceResultTranslations[lang];
  
  // State to manage which description is currently shown, null if none
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  if (!scores || !photoUri) {
    return <div>결과를 표시할 수 없습니다.</div>;
  }

  const axes = [
    { key: 'expression', label: t.axes.expression },
    { key: 'face_shape', label: t.axes.face_shape },
    { key: 'physiognomy', label: t.axes.physiognomy },
    { key: 'style', label: t.axes.style },
    { key: 'atmosphere', label: t.axes.atmosphere },
  ];
  const data = axes.map(a => ({ x: a.label, y: scores[a.key as keyof Scores].score }));

  // Responsive values (PC sizes adjusted)
  const isMobile = window.innerWidth < 600;
  const chartSize = isMobile ? CHART_SIZE_MOBILE : CHART_SIZE_PC;
  const avatarSize = isMobile ? 92 : 120; // Reduced from 132
  const badgeFont = isMobile ? 13 : 16; // Reduced from 17
  const summaryFont = isMobile ? 15 : 16; // Reduced from 18
  const gaugeHeight = isMobile ? 40 : 50; // Reduced from 54
  const gaugeFont = isMobile ? 16 : 18; // Reduced from 20

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

  const handleBarClick = (key: string) => {
    // Toggle description: if the same key is clicked, close it. Otherwise, open the new one.
    setSelectedKey(prevKey => (prevKey === key ? null : key));
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-160px)] px-1 py-2 sm:px-4 sm:py-8 bg-base-200 transition-all overflow-y-auto">
      {/* Back Button */}
      <div className="w-full max-w-lg flex justify-start mb-2 sm:mb-6">
        <button
          onClick={onBack}
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

      {/* Result Card */}
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl p-5 sm:p-10 flex flex-col items-center">
        {/* Profile Image + Badge */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{
            width: avatarSize, height: avatarSize, borderRadius: '50%',
            overflow: 'hidden', border: `4px solid ${color}`,
            boxShadow: '0 4px 16px rgba(240,120,210,0.13)', margin: '0 auto', background: '#f3f4f6'
          }}>
            <img src={photoUri} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            position: 'absolute', right: -8, bottom: 0,
            background: color, color: '#fff', fontWeight: 700,
            borderRadius: '1.7rem', padding: '5px 18px',
            fontSize: badgeFont, letterSpacing: '-0.01em', boxShadow: '0 2px 9px 0 rgba(230,110,180,0.17)'
          }}>
            {resultLabel}
          </div>
        </div>

        {/* Summary Description */}
        <div
          className="shadow mb-5 py-3 px-4 rounded-xl"
          style={{
            background: 'linear-gradient(95deg,#f1f8fd,#fbe9fb 55%)', color: '#4B4B4B',
            fontSize: summaryFont, fontWeight: 500, lineHeight: 1.5
          }}>
          <span>{scores.total?.desc}</span>
        </div>

        {/* Radar Chart */}
        <div className="w-full flex flex-col items-center py-1 sm:py-4">
          <h2 className="card-title text-xl sm:text-3xl font-bold text-primary mb-4 sm:mb-8">{t.title}</h2>
          <VictoryChart polar theme={VictoryTheme.material} width={chartSize} height={chartSize} padding={isMobile ? 35 : 50} domain={{ y: [0, 100] }}>
            {axes.map((a, i) => (
              <VictoryPolarAxis key={i} dependentAxis axisValue={a.label} label={a.label} labelPlacement="perpendicular"
                style={{
                  axis: { stroke: '#E6D8E8', strokeWidth: 1.1 },
                  axisLabel: { fontSize: isMobile ? 12 : 15, fill: '#4B4B4B', fontWeight: 600 }, // PC Font smaller
                  grid: { stroke: '#F7BFD8', strokeDasharray: '4,9' },
                  tickLabels: { fill: 'transparent' },
                }}
                tickValues={[20, 40, 60, 80, 100]}
              />
            ))}
            <VictoryGroup colorScale={[color]} style={{ data: { fillOpacity: 0.29, strokeWidth: 2.3 } }}>
              <VictoryArea data={data} />
              <VictoryScatter data={data} size={isMobile ? 3.3 : 4} style={{ data: { fill: color, stroke: '#fff', strokeWidth: 1.2 } }} />
            </VictoryGroup>
          </VictoryChart>
          <div className="badge badge-outline badge-primary mt-6 text-sm sm:text-base">
            <p className="font-medium">{t.radarExplain}</p>
          </div>
        </div>

        {/* Detailed Score Gauges */}
        <div className="w-full mt-8">
          <p className="text-center text-sm sm:text-base text-gray-500 mb-4">각 항목을 클릭하여 자세한 설명을 확인하세요.</p>
          {axes.map((a, i) => {
            const val = scores[a.key as keyof Scores].score ?? 0;
            const desc = scores[a.key as keyof Scores].desc ?? '설명이 없습니다.';
            const fg = barGradients[i % barGradients.length].from;
            const to = barGradients[i % barGradients.length].to;
            const labelColor = barLabelColors[i % barLabelColors.length];
            const isSelected = selectedKey === a.key;

            return (
              <React.Fragment key={i}>
                {/* Clickable Gauge Bar */}
                <div
                  onClick={() => handleBarClick(a.key)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: isSelected ? 0 : (isMobile ? 14 : 18), // Adjust margin when description is open
                    display: 'flex', alignItems: 'center', height: gaugeHeight,
                    borderRadius: 999, background: '#fff',
                    boxShadow: '0 1.5px 6px 0 rgba(220,220,220,0.08)',
                    position: 'relative', overflow: 'hidden', userSelect: 'none',
                    transition: 'margin-bottom 0.3s ease'
                  }}
                >
                  <div style={{
                    height: '100%', width: `${val}%`,
                    background: `linear-gradient(90deg, ${fg} 25%, ${to} 100%)`, borderRadius: 999,
                    transition: 'width 0.8s cubic-bezier(.4,1.5,.58,1)',
                    position: 'absolute', top: 0, left: 0, zIndex: 1,
                  }} />
                  <span style={{
                    position: 'absolute', left: 18, fontWeight: 700, color: 'white',
                    zIndex: 2, fontSize: gaugeFont, textShadow: '0 1px 8px #fff6', letterSpacing: '-0.01em'
                  }}>{a.label}</span>
                  <span style={{
                    position: 'absolute', right: 22, zIndex: 3, fontWeight: 700,
                    fontSize: gaugeFont, color: labelColor,
                    textShadow: '0 1px 8px #fff7, 0 2px 12px #fff', letterSpacing: '-0.01em'
                  }}>{val}%</span>
                </div>

                {/* Inline Description (replaces modal) */}
                {isSelected && (
                  <div style={{
                    padding: '16px 20px',
                    margin: '10px 4px 18px 4px', // Top, horizontal, bottom
                    background: '#f8f9fc',
                    borderRadius: '16px',
                    border: '1px solid #eef2f7',
                    color: '#4B4B4B',
                    fontSize: isMobile ? 14 : 15,
                    lineHeight: 1.6,
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}>
                    <p>{desc}</p>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* CSS for fadeIn animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FaceResultScreen;