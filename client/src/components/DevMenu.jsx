import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routes = [
  { group: 'Main', paths: ['/'] },
  { group: 'Auth', paths: ['/login', '/register', '/verify-otp', '/verification-failed', '/account-success', '/forgot-password', '/check-inbox', '/set-new-password', '/password-reset-success'] },
  { group: 'Onboarding', paths: ['/profile-setup'] },
  { group: 'Learner', paths: ['/dashboard', '/find-mentor', '/MySessions', '/session-booking', '/booking-confirmed', '/session-feedback', '/session-room'] },
  { group: 'Admin', paths: ['/admin/dashboard', '/admin/users', '/admin/analytics', '/admin/settings', '/admin/verifications'] },
  { group: 'Legal', paths: ['/privacy-policy', '/terms-of-service', '/community-standards'] }
];

export default function DevMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-64 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 font-['Inter'] text-sm">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
            <h3 className="font-bold text-gray-800">Page Directory</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-800 font-bold">✕</button>
          </div>
          <div className="flex flex-col gap-5">
            {routes.map(group => (
              <div key={group.group}>
                <h4 className="font-bold text-[#10B77F] mb-1.5 uppercase text-[10px] tracking-wider">{group.group}</h4>
                <div className="flex flex-col gap-0.5">
                  {group.paths.map(path => (
                    <Link 
                      key={path} 
                      to={path} 
                      onClick={() => setIsOpen(false)}
                      className={`block py-1.5 px-3 rounded-lg transition-colors ${location.pathname === path ? 'bg-[#10B77F]/10 text-[#10B77F] font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                    >
                      {path === '/' ? '/ (Landing)' : path}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0F172A] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(15,23,42,0.5)] flex items-center justify-center hover:bg-slate-700 transition-colors"
        title="Page Directory"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/></svg>
      </button>
    </div>
  );
}
