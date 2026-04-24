import React from 'react';

const CTA = () => {
  return (
    <section className="bg-slate-50 py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          Ready to share your knowledge?
        </h2>
        <p className="text-xl text-slate-600 font-medium">
          Join the largest student skill network at Universities of Sri Lanka.
        </p>
        <div className="pt-4">
          <button className="bg-[#10B981] hover:bg-[#059669] text-white text-lg font-bold py-5 px-12 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer">
            Start Your Journey Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;