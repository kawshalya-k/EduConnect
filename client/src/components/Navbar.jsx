import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900">EduConnect</span>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="bg-[#10B981] text-white text-sm font-bold py-2.5 px-5 rounded-xl hover:bg-[#059669] transition-all cursor-pointer inline-block text-center">
          Log In
        </Link>
        <Link to="/register" className="bg-[#10B981] text-white text-sm font-bold py-2.5 px-5 rounded-xl hover:bg-[#059669] transition-all cursor-pointer inline-block text-center">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;