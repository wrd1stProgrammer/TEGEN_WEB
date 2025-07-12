// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './screens/survey/WelcomeScreen';
import GenderScreen from './screens/survey/GenderScreen';
import MediaSelectionScreen from './screens/faceAI/MediaSelectionScreen';
import FaceResultScreen from './screens/MainSceen/FaceResultScreen';
import InfoScreen from './screens/MainSceen/InfoScreen';
import SurveyScreen from './screens/survey/SurveyScreen';
import FaceTestScreen from './screens/survey/FaceTestScreen';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Router>
        {/* 메인 라우팅 영역 */}
        <main className="flex-grow max-w-screen-lg mx-auto p-8">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/gender" element={<GenderScreen />} />
            <Route path="/media-selection" element={<MediaSelectionScreen />} />
            <Route path="/face-result" element={<FaceResultScreen />} />
            <Route path="/info" element={<InfoScreen />} />
            <Route path="/survey" element={<SurveyScreen />} />
            <Route path="/face-test" element={<FaceTestScreen />} />
          </Routes>
        </main>

        {/* 푸터 */}
        <footer className="footer footer-center bg-base-300 text-base-content p-6">
          {/* 링크 모음: Privacy & SNS (세로 배치) */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <a
              href="https://kind-walkover-f46.notion.site/226566b53c5b802cb11dd952e8a74b12?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              /* 글씨를 둥글둥글한 배지 형태 + 밑줄 제거 */
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

          {/* 저작권 및 개발자 정보 */}
          <aside>
            <p className="text-sm">© 2025 Developed by @mins2k</p>
          </aside>
        </footer>
      </Router>
    </div>
  );
}

export default App;
