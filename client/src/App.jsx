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

import './App.css';

function App() {
  return (
    <div className="App">
      <DevMenu />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<FinishSetup />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/community-standards" element={<CommunityStandards />} />
        <Route path="/account-success" element={<AccountSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-inbox" element={<CheckInbox />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/dashboard" element={<LearnerDashboard />} />
        <Route path="/find-mentor" element={<FindMentor />} />
        <Route path="/session-booking" element={<SessionBooking />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/session-feedback" element={<SessionFeedback />} />
        <Route path="/session-room" element={<SessionRoom />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/verifications" element={<SkillVerifications />} />
        <Route path="/notifications" element={<Notifications />} />
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
        {/* Catch-all redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;