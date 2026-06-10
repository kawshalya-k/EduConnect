import React from 'react';

const RoleSwitcher = () => {
  return (
    <div className="flex flex-row items-center p-1 gap-2 bg-[#F1F5F9] rounded-lg h-9">
      <button className="flex flex-col justify-center items-center py-1.5 px-3 rounded-md text-[#64748B] font-['Inter'] font-semibold text-xs leading-4 transition-colors hover:bg-slate-200">
        Mentor
      </button>
      <button className="flex flex-row justify-center items-center py-1.5 px-[11px] bg-[#10B981] shadow-sm rounded-md text-white font-['Inter'] font-semibold text-xs leading-4 transition-colors hover:bg-[#059669]">
        Learner Mode
      </button>
    </div>
  );
};

export default RoleSwitcher;
