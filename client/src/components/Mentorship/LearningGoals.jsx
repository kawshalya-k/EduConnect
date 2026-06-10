import React from 'react';

const LearningGoals = () => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900">Your Goals</h3>
        <button className="text-xs font-bold text-[#10B981] hover:text-[#059669]">Edit</button>
      </div>

      {/* Goals List */}
      <div className="flex flex-col gap-4 mb-2">
        {/* Goal 1 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-900">UI Design</span>
            <span className="text-slate-500">75%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full relative">
            <div className="absolute top-0 left-0 h-full bg-[#10B981]" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Goal 2 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-900">Frontend Development</span>
            <span className="text-slate-500">40%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full relative">
            <div className="absolute top-0 left-0 h-full bg-[#10B981]" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      {/* Target Skills */}
      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500 mb-2">Target Skills:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-emerald-50 text-[#10B981] rounded-lg text-[10px] font-bold uppercase">
            TYPOGRAPHY
          </span>
          <span className="px-2 py-1 bg-emerald-50 text-[#10B981] rounded-lg text-[10px] font-bold uppercase">
            REACT JS
          </span>
          <span className="px-2 py-1 bg-emerald-50 text-[#10B981] rounded-lg text-[10px] font-bold uppercase">
            TAILWIND
          </span>
        </div>
      </div>
    </div>
  );
};

export default LearningGoals;
