import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/config/store';
import { type LangCode, translations } from '../../utils/translations';
import { VictoryChart, VictoryPolarAxis, VictoryGroup, VictoryArea, VictoryTheme } from 'victory';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

interface SurveyScore {
  cat: string;
  score: number;
}

interface ResultScreenState {
  answers: number[];
  gender: '남' | '여';
  score: {
    catScores: SurveyScore[];
    total: number;
    type: string;
  };
}

const CHART_SIZE = 250; // Adjusted size for web

const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state as ResultScreenState;

  const lang = useSelector((state: RootState) => state.language.lang) as LangCode;
  const t = translations.resultTranslations[lang];

  if (!score) {
    return <div className="flex justify-center items-center h-screen text-lg font-bold">No result data available.</div>;
  }

  const values = score.catScores.map(c => c.score);
  const categories = score.catScores.map(c => c.cat);

  const data = categories.map((cat, index) => ({
    x: cat,
    y: values[index],
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4">
      <div className="w-full max-w-md flex justify-start mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle btn-sm">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-xl text-center p-6 sm:p-8">
        <div className="card-body p-0">
          <h1 className="card-title justify-center text-2xl sm:text-3xl font-bold text-neutral-content mb-6">{t.title}</h1>

          <div className="flex justify-center mb-6">
            <VictoryChart polar theme={VictoryTheme.material} width={CHART_SIZE} height={CHART_SIZE} padding={50} domain={{ y: [0, 100] }}>
              {categories.map((cat, i) => (
                <VictoryPolarAxis
                  key={i}
                  dependentAxis
                  axisValue={cat}
                  label={cat}
                  labelPlacement="perpendicular"
                  style={{
                    axis: { stroke: '#E6D8E8', strokeWidth: 1.3 },
                    axisLabel: { fontSize: 12, fill: '#4B4B4B', fontWeight: '600' },
                    grid: { stroke: '#F7BFD8', strokeDasharray: '4,9' },
                    tickLabels: { fill: 'transparent' },
                  }}
                  tickValues={[20, 40, 60, 80, 100]}
                />
              ))}
              <VictoryGroup colorScale={['#FF3B30']} style={{ data: { fillOpacity: 0.3, strokeWidth: 2.5 } }}>
                <VictoryArea data={data} />
                <VictoryScatter data={data} size={4} style={{ data: { fill: '#FF3B30', stroke: '#fff', strokeWidth: 1.5 } }} />
              </VictoryGroup>
            </VictoryChart>
          </div>

          <div className="alert alert-success shadow-lg mb-6 p-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{score.type}</h2>
              <p className="text-base sm:text-lg">총점: {score.total.toFixed(0)}점</p>
            </div>
          </div>

          <h3 className="font-bold text-xl sm:text-2xl text-neutral-content mt-4 mb-3">{t.categoryScores}</h3>
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            {score.catScores.map((c, i) => (
              <div key={c.cat} className="stat place-items-center p-3">
                <div className="stat-title text-sm sm:text-base">{c.cat}</div>
                <div className="stat-value text-primary text-xl sm:text-2xl">{c.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary btn-lg flex-1 rounded-full text-base sm:text-lg"
        >
          {t.retry}
        </button>
        <button
          onClick={() => alert(t.makeFriends + ' (기능 미구현)')}
          className="btn btn-primary btn-lg flex-1 rounded-full text-base sm:text-lg"
        >
          {t.makeFriends}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
