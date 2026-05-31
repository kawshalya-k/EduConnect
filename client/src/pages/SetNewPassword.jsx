import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  RefreshCcw
} from 'lucide-react';

const SetNewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/reset-password', { token, newPassword: password });
      navigate('/password-reset-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900 flex flex-col">
      {/* Header - Top Navigation Bar */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#0F172A]">EduConnect</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-14 flex justify-center items-center">
        
        {/* Reset Password Card */}
        <div className="bg-white rounded-xl w-full max-w-[448px] border border-slate-200 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
          
          {/* Card Header Section */}
          <div className="relative bg-emerald-500/5 border-b border-slate-100 pt-28 pb-8 px-8 flex flex-col items-center text-center">
            
            {/* Floating Icon Badge */}
            <div className="absolute top-8 w-16 h-16 bg-white border border-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <RefreshCcw className="w-6 h-6 text-[#10B981]" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Set a New Password</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[320px]">
              Choose a strong password to protect your university account.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 flex flex-col gap-6">
            
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* New Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.6px]">
                  Password Requirements
                </h3>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-slate-600">At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-slate-600">One uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-slate-600">One special character</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-white font-bold py-3.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all mt-2"
              >
                {loading ? 'Updating...' : 'Update Password'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Cancel / Back Link */}
              <div className="flex justify-center mt-1">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Back to login
                </Link>
              </div>

            </form>
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

export default SetNewPassword;
