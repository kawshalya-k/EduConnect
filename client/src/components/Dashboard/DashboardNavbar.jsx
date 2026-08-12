import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';
import WalletWidget from '../Gamification/WalletWidget';
import logo from '../../Assets/educonnect-logo.svg';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = {
  mentor: [
    { label: 'Dashboard', to: '/mentor-dashboard', matchPrefixes: ['/mentor-dashboard'] },
    { label: 'Sessions',  to: '/mentor-sessions',  matchPrefixes: ['/mentor-sessions'] },
    { label: 'Messages',  to: '/messages',          matchPrefixes: ['/messages'] },
  ],
  learner: [
    { label: 'Dashboard', to: '/learner-dashboard', matchPrefixes: ['/learner-dashboard'] },
    { label: 'Sessions',  to: '/my-sessions',       matchPrefixes: ['/my-sessions', '/session-booking', '/booking-confirmed', '/session-feedback', '/session-room'] },
    { label: 'Messages',  to: '/messages',          matchPrefixes: ['/messages'] },
  ],
};

const DashboardNavbar = ({ logoOnlyIfLoggedOut = false, logoOnly = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { user, mode, logout } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine role reactively based on persistent storage
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('activeRole');
    if (savedRole) return savedRole;
    return currentPath.startsWith('/mentor') ? 'mentor' : 'learner';
  });

  // Re-evaluate whenever the route changes or mode changes
  useEffect(() => {
    const savedRole = localStorage.getItem('activeRole');
    if (savedRole) {
      setRole(savedRole);
    } else {
      setRole(mode || (currentPath.startsWith('/mentor') ? 'mentor' : 'learner'));
    }
  }, [currentPath, mode]);

  const links = NAV_LINKS[role] || NAV_LINKS.learner;

  const isActive = (matchPrefixes) =>
    matchPrefixes.some((prefix) => currentPath.startsWith(prefix));

  return (
    <nav className="flex flex-col items-start px-8 w-full h-16 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex flex-row justify-between items-center w-full max-w-[1216px] h-16 mx-auto">

        {/* Logo */}
        <Link to="/" className="flex flex-row items-center gap-[7px] w-[127px] h-[26px]">
          <img src={logo} alt="EduConnect Logo" className="w-[26px] h-[26px]" />
          <span className="font-sans font-bold text-base leading-7 flex items-center tracking-[-0.5px] text-[#0F172A]">
            EduConnect
          </span>
        </Link>

        {/* Nav Links & Controls */}
        {(logoOnly || (!user && logoOnlyIfLoggedOut)) ? null : (
          <div className="flex flex-row items-center gap-6 h-9">
            {user ? (
              <>
                {/* Nav Links */}
                <div className="flex flex-row items-center gap-6 h-[26px]">
                  {links.map(({ label, to, matchPrefixes }) => {
                    const active = isActive(matchPrefixes);
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex flex-col items-start pb-1 ${active ? 'border-b-2 border-[#10B981]' : ''}`}
                      >
                        <span className={`font-sans font-medium text-sm leading-5 flex items-center ${active ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
                          {label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Vertical Divider */}
                <div className="flex flex-col items-start px-2 h-6">
                  <div className="w-px h-6 bg-[#E2E8F0]" />
                </div>

                {/* Role Switcher */}
                <RoleSwitcher />

                {/* Skill Wallet */}
                <WalletWidget />

                {/* Notifications */}
                <Link to="/notifications" className="w-6 h-6 relative cursor-pointer flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[19px]">
                    <path d="M12 2C10.3431 2 9 3.34315 9 5V5.5C9 7.98528 7.32135 10.1534 4.89803 10.7592C4.19561 10.9348 3.55395 11.2338 3.01839 11.6353C2.38318 12.1114 2 12.8711 2 13.6667V14C2 15.6569 3.34315 17 5 17H19C20.6569 17 22 15.6569 22 14V13.6667C22 12.8711 21.6168 12.1114 20.9816 11.6353C20.446 11.2338 19.8044 10.9348 19.102 10.7592C16.6786 10.1534 15 7.98528 15 5.5V5C15 3.34315 13.6569 2 12 2Z" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M9 17V18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18V17" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex flex-col items-start w-9 h-9 cursor-pointer focus:outline-none"
                  >
                    <div className="box-border flex flex-col justify-center items-start w-9 h-9 bg-[#E2E8F0] border-2 border-[#10B981]/30 rounded-full overflow-hidden hover:border-[#10B981]/60 transition-all">
                      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mt-2 text-slate-400">
                        <circle cx="16" cy="12" r="6" fill="currentColor"/>
                        <path d="M6 28C6 22.4772 10.4772 18 16 18C21.5228 18 26 22.4772 26 28" fill="currentColor"/>
                      </svg>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all font-medium text-left"
                      >
                        My Profile
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          window.location.href = '/';
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all font-semibold"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest / Public Links */}
                <Link
                  to="/discovery"
                  className={`flex flex-col items-start pb-1 ${currentPath === '/discovery' ? 'border-b-2 border-[#10B981]' : ''}`}
                >
                  <span className={`font-sans font-medium text-sm leading-5 flex items-center ${currentPath === '/discovery' ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
                    Explore Mentors
                  </span>
                </Link>

                {/* Vertical Divider */}
                <div className="flex flex-col items-start px-2 h-6">
                  <div className="w-px h-6 bg-[#E2E8F0]" />
                </div>

                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 text-sm font-semibold py-2 px-4 transition-all"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer inline-block text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;