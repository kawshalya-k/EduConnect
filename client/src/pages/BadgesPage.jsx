import React, { useState, useEffect } from "react";
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBadgeProgress } from '../services/gamificationService';

const BADGE_DEFINITIONS = [
  ['First Session', 'Complete your very first learning session'],
  ['Fast Learner', 'Finish a full course module in 24 hours'],
  ['Top Student', 'Reach #1 on the weekly leaderboard'],
  ['7-Day Streak', 'Study for 7 consecutive days'],
  ['Collaborator', 'Contribute to 5 community discussions'],
  ['Course Master', 'Complete 10 full courses at 90% average'],
  ['Coin Collector', 'Earn over 1000 Skill Coins']
];

export default function BadgesPage() {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let refreshTimer;
    const loadBadges = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const badgesData = await getBadgeProgress(user.id);
        if (badgesData.success) {
          setAllBadges(badgesData.badges.map((badge, index) => {
            const [defaultName, defaultDescription] = BADGE_DEFINITIONS[index] || [];
            return {
              ...badge,
              name: badge.name || badge.Badge_Name || defaultName,
              description: badge.description || badge.Description || defaultDescription
            };
          }));
        }
      } catch (err) {
        setError('Failed to load badges data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
    refreshTimer = window.setInterval(loadBadges, 15000);
    return () => window.clearInterval(refreshTimer);
  }, [user?.id]);

  const getBadgeIcon = (badgeName) => {
    // Return a default star icon for all badges
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z" />
      </svg>
    );
  };

  const getBadgeState = (badge) => {
    const percent = Number(badge.percent || 0);
    if (badge.completed || percent >= 100) {
      return {
        state: "completed",
        stateLabel: "Completed",
        percent: 100
      };
    }
    return {
      state: "locked",
      stateLabel: badge.stateLabel || "Locked",
      percent
    };
  };

  const filteredBadges = React.useMemo(() => {
    const badgesWithState = allBadges.map(badge => ({
      ...badge,
      ...getBadgeState(badge),
      icon: getBadgeIcon(badge.name)
    }));

    if (activeTab === "all") return badgesWithState;
    if (activeTab === "earned") return badgesWithState.filter(b => b.state === "completed");
    if (activeTab === "locked") return badgesWithState.filter(b => b.state === "locked");
    return badgesWithState;
  }, [allBadges, activeTab]);

  const earnedCount = allBadges.filter(badge => badge.completed).length;
  const lockedCount = allBadges.length - earnedCount;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
        <DashboardNavbar />
        <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
        <DashboardNavbar />
        <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
          <div className="text-red-500 text-center">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans relative">
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
              <p className="text-[#10B981] font-bold text-[24px] leading-[32px]">{earnedCount}/{allBadges.length}</p>
            </div>
            <div className="bg-white border border-[#10B77F]/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] py-4 pl-4 pr-12 min-w-[140px]">
              <p className="text-[#94A3B8] font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase mb-1">XP Points</p>
              <p className="text-[#10B981] font-bold text-[24px] leading-[32px]">{earnedCount * 100}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#10B77F]/10 mb-[32px]">
          {[
            { id: "all", label: "All Badges" },
            { id: "earned", label: `Earned (${earnedCount})` },
            { id: "locked", label: `Locked (${lockedCount})` }
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
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.badge_id} badge={badge} />
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#64748B] text-[16px]">No badges to display</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

function BadgeCard({ badge }) {
  const isCompleted = badge.state === "completed";
  const isLocked = badge.state === "locked";

  let containerClass = "bg-white border shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] p-6 relative h-[262px] flex flex-col";
  if (isCompleted) containerClass += " border-[#10B981]";
  else if (isLocked) containerClass += " border-[#E2E8F0] opacity-60";

  let iconContainerClass = "w-16 h-16 rounded-full flex items-center justify-center mb-6 shrink-0 ";
  if (isCompleted) {
    iconContainerClass += "bg-[#10B77F]/10 text-[#10B981]";
  } else {
    iconContainerClass += "bg-gradient-to-t from-[#F1F5F9] to-white text-[#94A3B8]";
  }

  let labelColorClass = isCompleted ? "text-[#10B981]" : "text-[#94A3B8]";
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
        <h3 className="text-[#0F172A] font-bold text-[16px] leading-[24px]">{badge.name}</h3>
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
            className={`h-full rounded-full ${badge.percent > 0 ? 'bg-[#10B981]' : 'bg-transparent'}`} 
            style={{ width: `${badge.percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}