import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import FinishSetup from './pages/FinishSetup';
import VerificationFailed from './pages/VerificationFailed';
import ProfileSetup from './pages/ProfileSetup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CommunityStandards from './pages/CommunityStandards';
import AccountSuccess from './pages/AccountSuccess';
import ForgotPassword from './pages/ForgotPassword';
import CheckInbox from './pages/CheckInbox';
import SetNewPassword from './pages/SetNewPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import SessionBooking from './pages/Sessions/SessionBooking';
import BookingConfirmed from './pages/Sessions/BookingConfirmed';
import MySessions from './pages/Sessions/MySessions';
import SessionFeedback from './pages/Sessions/SessionFeedback';
import SessionRoom from './pages/Sessions/SessionRoom';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import Analytics from './pages/Admin/Analytics';
import Settings from './pages/Admin/Settings';
import SkillVerifications from './pages/Admin/SkillVerifications';
import Notifications from './pages/Notifications';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<FinishSetup />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/community-standards" element={<CommunityStandards />} />
        <Route path="/account-success" element={<AccountSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-inbox" element={<CheckInbox />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/session-booking" element={<SessionBooking />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/session-feedback" element={<SessionFeedback />} />
        <Route path="/session-room" element={<SessionRoom />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/verifications" element={<SkillVerifications />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* Catch-all redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;