import React, { useState } from 'react';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Email/Name, 2: OTP

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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
            <span className="text-2xl font-bold text-white tracking-tight">EduConnect</span>
          </div>
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

          {step === 1 ? (
            /* STEP 1: INITIAL INFO */
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">University Email</label>
                <input type="email" placeholder="student@dept.ac.lk" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:bg-white outline-none transition-all" />
              </div>
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-50 transition-all cursor-pointer"
              >
                Continue
              </button>
            </form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 text-center text-2xl font-black bg-[#F8FAFC] border-2 border-slate-200 rounded-xl focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-emerald-50 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Timer: <span className="text-[#10B981]">00:59s</span></span>
                  <button className="text-[#10B981] hover:underline cursor-pointer">Resend OTP</button>
                </div>
                
                <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-50 transition-all cursor-pointer">
                  Verify Account
                </button>
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account? <span className="text-[#10B981] font-black hover:underline ml-1 cursor-pointer">Log In</span>
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
        <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
          Help Center
        </a>
      </footer>
    </div>
  );
};

export default Register;