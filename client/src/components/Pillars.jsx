import React from 'react';

const pillars = [
  { 
    title: "AI-Powered Discovery", 
    desc: "Semantic matching powered by Gemini API connects you with the perfect peer mentor based on your style.", 
    icon: "🔍" 
  },
  { 
    title: "Verification Gate", 
    desc: "Automated leveling system ensures quality. Progress from Bronze to Gold through verified sessions.", 
    icon: "🛡️" 
  },
  { 
    title: "Skill Economy", 
    desc: "Earn Skill Coins for every session you teach. Spend rewards to unlock sessions with university experts.", 
    icon: "💰" 
  }
];

const Pillars = () => (
  <section className="bg-white border-y border-slate-100 py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-slate-900">The Three Pillars</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Built on a foundation of technology and academic integrity to help you excel.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((p, i) => (
          <div key={i} className="p-10 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              {p.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-800">{p.title}</h3>
            <p className="text-slate-600 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pillars;