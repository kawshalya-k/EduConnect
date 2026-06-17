import React, { useState } from 'react';
import { Check, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FinishSetup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="w-full p-8 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM12 12.8L4.34 8.64L12 4.48L19.65 8.64L12 12.8Z" fill="white" />
              <path d="M4 11.83V16.66L12 21L20 16.66V11.83L12 16.16L4 11.83Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-900">EduConnect</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[448px] flex flex-col items-center relative">

          {/* Success Icon */}
          <div className="relative w-[102.25px] h-[102.25px] flex items-center justify-center mb-6">
            {/* Overlay Blur */}
            <div className="absolute -inset-[27px] bg-[#10B981]/10 blur-[12px] rounded-full -z-10"></div>
            {/* Background */}
            <div className="w-full h-full bg-[#10B981] rounded-full flex items-center justify-center z-10 shadow-lg shadow-[#10B981]/20">
              <div className="w-[54.25px] h-[54.25px] bg-white rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-[#10B981]" strokeWidth={4} />
              </div>
            </div>
          </div>

          <div className="text-center w-full mb-10 space-y-2">
            <h2 className="font-black text-[30px] leading-[36px] text-[#0F172A]">
              Verification Successful!
            </h2>
            <p className="font-normal text-[16px] leading-[24px] text-[#475569]">
              Finish setting up your account.
            </p>
          </div>

          <form className="w-full flex flex-col gap-6">

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[14px] leading-[20px] text-[#334155]">
                Password
              </label>
              <div className="relative w-full h-[50px]">
                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="w-[18px] h-[18px] text-[#94A3B8]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-full bg-white border border-[#E2E8F0] rounded-lg pl-12 pr-12 text-[16px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 pr-4 flex items-center z-10 text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>

            {/* Re-enter Password Input */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[14px] leading-[20px] text-[#334155]">
                Re-enter Password
              </label>
              <div className="relative w-full h-[50px]">
                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="w-[18px] h-[18px] text-[#94A3B8]" />
                </div>
                <input
                  type={showRePassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-full bg-white border border-[#E2E8F0] rounded-lg pl-12 pr-12 text-[16px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)}
                  className="absolute right-0 top-0 bottom-0 pr-4 flex items-center z-10 text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showRePassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white border border-[#CBD5E1] rounded text-[#10B981] focus:ring-[#10B981] focus:ring-offset-0 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-[14px] leading-[20px] text-[#475569]">
                I agree to the <Link to="/terms-of-service" className="text-[#10B981] hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-[#10B981] hover:underline">Privacy Policy</Link>.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => navigate('/profile-setup')}
              className="mt-2 w-full h-[52px] bg-[#10B981] rounded-lg shadow-[0px_10px_15px_-3px_rgba(13,242,89,0.2),0px_4px_6px_-4px_rgba(13,242,89,0.2)] hover:bg-[#0EA5E9] hover:shadow-[0px_10px_15px_-3px_rgba(14,165,233,0.2)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              style={{ backgroundColor: '#10B981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              <span className="font-bold text-[16px] text-[#102216]">
                Create Account
              </span>
              <ArrowRight className="w-5 h-5 text-[#102216] transform group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          {/* Footer Link */}
          <div className="mt-16 pt-8 border-t border-[#F1F5F9] w-full flex justify-center items-center gap-2">
            <span className="text-[16px] text-[#475569]">
              Already have an account?
            </span>
            <Link to="/login" className="font-bold text-[16px] text-[#10B981] hover:underline">
              Log In
            </Link>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full bg-[#0F291E] py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <p className="text-white/60 text-sm">
          © 2026 EduConnect. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/community-standards" className="text-white/60 hover:text-white transition-colors">Community Standards</Link>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FinishSetup;
