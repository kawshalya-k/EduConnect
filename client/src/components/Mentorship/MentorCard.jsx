import React from 'react';
import { Link } from 'react-router-dom';

const MentorCard = ({ mentor }) => {
  const getBadgeColors = (level) => {
    switch (level) {
      case 'GOLD MENTOR':
        return 'bg-amber-100 text-amber-700';
      case 'SILVER MENTOR':
        return 'bg-slate-200 text-slate-700';
      case 'BRONZE MENTOR':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex items-start p-6 gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl w-[800px]">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-3xl border border-slate-100 overflow-hidden flex-shrink-0">
        <img 
          src={mentor.avatar} 
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex justify-between items-start">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">{mentor.name}</h3>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase ${getBadgeColors(mentor.level)}`}>
                {mentor.level}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{mentor.role}</p>
          </div>

          {/* Rating & Price */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-amber-500">{mentor.rating}</span>
              <span className="text-xs text-slate-400">({mentor.reviews} reviews)</span>
            </div>
            <span className="text-sm font-bold text-[#10B981]">{mentor.price} <span className="font-normal text-slate-500">/ session</span></span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex gap-2 pb-2">
          {mentor.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-900">
              {skill}
            </span>
          ))}
        </div>

        {/* Action */}
        <div>
          <Link to="/session-booking" className="inline-flex px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-base font-bold rounded-2xl shadow-[0_4px_6px_-4px_rgba(16,185,129,0.2),0_10px_15px_-3px_rgba(16,185,129,0.2)] transition-all">
            Book Session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
