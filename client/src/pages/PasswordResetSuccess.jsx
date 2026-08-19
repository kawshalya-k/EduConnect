import React from 'react';
import { 
  Check,
  AlertTriangle,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900 flex flex-col">
      {/* Header - Top Navigation Bar */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#0F172A]">EduConnect</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm text-[#0F172A]">Alex Rivera</span>
            <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
              <User className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12 flex justify-center items-center">
        
        {/* Success Card */}
        <div className="bg-white rounded-xl w-full max-w-[520px] border border-slate-200 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col relative mt-16">
          
          {/* Floating Glow Badge */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            {/* The glow effect */}
            <div className="absolute inset-[-24px] bg-emerald-500/15 blur-xl rounded-full -z-10"></div>
            {/* The badge */}
            <div className="w-[102px] h-[102px] bg-[#10B981] rounded-full flex items-center justify-center shadow-lg">
              <div className="w-[54px] h-[54px] bg-white rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-[#10B981]" strokeWidth={4} />
              </div>
            </div>
          </div>

          <div className="px-12 pt-20 pb-8 flex flex-col items-center text-center">
            
            {/* Hero Image Snippet */}
            <div className="w-full h-32 rounded-lg overflow-hidden relative mb-10 shadow-sm border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000" 
                alt="University Campus" 
                className="w-full h-full object-cover"
              />
              {/* Subtle Dark Overlay */}
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px]"></div>
            </div>

            {/* Typography */}
            <h1 className="text-3xl font-bold text-[#0F172A] mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-[410px]">
              Your security is our priority. You can now use your new password to access your EduConnect account and continue your learning journey.
            </p>

            {/* Action Button */}
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all mt-10 cursor-pointer"
            >
              Back to Login
            </button>

          </div>

          {/* Secondary Note Box */}
          <div className="px-8 pb-8 pt-4 border-t border-slate-50 mt-2">
            <div className="w-full bg-slate-50 rounded-lg p-4 flex items-start gap-3 border border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                <span className="font-semibold text-[#0F172A]">Didn't perform this action?</span> Please <a href="#" className="text-[#10B981] hover:text-[#059669] transition-colors">contact university IT support</a> immediately to secure your account.
              </p>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PasswordResetSuccess;
