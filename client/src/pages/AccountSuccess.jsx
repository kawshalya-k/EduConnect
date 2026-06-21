import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Users,
  LayoutGrid,
  Search,
  ArrowRight,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm cursor-pointer">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=User&background=0F172A&color=fff`} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-8 py-20 flex justify-center items-center">
        <div className="max-w-[1152px] w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Side: Hero Illustration */}
          <div
            className="w-full h-[536px] rounded-3xl border border-emerald-400/20 flex flex-col items-center justify-center p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 50%, rgba(16, 185, 129, 0.05) 100%)'
            }}
          >
            <div className="w-48 h-48 bg-emerald-400/20 rounded-full flex items-center justify-center mb-10 shadow-inner">
              <ShieldCheck className="w-20 h-20 text-[#10B981]" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">You're ready to go!</h2>
            <p className="text-slate-600 text-lg">Join thousands of learners and mentors today.</p>
          </div>

          {/* Right Side: Content & Actions */}
          <div className="flex flex-col space-y-8">

            <div className="space-y-4">
              <h1 className="text-4xl md:text-[40px] font-extrabold text-[#0F172A] uppercase tracking-wide leading-tight">
                Welcome to the<br />Movement!
              </h1>
              <p className="text-lg text-slate-500 font-light leading-relaxed max-w-md">
                Your professional journey towards collaborative learning starts right here.
              </p>
            </div>

            {/* Onboarding Summary Card */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-5">
              <h4 className="text-sm font-bold text-[#10B981] uppercase tracking-widest">
                Onboarding Summary
              </h4>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-start gap-4">
                  <UserCheck className="w-[22px] h-[22px] text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-[#0F172A]">Account created</h5>
                    <p className="text-sm text-slate-500">{user?.name || 'User'}</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-[22px] h-[22px] text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-[#0F172A] mb-1.5">Skills verified</h5>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-[#10B981] text-xs font-medium rounded">
                        UI Design
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-[#10B981] text-xs font-medium rounded">
                        React
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-4">
                  <Users className="w-[22px] h-[22px] text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-[#0F172A]">Role Assigned</h5>
                    <p className="text-sm text-slate-500">Learner & Mentor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Next Steps */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0F172A]">Suggested Next Steps</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <LayoutGrid className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <span className="font-semibold text-[#0F172A]">Explore Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/discovery')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <span className="font-semibold text-[#0F172A]">Browse Mentors</span>
                </button>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/learner-dashboard')}
                className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 text-slate-600 font-medium py-3 rounded-xl transition-all">
                Take a Tour <Rocket className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#022C22] py-8 w-full mt-auto">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/50">
          <p>© 2026 EduConnect. All rights reserved.</p>
          <a href="#" className="hover:text-emerald-100 transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default AccountSuccess;
