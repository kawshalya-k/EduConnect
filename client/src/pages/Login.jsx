import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import logo from '../Assets/educonnect-logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const { login, setMode } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe
      });
      login(res.data.user, res.data.token);
      // Ensure learner dashboard is the default after login
      if (setMode) {
        setMode('learner');
        localStorage.setItem('educonnect_mode', 'learner');
        localStorage.setItem('activeRole', 'learner');
      }
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => navigate('/dashboard'), 1000); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-sans">
      <main className="flex flex-1 w-full">
      {/* LEFT SIDE: Brand & Impact (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#ECFDF5] items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#10B981] opacity-20 blur-[64px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#10B981] opacity-20 blur-[64px] rounded-full"></div>
        
        <div className="max-w-md w-full space-y-12 z-10">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="EduConnect Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-slate-900">EduConnect</span>
          </Link>

          <div className="space-y-6">
             <div className="relative group">
                <div className="absolute inset-0 bg-emerald-600/10 rounded-2xl rotate-3 transition-transform group-hover:rotate-1"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                  alt="Students" 
                  className="relative rounded-2xl shadow-2xl border-4 border-white transform -rotate-1 group-hover:rotate-0 transition-all"
                />
             </div>
             
             <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
               Empowering Students through <span className="text-[#10B981]">Peer-to-Peer</span> Learning
             </h1>
             <p className="text-lg text-slate-600">
               An AI-driven, gamified skill-sharing platform tailored for your university journey.
             </p>
          </div>

          {/* Social Proof */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 inline-flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
             </div>
             <p className="text-sm font-semibold text-slate-700">Join 2,000+ students across Sri Lanka</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Log in with your university credentials.</p>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
          {successMsg && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">{successMsg}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">University Email</label>
              <input 
                type="email" 
                name="email"
                id="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="student@university.ac.lk"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400">Must be a verified (.ac.lk) institutional email.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#10B981] hover:underline">Forgot Password?</Link>
              </div>
              <input 
                type="password" 
                name="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#10B981] focus:ring-[#10B981] cursor-pointer" 
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-500 cursor-pointer">Keep me logged in</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#10B981] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 hover:bg-[#059669] disabled:bg-[#10B981]/50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Logging In...' : 'Log In'}
              {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500">New to the community? <Link to="/register" className="text-[#10B981] font-bold hover:underline">Join for Free</Link></p>
          </div>
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
          <Link to="/admin/login" className="text-white/60 hover:text-[#10B981] transition-colors">Admin Portal</Link>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;