import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../Assets/educonnect-logo.svg';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email/Name, 2: OTP
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/register', {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: 'Password123!'
      });
      setSuccessMsg(res.data.message || 'Account created successfully!');
      
      // Save email for password setup page
      localStorage.setItem('temp_register_email', formData.email);

      // Bypass OTP for now: go straight to the success page instead of setStep(2)
      setTimeout(() => navigate('/verify-otp'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp: otpCode
      });
      setSuccessMsg(res.data.message || 'Account verified successfully!');
      setTimeout(() => navigate('/verify-otp'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      setTimeout(() => navigate('/verification-failed'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      <main className="flex flex-1 w-full">
      {/* LEFT SIDE: Brand & Campus Imagery */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 bg-[#0D2216]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?auto=format&fit=crop&q=80&w=1200" 
            alt="University Campus" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2216] via-transparent to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-md space-y-12">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="EduConnect Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white tracking-tight">EduConnect</span>
          </Link>
          <h1 className="text-5xl font-black text-white leading-tight">
            Join your university community <span className="text-[#10B981]">today.</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed">
            The exclusive platform for Sri Lankan IT students to collaborate and grow together.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-white">
        
        {/* Back Button for OTP Step */}
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="absolute top-8 right-8 flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
          >
            ← Back
          </button>
        )}

        <div className="max-w-md w-full space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Creation</h2>
            <p className="text-slate-500 font-medium">
              {step === 1 ? "Sign up with your academic credentials." : "Enter the OTP sent to your university email."}
            </p>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
          {successMsg && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">{successMsg}</div>}

          {step === 1 ? (
            /* STEP 1: INITIAL INFO */
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">University Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="student@dept.ac.lk" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-50 transition-all cursor-pointer"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input 
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-black bg-[#F8FAFC] border-2 border-slate-200 rounded-xl focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-emerald-50 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Timer: <span className="text-[#10B981]">00:59s</span></span>
                  <button type="button" className="text-[#10B981] hover:underline cursor-pointer">Resend OTP</button>
                </div>
                
                <button 
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-50 transition-all cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account? <Link to="/login" className="text-[#10B981] font-black hover:underline ml-1 cursor-pointer">Log In</Link>
            </p>
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
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Register;