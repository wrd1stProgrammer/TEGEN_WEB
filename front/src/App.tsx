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

        <footer className="footer footer-center bg-base-300 text-base-content p-6">
          <aside>
            <p className="text-base">Copyright © 2025 - All right reserved by sern</p>
          </aside>
        </footer>
      </Router>
    </div>
  );
}

export default App;
