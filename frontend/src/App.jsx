import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AIJournal from './pages/AIJournal';
import UnfilteredZone from './pages/UnfilteredZone';
import StressBreak from './pages/StressBreak';
import WellnessJourney from './pages/WellnessJourney';
import SOSCircle from './pages/SOSCircle';
import ProfessionalSupport from './pages/ProfessionalSupport';
import ProfileSettings from './pages/ProfileSettings';
import Insights from './pages/Insights';
import VoiceSettings from './pages/VoiceSettings';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Protected Main App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<AIJournal />} />
            <Route path="/vent" element={<UnfilteredZone />} />
            <Route path="/stress-break" element={<StressBreak />} />
            <Route path="/journey" element={<WellnessJourney />} />
            <Route path="/support" element={<ProfessionalSupport />} />
            <Route path="/sos" element={<SOSCircle />} />
            
            {/* Profile & Settings (Includes Hidden Pages) */}
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/analytics" element={<Insights />} />
            <Route path="/voice-settings" element={<VoiceSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
