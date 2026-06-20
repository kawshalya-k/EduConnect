import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Wallet } from 'lucide-react';

const MentorNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 bg-[#10B981] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">EduConnect</span>
        </div>

        {/* Nav Links & Controls */}
        <div className="flex items-center gap-6">
          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`pb-1 ${location.pathname === '/dashboard' ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/my-sessions"
              className={`pb-1 ${location.pathname === '/my-sessions' || location.pathname.startsWith('/session') ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sessions
            </Link>
            <Link
              to="/messages"
              className={`pb-1 ${location.pathname === '/messages' ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Messages
            </Link>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* Role Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
              Mentor
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-[#10B981] rounded-md shadow-sm">
              Learner Mode
            </button>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg cursor-pointer">
            <Wallet className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-bold text-[#10B981]">100 SC</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile */}
          <Link to="/profile" className="w-9 h-9 rounded-full border-2 border-emerald-200 overflow-hidden cursor-pointer">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=E2E8F0" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MentorNav;
