import React from 'react';
import { 
  ArrowLeft,
  MailCheck,
  RefreshCcw,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const CheckInbox = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900 flex flex-col">
      {/* Header - Top Navigation Bar */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#0F172A]">EduConnect</span>
          </div>
          {/* No right-side elements for this focused page */}
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-20 flex justify-center items-center">
        
        {/* The Card */}
        <div className="bg-white rounded-xl w-full max-w-[480px] border border-slate-100 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          
          {/* Top Visual Accent */}
          <div className="h-32 bg-emerald-500/10 border-b border-slate-50 flex items-center justify-center">
            {/* The Badge */}
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <MailCheck className="w-10 h-10 text-[#10B981]" strokeWidth={2} />
            </div>
          </div>

          {/* Card Body */}
          <div className="px-10 py-10 flex flex-col items-center flex-1">
            
            {/* Text Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Check Your Inbox</h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-[340px] mx-auto">
                We've sent a secure password reset link to <span className="font-bold text-[#0F172A]">university@sab.ac.lk</span>. Please check your university email to continue.
              </p>
            </div>

            {/* Resend Button */}
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-lg shadow-md shadow-emerald-500/10 transition-all mb-8"
            >
              <RefreshCcw className="w-4 h-4" />
              Resend Link
            </button>

            {/* Tips Section */}
            <div className="w-full bg-slate-50 rounded-lg p-4 flex gap-3 mb-8">
              <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Can't find it? Check your Spam or Promotions folder, or wait a few minutes for the server to process.
              </p>
            </div>

            {/* Back to Login Link */}
            <Link to="/login" className="flex items-center gap-1.5 text-[#10B981] font-semibold text-base hover:text-[#059669] transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Login
            </Link>

          </div>

          {/* Subtle Footer inside card */}
          <div className="w-full py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[1.2px]">
              University Student Portal
            </span>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CheckInbox;
