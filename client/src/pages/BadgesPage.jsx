import React, { useState, useEffect } from "react";
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserBadges } from '../services/gamificationService';

const badgeIconDefault = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z" />
  </svg>
);

const getBadgeCardData = (badge) => ({
  id: badge.Badge_Id || badge.id,
  title: badge.Badge_Name || badge.Title || 'Badge',
  description: badge.Description || badge.description || 'Earned achievement',
  icon: badge.icon || badgeIconDefault,
  state: 'completed',
  stateLabel: 'Completed',
  percent: 100,
  awardedAt: badge.awarded_at || badge.Awarded_Date,
});

function BadgeCard({ badge }) {
  if (badge.variant === "hidden") {
    return (
      <div className="bg-[#10B77F]/5 border border-dashed border-[#10B981] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col items-center justify-center h-[262px] p-6">
        <div className="bg-[#10B981] w-16 h-16 rounded-full mb-4 shrink-0 flex items-center justify-center"></div>
        <h3 className="text-[#10B981] font-bold text-[16px] leading-[24px] text-center mb-1">Hidden Badge</h3>
        <p className="text-[#10B77F]/70 text-[12px] leading-[16px] text-center px-2">Keep exploring to discover the requirements for this mysterious achievement.</p>
      </div>
    );
  }

  const isCompleted = badge.state === "completed";
  const isLocked = badge.state === "locked";
  const isInProgress = badge.state === "inprogress";

  let containerClass = "bg-white border shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] p-6 relative h-[262px] flex flex-col";
  if (isCompleted) containerClass += " border-[#10B981]";
  else if (isInProgress) containerClass += " border-[#E2E8F0]";
  else if (isLocked) containerClass += " border-[#E2E8F0] opacity-60"; 

  let iconContainerClass = "w-16 h-16 rounded-full flex items-center justify-center mb-6 shrink-0 ";
  if (isCompleted) {
    iconContainerClass += "bg-[#10B77F]/10 text-[#10B981]";
  } else {
    iconContainerClass += "bg-gradient-to-t from-[#F1F5F9] to-white text-[#94A3B8]";
  }

  let labelColorClass = isCompleted ? "text-[#10B981]" : (isInProgress ? "text-[#64748B]" : "text-[#94A3B8]");
  
  // Progress bar background changes based on completion status
  let trackColorClass = isCompleted ? "bg-[#10B981]/10" : "bg-[#F1F5F9]";

  return (
    <div className={containerClass}>
      {isCompleted && (
        <div className="absolute top-[25px] right-[25px] bg-[#10B981] text-white rounded-full p-0.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-2 stroke-current">
            <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className={iconContainerClass}>
        {badge.icon}
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <h3 className="text-[#0F172A] font-bold text-[16px] leading-[24px]">{badge.title}</h3>
        {!isCompleted && (
          <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] text-[#94A3B8] stroke-2 stroke-current shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
        )}
      </div>

      <p className="text-[#64748B] text-[14px] leading-[20px] mb-4 flex-grow line-clamp-3 pr-2">{badge.description}</p>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-center mb-[4px]">
          <span className={`font-bold text-[12px] leading-[16px] ${labelColorClass}`}>{badge.stateLabel}</span>
          <span className={`font-bold text-[12px] leading-[16px] ${labelColorClass}`}>{badge.percent}%</span>
        </div>
        <div className={`h-[8px] w-full rounded-full overflow-hidden ${trackColorClass}`}>
          <div 
            className={`h-full rounded-full ${isCompleted ? 'bg-[#10B981]' : (isInProgress ? 'bg-[#10B981]' : 'bg-transparent')}`} 
            style={{ width: `${badge.percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBadges = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchUserBadges(user.id);
        if (response.success && Array.isArray(response.badges)) {
          setBadges(response.badges.map(getBadgeCardData));
        } else {
          setError('Unable to load badges at this time.');
        }
      } catch (err) {
        console.error('Badges fetch error:', err);
        setError('Unable to load badges.');
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [user?.id]);

  const earnedBadges = badges.filter((b) => b.state === 'completed');
  const inProgressBadges = badges.filter((b) => b.state === 'inprogress');
  const lockedBadges = badges.filter((b) => b.state === 'locked' || b.variant === 'hidden');
  const filteredBadges = React.useMemo(() => {
    if (activeTab === 'all') return badges;
    if (activeTab === 'earned') return earnedBadges;
    if (activeTab === 'inprogress') return inProgressBadges;
    if (activeTab === 'locked') return lockedBadges;
    return badges;
  }, [activeTab, badges, earnedBadges, inProgressBadges, lockedBadges]);

  const totalBadges = badges.length;
  const badgeXP = totalBadges * 25;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter'] relative">
      <DashboardNavbar />

      <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/dashboard" className="text-[#64748B] font-normal text-[14px] leading-[20px] hover:underline">Dashboard</Link>
          <svg viewBox="0 0 24 24" fill="none" className="w-[10px] h-[10px] text-[#64748B] stroke-2 stroke-current">
            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#0F172A] font-medium text-[14px] leading-[20px]">My Badges</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0F172A] font-black text-[36px] leading-[40px] tracking-[-0.9px]">Badges & Achievements</h1>
            <p className="text-[#475569] text-[16px] leading-[24px] max-w-[512px]">
              Track your learning journey, unlock unique milestones, and showcase your expertise to the community.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white border border-[#10B77F]/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] py-4 pl-4 pr-14 min-w-[140px]">
              <p className="text-[#94A3B8] font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase mb-1">Badges</p>
              <p className="text-[#10B981] font-bold text-[24px] leading-[32px]">{totalBadges}/{Math.max(totalBadges, 25)}</p>
            </div>
            <div className="bg-white border border-[#10B77F]/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] py-4 pl-4 pr-12 min-w-[140px]">
              <p className="text-[#94A3B8] font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase mb-1">XP Points</p>
              <p className="text-[#10B981] font-bold text-[24px] leading-[32px]">{badgeXP.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#10B77F]/10 mb-[32px]">
          {[
            { id: 'all', label: `All Badges (${totalBadges})` },
            { id: 'earned', label: `Earned (${earnedBadges.length})` },
            { id: 'inprogress', label: `In Progress (${inProgressBadges.length})` },
            { id: 'locked', label: `Locked (${lockedBadges.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 -mb-[1px] ${activeTab === tab.id 
                ? 'border-b-2 border-[#10B981] text-[#10B981] font-bold text-[14px]' 
                : 'text-[#64748B] font-medium text-[14px] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">Loading badges...</div>
          ) : error ? (
            <div className="col-span-full p-8 text-center text-red-500">{error}</div>
          ) : filteredBadges.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No badges available yet. Earn your first badge to get started.</div>
          ) : (
            filteredBadges.map((badge, idx) => (
              <BadgeCard key={badge.id || idx} badge={badge} />
            ))
          )}
        </div>

        {/* Next Milestone */}
        <div className="mt-12 bg-gradient-to-r from-[#10B77F]/10 to-[#10B77F]/5 border border-[#10B981] rounded-[24px] p-8 flex items-center gap-8">
          <div className="relative w-[128px] h-[128px] bg-white border border-[#10B77F]/30 rounded-[16px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-[55px] h-[55px] text-[#10B981]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
             </svg>
          </div>
          <div className="flex flex-col flex-grow">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#10B981] text-white font-black text-[10px] leading-[15px] tracking-[1px] uppercase py-[2px] px-2 rounded-full">
                  Next Milestone
                </span>
                <h3 className="text-[#0F172A] font-extrabold text-[20px] leading-[28px]">Master Scholar</h3>
             </div>
             <p className="text-[#475569] text-[16px] leading-[24px] max-w-[672px] mb-4">
                You're only 250 XP away from achieving the Master Scholar rank! This will unlock exclusive advanced workshops and a profile spotlight.
             </p>
             <div className="w-full max-w-[448px]">
               <div className="flex justify-between items-center mb-[8px]">
                 <span className="text-[#0F172A] font-bold text-[14px] leading-[20px]">1,250 / 1,500 XP</span>
                 <span className="text-[#10B981] font-bold text-[14px] leading-[20px]">83%</span>
               </div>
               <div className="w-full h-3 bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                 <div className="h-full bg-[#10B981] rounded-full w-[83%]"></div>
               </div>
             </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}