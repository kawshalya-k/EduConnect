import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import FinishSetup from './pages/FinishSetup';
import VerificationFailed from './pages/VerificationFailed';
import ProfileSetup from './pages/ProfileSetup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CommunityStandards from './pages/CommunityStandards';

function App() {
  // 'landing', 'login', or 'register'
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="App">
      {/* Navigation Logic */}
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'login' && <Login />}
      {currentView === 'register' && <Register />}
      {currentView === 'finish-setup' && <FinishSetup />}
      {currentView === 'verification-failed' && <VerificationFailed />}
      {currentView === 'profile-setup' && <ProfileSetup />}
      {currentView === 'privacy-policy' && <PrivacyPolicy />}
      {currentView === 'terms-of-service' && <TermsOfService />}
      {currentView === 'community-standards' && <CommunityStandards />}

      {/* --- Temporary Navigation Helper --- */}
      {/* This will help you present your work to your lecturers easily */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-2xl border border-emerald-100">
        <button 
          onClick={() => setCurrentView('landing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'landing' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Landing
        </button>
        <button 
          onClick={() => setCurrentView('login')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'login' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setCurrentView('register')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'register' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Register
        </button>
        <button 
          onClick={() => setCurrentView('finish-setup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'finish-setup' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Setup
        </button>
        <button 
          onClick={() => setCurrentView('verification-failed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'verification-failed' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Failed
        </button>
        <button 
          onClick={() => setCurrentView('profile-setup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'profile-setup' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setCurrentView('privacy-policy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'privacy-policy' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Privacy
        </button>
        <button 
          onClick={() => setCurrentView('terms-of-service')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'terms-of-service' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Terms
        </button>
        <button 
          onClick={() => setCurrentView('community-standards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'community-standards' ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Community
        </button>
      </div>
    </div>
  );
}

export default App;