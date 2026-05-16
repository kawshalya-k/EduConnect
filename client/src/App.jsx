import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import MentorDashboard from './pages/Mentor/MentorDashboard';

import VerificationCenter from './pages/Mentor/VerificationCenter';
import AddSkill from './pages/Mentor/AddSkill';
import VerifySkill from './pages/Mentor/VerifySkill';
import SuccessState from './pages/Mentor/SuccessState';
import FailedState from './pages/Mentor/FailedState';
import MentorDiscovery from './pages/MentorDiscovery';
import MentorProfile from './pages/MentorProfile';
import MentorSessions from './pages/Mentor/MentorSessions';


// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Mentor routes */}
          <Route path="/dashboard" element={<MentorDashboard />} />
          <Route path="/verification" element={<VerificationCenter />} />
          <Route path="/verification/add" element={<AddSkill />} />
          <Route path="/verification/verify" element={<VerifySkill />} />
          <Route path="/verification/skill/:skillId/start" element={<VerifySkill />} />
          <Route path="/verification/success" element={<SuccessState />} />
          <Route path="/verification/failed" element={<FailedState />} />

          {/* Learner / Discovery routes */}

          <Route path="/discovery" element={<MentorDiscovery />} />
          <Route path="/mentor/:mentorId" element={<MentorProfile />} />

          {/* Shared routes */}
          <Route path="/sessions" element={<MentorSessions />} />


          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;