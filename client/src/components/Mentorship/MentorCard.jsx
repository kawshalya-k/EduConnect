import React from 'react';
import { Link } from 'react-router-dom';

const MentorCard = ({ mentor, onBooking, layout = 'list' }) => {
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

  const mentorId = mentor.id || mentor.userId || mentor.User_Id;
  const mentorName = mentor.name || `${mentor.First_Name || ''} ${mentor.Last_Name || ''}`.trim() || 'Peer Mentor';
  const mentorAvatar = mentor.avatar || mentor.Avatar || '/default-avatar.svg';
  const mentorLevel = mentor.level || mentor.Mentor_Level || mentor.mentorLevel || mentor.mentor_level || 'Bronze';
  const mentorRole = mentor.role || mentor.title || mentor.Bio || 'Mentor';
  const mentorUniversity = mentor.university || mentor.University;
  const mentorRating = mentor.rating || mentor.Average_Rating || 5.0;
  const mentorReviews = mentor.reviews || mentor.ratingCount || mentor.Total_Sessions || 0;
  const mentorPrice = mentor.price || mentor.costPerSession || '100 SC';
  const mentorSkills = mentor.skills || (mentor.Skill_Name ? [mentor.Skill_Name] : []);

  if (layout === 'grid') {
    return (
      <div className="flex flex-col bg-white border border-slate-100 hover:border-[#10B981]/25 hover:shadow-md transition-all duration-300 rounded-3xl p-5 h-full w-full justify-between">
        <div className="flex flex-col gap-4">
          {/* Top Header: Avatar & Info */}
          <div className="flex items-start gap-4">
            <Link to={`/mentor/${mentorId}`} className="shrink-0">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-2xl border border-slate-100 overflow-hidden">
                  <img src={mentorAvatar} alt={mentorName} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 text-sm leading-none bg-white p-0.5 rounded-full shadow-sm">
                  {getLevelIcon(mentorLevel)}
                </span>
              </div>
            </Link>

            <div className="min-w-0 flex-1">
              <Link to={`/mentor/${mentorId}`}>
                <h3 className="text-base font-bold text-slate-900 hover:text-[#10B981] transition-colors truncate">
                  {mentorName}
                </h3>
              </Link>
              <span className={`inline-block px-2 py-0.5 mt-1 rounded-md text-[9px] font-bold tracking-wide uppercase ${getBadgeColors(mentorLevel)}`}>
                {displayLevel(mentorLevel)}
              </span>
            </div>
          </div>

          {/* University & Role */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {mentorRole}
            </p>
            {mentorUniversity && (
              <p className="text-[11px] text-slate-500 truncate">
                🏫 {mentorUniversity}
              </p>
            )}
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-slate-700">
                {Number(mentorRating).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">
                ({mentorReviews})
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#10B981]">
                {mentorPrice}
              </span>
            </div>
          </div>

          {/* Bio */}
          {mentor.bio && (
            <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] leading-relaxed">
              {mentor.bio}
            </p>
          )}

          {/* Skills */}
          <div className="flex gap-1.5 flex-wrap">
            {mentorSkills?.slice(0, 2).map((skill, index) => (
              <span key={index} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-medium text-slate-600 truncate max-w-[120px]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onBooking?.(mentor)}
            className="flex-1 text-center py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Book
          </button>
          <Link
            to={`/mentor/${mentorId}`}
            className="flex-1 text-center py-2 border border-slate-200 text-slate-600 hover:border-[#10B981] hover:text-[#10B981] text-xs font-bold rounded-xl transition-all"
          >
            Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start p-6 gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl w-full max-w-[800px]">
      {/* Avatar */}
      <Link to={`/mentor/${mentorId}`} className="flex-shrink-0">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-3xl border border-slate-100 overflow-hidden">
            <img src={mentorAvatar} alt={mentorName} className="w-full h-full object-cover" />
          </div>
          {/* Level badge on avatar */}
          <span className="absolute -bottom-1 -right-1 text-base leading-none">
            {getLevelIcon(mentorLevel)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex justify-between items-start">
          {/* Name + level + university */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to={`/mentor/${mentorId}`}>
                <h3 className="text-lg font-bold text-slate-900 hover:text-[#10B981] transition-colors">
                  {mentorName}
                </h3>
              </Link>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase ${getBadgeColors(mentorLevel)}`}>
                {displayLevel(mentorLevel)}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {mentorRole}
              {mentorUniversity && <> • {mentorUniversity}</>}
            </p>
          </div>

          {/* Rating + price */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-amber-500">
                {Number(mentorRating).toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({mentorReviews} reviews)
              </span>
            </div>
            <span className="text-sm font-bold text-[#10B981]">
              {mentorPrice}
              <span className="font-normal text-slate-500"> Coins / session</span>
            </span>
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p className="text-sm text-slate-500 line-clamp-2">{mentor.bio}</p>
        )}

        {/* Skills */}
        <div className="flex gap-2 flex-wrap pb-2">
          {mentorSkills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-900">
              {skill}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBooking?.(mentor)}
            className="inline-flex px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-base font-bold rounded-2xl shadow-[0_4px_6px_-4px_rgba(16,185,129,0.2),0_10px_15px_-3px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
          >
            Book Session
          </button>
          <Link
            to={`/mentor/${mentorId}`}
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