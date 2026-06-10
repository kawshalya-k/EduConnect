import React from 'react';
import { PlusCircle } from 'lucide-react';

const RecommendedMentorCard = ({ mentor }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
        <img 
          src={mentor.avatar} 
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
        <p className="text-xs text-slate-500">{mentor.role}</p>
      </div>

      {/* Action */}
      <button className="text-[#10B981] hover:text-[#059669] transition-colors p-1">
        <PlusCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default RecommendedMentorCard;
