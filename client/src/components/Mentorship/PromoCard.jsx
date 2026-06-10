import React from 'react';

const PromoCard = () => {
  return (
    <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl p-6 text-white shadow-[0_4px_6px_-4px_rgba(16,185,129,0.2),0_10px_15px_-3px_rgba(16,185,129,0.2)] flex flex-col gap-2 w-full relative overflow-hidden">
      <h4 className="text-lg font-bold z-10">Upgrade to Pro</h4>
      <p className="text-sm text-white/80 leading-relaxed mb-2 z-10">
        Get unlimited mentor sessions and access to exclusive masterclasses.
      </p>
      <button className="w-full bg-white text-[#10B981] font-black text-sm py-2.5 rounded-2xl hover:bg-slate-50 transition-colors z-10">
        Learn More
      </button>
      
      {/* Decorative background elements can go here if needed */}
    </div>
  );
};

export default PromoCard;
