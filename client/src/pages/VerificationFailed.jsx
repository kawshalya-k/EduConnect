import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerificationFailed = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F8F6]">
      {/* Header */}
      <header className="w-full p-8 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM12 12.8L4.34 8.64L12 4.48L19.65 8.64L12 12.8Z" fill="white"/>
              <path d="M4 11.83V16.66L12 21L20 16.66V11.83L12 16.16L4 11.83Z" fill="white"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">EduConnect</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[448px] flex flex-col items-center relative">
          
          {/* Failed Icon */}
          <div className="relative w-[102.5px] h-[102.5px] flex items-center justify-center mb-6">
            {/* Background */}
            <div className="w-full h-full bg-[#FEE2E2] rounded-full flex items-center justify-center z-10">
              <AlertCircle className="w-[30px] h-[30px] text-[#DC2626]" strokeWidth={2} />
            </div>
          </div>

          <div className="text-center w-full mb-10">
            <h2 className="font-black text-[30px] leading-[36px] text-[#0F172A]">
              Verification Failed!
            </h2>
          </div>

          <div className="w-full flex flex-col gap-6">
            
            <div className="flex flex-row items-center gap-[10px]">
              <span className="font-semibold text-[14px] leading-[20px] text-[#334155]">
                Try Again with a Different Email
              </span>
              <Link to="/register" className="font-bold text-[14px] leading-[16px] text-[#10B981] hover:underline">
                Register Now
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[14px] leading-[20px] text-[#334155]">
                Do you think a mistake has occured?
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="button"
              className="w-full h-[52px] bg-[#10B981] rounded-lg shadow-[0px_10px_15px_-3px_rgba(13,242,89,0.2),0px_4px_6px_-4px_rgba(13,242,89,0.2)] hover:bg-[#0EA5E9] hover:shadow-[0px_10px_15px_-3px_rgba(14,165,233,0.2)] transition-all flex items-center justify-center gap-2 group"
              style={{ backgroundColor: '#10B981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              <span className="font-bold text-[16px] text-[#102216]">
                Contact Support
              </span>
              <ArrowRight className="w-[16px] h-[16px] text-[#102216] transform group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

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
      <footer className="w-full bg-[#022C22] py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-[#064E3B]">
        <p className="text-[#D1FAE5]/50 text-sm">
          © 2026 EduConnect. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link to="/privacy-policy" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/community-standards" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Community Standards</Link>
          <a href="#" className="text-[#D1FAE5]/50 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VerificationFailed;
