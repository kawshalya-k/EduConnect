import React from 'react';
import { Link } from 'react-router-dom';

const MentorCard = ({ mentor, onBooking }) => {
  const getBadgeColors = (level) => {
    const l = level?.toUpperCase();
    if (l?.includes('GOLD'))   return 'bg-amber-100 text-amber-700';
    if (l?.includes('SILVER')) return 'bg-slate-200 text-slate-700';
    if (l?.includes('BRONZE')) return 'bg-orange-100 text-orange-700';
    return 'bg-slate-100 text-slate-700';
  };

  const getLevelIcon = (level) => {
    const l = level?.toUpperCase();
    if (l?.includes('GOLD'))   return '🏆';
    if (l?.includes('SILVER')) return '⭐';
    return '🥉';
  };

  const displayLevel = level => {
    const l = level?.toUpperCase();
    if (l?.includes('GOLD'))   return 'GOLD MENTOR';
    if (l?.includes('SILVER')) return 'SILVER MENTOR';
    return 'BRONZE MENTOR';
  };

  return (
    <div className="flex items-start p-6 gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl w-[800px]">
      {/* Avatar */}
      <Link to={`/mentor/${mentor.id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-3xl border border-slate-100 overflow-hidden">
            {mentor.avatar ? (
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500">
                {mentor.name?.slice(0, 1)}
              </div>
            )}
          </div>
          {/* Level badge on avatar */}
          <span className="absolute -bottom-1 -right-1 text-base leading-none">
            {getLevelIcon(mentor.level)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex justify-between items-start">
          {/* Name + level + university */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to={`/mentor/${mentor.id}`}>
                <h3 className="text-lg font-bold text-slate-900 hover:text-[#10B981] transition-colors">
                  {mentor.name}
                </h3>
              </Link>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase ${getBadgeColors(mentor.level)}`}>
                {displayLevel(mentor.level)}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {mentor.role || mentor.department}
              {mentor.university && <> • {mentor.university}</>}
            </p>
          </div>

          {/* Rating + price */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-amber-500">
                {mentor.rating?.toFixed(1) ?? mentor.rating}
              </span>
              {(mentor.ratingCount || mentor.reviews) && (
                <span className="text-xs text-slate-400">
                  ({mentor.ratingCount ?? mentor.reviews} reviews)
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-[#10B981]">
              {mentor.costPerSession ?? mentor.price}
              <span className="font-normal text-slate-500"> Coins / session</span>
            </span>
          </div>
        </div>

        {/* Bio — from mentor branch */}
        {mentor.bio && (
          <p className="text-sm text-slate-500 line-clamp-2">{mentor.bio}</p>
        )}

        {/* Skills */}
        <div className="flex gap-2 flex-wrap pb-2">
          {mentor.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-900">
              {skill}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBooking?.(mentor)}
            className="inline-flex px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-base font-bold rounded-2xl shadow-[0_4px_6px_-4px_rgba(16,185,129,0.2),0_10px_15px_-3px_rgba(16,185,129,0.2)] transition-all"
          >
            Book Session
          </button>
          <Link
            to={`/mentor/${mentor.id}`}
            className="inline-flex px-6 py-2.5 border border-slate-200 text-slate-600 hover:border-[#10B981] hover:text-[#10B981] text-base font-bold rounded-2xl transition-all"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;