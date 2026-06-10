import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  ArrowLeft,
  Shield,
  Lock,
  Mail,
  Info,
  MailCheck,
  RefreshCcw,
  Send
} from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your university email');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'Reset link sent!');
      setTimeout(() => navigate('/check-inbox'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };
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
          
          <Link to="/login" className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 px-5 py-2 rounded-full transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#10B981]" />
            <span className="font-bold text-sm text-[#10B981]">Back to Login</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-20 flex justify-center items-center">
        
        {/* The Card */}
        <div className="bg-white rounded-2xl w-full max-w-[700px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
          
          <div className="p-10 pb-8 flex flex-col md:flex-row gap-12">
            {/* Left Column */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-10 md:pb-0 md:pr-10">
              
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl rotate-3 flex items-center justify-center mb-8 relative isolate">
                <div className="relative -rotate-3 flex items-center justify-center text-[#10B981]">
                  <Shield className="w-12 h-14" strokeWidth={1.5} fill="currentColor" />
                  <Lock className="w-5 h-5 absolute text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Forgot Password?</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                No worries! Enter your <span className="font-bold text-[#10B981]">.ac.lk</span> university email address and we will send you a link to reset your password.
              </p>
            </div>

            {/* Right Column (Form) */}
            <div className="flex-[1.2] flex flex-col justify-center">
              {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
              {successMsg && <div className="p-3 mb-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">{successMsg}</div>}

              <form onSubmit={handleSubmit} className="space-y-5 w-full">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    University Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="university@sab.ac.lk"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-8 bg-slate-50 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Why university email? To ensure account security, recovery links are only sent to verified academic addresses registered with the EduConnect platform.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section (Progress) */}
          <div className="border-t border-slate-50 bg-white px-10 py-8">
            <div className="flex justify-between items-start max-w-sm mx-auto relative mb-6">
              
              {/* Connector Lines */}
              <div className="absolute top-6 left-10 right-10 h-[2px] bg-slate-100 -z-10"></div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Enter Email</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                  <MailCheck className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Verify Link</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                  <RefreshCcw className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. New Password</span>
              </div>

            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-slate-400">
                Need help? <a href="#" className="font-bold text-[#10B981] hover:text-[#059669]">Contact Help Center</a>
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#022C22] py-8 w-full mt-auto border-t border-[#064E3B]">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/50">
          <p>© 2026 EduConnect. All rights reserved.</p>
          <a href="#" className="hover:text-emerald-100 transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
