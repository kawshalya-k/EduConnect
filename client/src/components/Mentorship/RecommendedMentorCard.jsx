import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedMentorCard = ({ mentor }) => {
  const mentorId = mentor.userId || mentor.User_Id || mentor.id;
  const mentorName = mentor.name || `${mentor.First_Name || ''} ${mentor.Last_Name || ''}`.trim() || 'Peer Mentor';
  const mentorAvatar = mentor.avatar || mentor.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.First_Name || 'mentor'}&backgroundColor=E2E8F0`;
  const mentorRole = mentor.role || mentor.title || mentor.Bio || 'Expert Mentor';

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Avatar */}
      <Link to={`/mentor/${mentorId}`} className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
        <img 
          src={mentorAvatar} 
          alt={mentorName}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-grow min-w-0">
        <Link to={`/mentor/${mentorId}`}>
          <h4 className="text-sm font-bold text-slate-900 truncate hover:text-[#10B981] transition-colors">
            {mentorName}
          </h4>
        </Link>
        <p className="text-xs text-slate-500 truncate">{mentorRole}</p>
      </div>

      {/* Action */}
      <Link to={`/mentor/${mentorId}`} className="text-[#10B981] hover:text-[#059669] transition-colors p-1 shrink-0">
        <PlusCircle className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default RecommendedMentorCard;
