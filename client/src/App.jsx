import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import FinishSetup from './pages/FinishSetup';
import VerificationFailed from './pages/VerificationFailed';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CommunityStandards from './pages/CommunityStandards';
import AccountSuccess from './pages/AccountSuccess';
import ForgotPassword from './pages/ForgotPassword';
import CheckInbox from './pages/CheckInbox';
import SetNewPassword from './pages/SetNewPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import LearnerDashboard from './pages/LearnerDashboard';
import FindMentor from './pages/FindMentor';
import SessionBooking from './pages/Sessions/SessionBooking';
import BookingConfirmed from './pages/Sessions/BookingConfirmed';
import MySessions from './pages/Sessions/MySessions';
import SessionFeedback from './pages/Sessions/SessionFeedback';
import SessionRoom from './pages/Sessions/SessionRoom';
import BadgesPage from './pages/BadgesPage';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import Analytics from './pages/Admin/Analytics';
import Settings from './pages/Admin/Settings';
import SkillVerifications from './pages/Admin/SkillVerifications';
import Notifications from './pages/Notifications';
import DevMenu from './components/DevMenu';
import ScrollToTop from './components/ScrollToTop';
//Mentor
import MentorDashboard from './pages/Mentor/MentorDashboard';
import VerificationCenter from './pages/Mentor/VerificationCenter';
import AddSkill from './pages/Mentor/AddSkill';
import VerifySkill from './pages/Mentor/VerifySkill';
import SuccessState from './pages/Mentor/SuccessState';
import FailedState from './pages/Mentor/FailedState';
import MentorSessions from './pages/Mentor/MentorSessions';
// Discovery
import MentorDiscovery from './pages/MentorDiscovery';
import MentorProfile from './pages/MentorProfile';
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import { useAuth } from './context/AuthContext';
//common
import SkillWallet from './pages/SkillWallet';
import Messages    from './pages/Messages';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#F6F8F7] flex items-center justify-center font-sans">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { mode } = useAuth();
  return (
    <div className="App">
      <ScrollToTop />
      <DevMenu />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/community-standards" element={<CommunityStandards />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-inbox" element={<CheckInbox />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        
        {/* Public Discovery Routes */}
        <Route path="/discovery" element={<MentorDiscovery />} />
        <Route path="/mentor/:mentorId" element={<MentorProfile />} />

        {/* Protected Routes */}
        <Route path="/verify-otp" element={<FinishSetup />} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/account-success" element={<ProtectedRoute><AccountSuccess /></ProtectedRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute>{mode === 'mentor' ? <MentorDashboard /> : <LearnerDashboard />}</ProtectedRoute>} />
        <Route path="/learner-dashboard" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
        <Route path="/find-mentor" element={<ProtectedRoute><FindMentor /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/session-booking" element={<ProtectedRoute><SessionBooking /></ProtectedRoute>} />
        <Route path="/booking-confirmed" element={<ProtectedRoute><BookingConfirmed /></ProtectedRoute>} />
        <Route path="/my-sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
        <Route path="/session-feedback" element={<ProtectedRoute><SessionFeedback /></ProtectedRoute>} />
        <Route path="/session-room" element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin/verifications" element={<ProtectedRoute><SkillVerifications /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        
        {/* Mentor Routes */}
        <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><VerificationCenter /></ProtectedRoute>} />
        <Route path="/verification/add" element={<ProtectedRoute><AddSkill /></ProtectedRoute>} />
        <Route path="/verification/verify" element={<ProtectedRoute><VerifySkill /></ProtectedRoute>} />
        <Route path="/verification/skill/:skillId/start" element={<ProtectedRoute><VerifySkill /></ProtectedRoute>} />
        <Route path="/verification/success" element={<ProtectedRoute><SuccessState /></ProtectedRoute>} />
        <Route path="/verification/failed" element={<ProtectedRoute><FailedState /></ProtectedRoute>} />
        
        {/* Shared/Other Protected Routes */}
        <Route path="/mentor-sessions" element={<ProtectedRoute><MentorSessions /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/wallet"   element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/mentor-wallet" element={<ProtectedRoute><SkillWallet /></ProtectedRoute>} />
        
        {/* Catch-all redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;