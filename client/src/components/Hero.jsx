import React from 'react';

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-8 text-left">
        <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          Master New Skills with Your <span className="text-[#10B981]">Peers.</span>
        </h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-lg">
          The AI-powered skill-sharing ecosystem for University students. Turn your knowledge into recognition and rewards.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all">
            Get Started
          </button>
          <button className="border-2 border-slate-200 hover:border-slate-300 font-semibold py-4 px-8 rounded-xl transition-all">
            Explore Mentors
          </button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="w-full aspect-square bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl border border-emerald-200 flex items-center justify-center shadow-inner">
          <span className="text-emerald-300 text-9xl font-black">EC</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;