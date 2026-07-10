import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import { fetchLeaderboard } from '../services/leaderboardService';
import { getMySessions } from '../services/sessionService';
import { useAuth } from '../context/AuthContext';
import { fetchLearningSkills, addLearningSkill, removeLearningSkill, fetchAllSkills } from '../services/learnerApi';

const LearnerDashboard = () => {
  const [topMentors, setTopMentors] = useState([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);
  const [learningProgress, setLearningProgress] = useState({ completed: 0, total: 0, percent: 0 });
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [walletBalance, setWalletBalance] = useState(null);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [progressError, setProgressError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadWallet = async () => {
      if (!user?.id) return;
      try {
        const { balance, success } = await (await import('../services/walletService')).getWalletBalance(user.id);
        if (success) setWalletBalance(balance ?? 0);
      } catch (e) {
        console.error('Failed to load wallet balance', e);
      }
    };
    loadWallet();
  }, [user?.id]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        if (data?.success && Array.isArray(data.mentors)) {
          const sorted = [...data.mentors].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
          setTopMentors(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoadingLeaders(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const loadRecommended = async () => {
    setLoadingRecommended(true);
    try {
      const { fetchRecommendedMentors } = await import('../services/mentorApi');
      const res = await fetchRecommendedMentors();
      setRecommendedMentors(res.data?.mentors || []);
    } catch (e) {
      console.error('Failed to load recommended mentors:', e);
    } finally {
      setLoadingRecommended(false);
    }
  };

  useEffect(() => {
    loadRecommended();
  }, []);

  useEffect(() => {
    const loadLearningProgress = async () => {
      if (!user?.id) {
        setLoadingProgress(false);
        return;
      }

      try {
        const sessions = await getMySessions();
        const learnerSessions = sessions.filter(
          (session) => Number(session.Learner_Id) === Number(user.id)
        );
        const completedCourses = learnerSessions.filter(
          (session) => String(session.Status).toLowerCase() === 'completed'
        ).length;
        const weeklyGoal = 4;
        const percent = Math.min(100, Math.round((completedCourses / weeklyGoal) * 100));

        setLearningProgress({
          completed: completedCourses,
          total: learnerSessions.length,
          percent,
          goal: weeklyGoal,
        });

        // Compute upcoming session (nearest future session)
        const now = new Date();
        const future = learnerSessions
          .map((s) => {
            try {
              const d = s.Date ? new Date(s.Date) : null;
              if (d && s.Time) {
                const [hh, mm, ss] = s.Time.split(':').map(Number);
                d.setHours(hh || 0, mm || 0, ss || 0, 0);
              }
              return { ...s, _start: d };
            } catch (e) {
              return { ...s, _start: null };
            }
          })
          .filter((s) => s._start && s._start >= now)
          .sort((a, b) => a._start - b._start);

        setUpcomingSession(future.length > 0 ? future[0] : learnerSessions.length > 0 ? learnerSessions[0] : null);
      } catch (err) {
        console.error('Failed to load learning progress:', err);
        setProgressError('Unable to load learning progress.');
      } finally {
        setLoadingProgress(false);
      }
    };

    loadLearningProgress();
  }, [user?.id]);

  const [wishlistSkills, setWishlistSkills] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWishlist = async () => {
    console.log("[WISH-DEBUG] loadWishlist starting. user:", user);
    if (!user?.id) {
      console.log("[WISH-DEBUG] loadWishlist aborted - no user.id");
      return;
    }
    try {
      console.log("[WISH-DEBUG] loadWishlist calling fetchLearningSkills...");
      const res = await fetchLearningSkills();
      console.log("[WISH-DEBUG] loadWishlist response data:", res.data);
      setWishlistSkills(res.data || []);
    } catch (err) {
      console.error('[WISH-DEBUG] Failed to load wishlist skills:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const loadAllSkills = async () => {
    try {
      const res = await fetchAllSkills();
      setAllSkills(res.data || []);
    } catch (err) {
      console.error("Failed to load all available skills:", err);
    }
  };

  useEffect(() => {
    console.log("[WISH-DEBUG] useEffect triggered. user?.id:", user?.id);
    loadWishlist();
    loadAllSkills();
  }, [user?.id]);

  const handleDeleteSkill = async (skillId) => {
    try {
      await removeLearningSkill(skillId);
      setWishlistSkills(prev => prev.filter(s => s.Skill_Id !== skillId));
      loadRecommended();
    } catch (err) {
      console.error('Failed to delete wishlist skill:', err);
    }
  };

  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    setIsSubmitting(true);
    try {
      const res = await addLearningSkill(Number(selectedSkillId));
      const newSkill = {
        Skill_Id: res.data.Skill_Id,
        Skill_Name: res.data.Skill_Name
      };
      setWishlistSkills(prev => {
        if (prev.some(s => s.Skill_Id === newSkill.Skill_Id)) return prev;
        return [...prev, newSkill];
      });
      setSelectedSkillId('');
      setIsAdding(false);
      loadRecommended();
    } catch (err) {
      console.error('Failed to add wishlist skill:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />

      <main className="flex flex-col items-center pt-8 pb-[293px] px-8 w-full max-w-[1280px] mx-auto z-0">
        <div className="flex flex-row justify-center items-start gap-8 w-full max-w-[1216px]">
          
          {/* Left Column */}
          <div className="flex flex-col items-start gap-6 w-[800px]">
            
            {/* Skill Wallet Balance Card */}
            <div className="box-border flex flex-row items-center p-6 gap-6 w-full h-[131px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row justify-center items-center w-16 h-16 bg-[#10B77F]/20 rounded-full">
                {/* Coin Icon */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-6 text-[#10B77F]">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col items-start h-[82px]">
                <div className="flex flex-col items-start h-[38px]">
                  <span className="font-bold text-[30px] leading-[38px] flex items-center text-[#0F172A]">
                    {walletBalance != null ? Number(walletBalance).toLocaleString() : (user?.skillCoins?.toLocaleString() ?? '1,250')}
                  </span>
                </div>
                <div className="flex flex-col items-start h-6">
                  <span className="font-medium text-base leading-6 flex items-center text-[#64748B]">
                    Skill Wallet Balance
                  </span>
                </div>
                <div className="flex flex-col items-start h-5">
                  <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8]">
                    Earn coins by learning and mentoring others
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Session Card */}
            <div className="box-border flex flex-col items-start w-full h-[178px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl overflow-hidden">
              <div className="flex flex-row items-start w-[798px] h-[176px]">
                
                {/* Video Overlay Section */}
                <div className="flex flex-row justify-center items-center relative w-[266px] h-full min-h-[160px] bg-[#10B77F]/5">
                  <div className="absolute inset-0 bg-[#10B77F]/10 opacity-50 z-0"></div>
                  
                  <div className="flex flex-col items-center p-2 absolute h-8 left-4 right-4 bottom-4 bg-white/80 backdrop-blur-sm rounded-2xl z-10">
                    <span className="font-bold text-xs leading-4 flex items-center text-center tracking-[0.6px] uppercase text-[#10B77F]">
                      Online Session
                    </span>
                  </div>
                  
                  {/* Camera Icon */}
                  <div className="flex flex-col items-start w-[50px] h-[50px] z-20 text-[#10B77F]">
                     <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                       <path d="M4 6C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V8C18 6.89543 17.1046 6 16 6H4Z" />
                       <path d="M22 8L18 11V13L22 16V8Z" />
                     </svg>
                  </div>
                </div>

                {/* Session Details */}
                <div className="flex flex-col justify-between items-start p-6 w-[532px] h-[176px]">
                  <div className="flex flex-col items-start gap-2 w-full">
                    <h3 className="font-bold text-xl leading-7 flex items-center text-[#0F172A]">
                      {upcomingSession ? `Next Session: ${upcomingSession.Mentor_Name || upcomingSession.Mentor || 'Your Mentor'}` : 'No upcoming sessions'}
                    </h3>
                    <div className="flex flex-row items-center gap-2 h-6">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#10B77F]">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="font-medium text-base leading-6 flex items-center text-[#64748B]">
                        {upcomingSession && upcomingSession.Date ? new Date(upcomingSession._start).toLocaleString() : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mt-6">
                    <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8]">
                      {upcomingSession ? 'Meeting link will activate 5m before' : 'Schedule your first session to get started.'}
                    </span>
                    <Link
                      to={upcomingSession ? `/session-room?id=${upcomingSession.Session_Id}` : '/session-room'}
                      className={`relative flex flex-col justify-center items-center py-2.5 px-6 w-[147px] h-11 ${upcomingSession ? 'bg-[#10B77F] hover:bg-[#059669] text-white' : 'bg-slate-100 text-[#64748B] cursor-pointer'} rounded-3xl transition-colors shadow-[0_4px_6px_-4px_rgba(16,183,127,0.2),0_10px_15px_-3px_rgba(16,183,127,0.2)]`}
                    >
                      <span className="font-bold text-base leading-6 text-center z-10">
                        {upcomingSession ? 'View Session' : 'View Session Room'}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Mentors (AI-Powered) */}
            <div className="box-border flex flex-col p-6 gap-4 w-full bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-bold text-lg leading-7 text-[#0F172A]">
                    Recommended for You (AI)
                  </h3>
                </div>
                <span className="text-xs text-[#10B77F] font-semibold bg-[#10B77F]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  AI Match
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {loadingRecommended ? (
                  <>
                    <div className="h-28 rounded-2xl bg-slate-100 animate-pulse"></div>
                    <div className="h-28 rounded-2xl bg-slate-100 animate-pulse"></div>
                  </>
                ) : recommendedMentors.length > 0 ? (
                  recommendedMentors.map(m => (
                    <div 
                      key={m.userId}
                      className="flex flex-row items-center p-4 border border-slate-100 hover:border-[#10B77F]/20 rounded-2xl hover:bg-slate-50/50 transition-all gap-4"
                    >
                      <img 
                        src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.firstName || 'mentor'}&backgroundColor=E2E8F0`}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#0F172A] truncate">{m.name || `${m.firstName} ${m.lastName}`}</p>
                        <p className="text-xs text-[#64748B] truncate">{m.title || 'Expert Mentor'} • {m.university}</p>
                        <span className="inline-block bg-[#10B77F]/10 text-[#10B77F] font-bold text-[10px] px-2 py-0.5 rounded-full mt-1.5 uppercase">
                          {m.mentorLevel || 'Bronze'}
                        </span>
                      </div>
                      <Link 
                        to={`/mentor/${m.userId}`}
                        className="bg-[#10B77F] text-white font-bold text-xs py-2 px-3 rounded-xl hover:bg-[#0ea873] transition-colors shrink-0"
                      >
                        Profile
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 col-span-2 py-2">
                    No recommendations found. Add learning goals to your profile to get matches.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex flex-col items-start gap-4 w-full">
              <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                Quick Actions
              </h3>
              
              <div className="flex flex-row items-start gap-4 w-full h-[134px]">
                
                {/* Find Mentor Button */}
                <Link to="/find-mentor" className="box-border flex flex-col items-center py-6 px-[80px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    Find Mentor
                  </span>
                </Link>

                {/* My Sessions Button */}
                <Link to="/MySessions" className="box-border flex flex-col items-center py-6 px-[77px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4">
                      <path d="M4 4H16C17.1 4 18 4.9 18 6V18C18 19.1 17.1 20 16 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 8L18 11V13L22 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    My Sessions
                  </span>
                </Link>

                {/* My Badges Button */}
                <Link to="/badges" className="box-border flex flex-col items-center py-6 px-[83px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[10px] h-[20px]">
                      <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    My Badges
                  </span>
                </Link>

              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start gap-6 w-[384px]">
            
            {/* Leaderboard Preview */}
            <div className="box-border flex flex-col items-start p-6 gap-6 w-full h-[356px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row justify-between items-center w-full h-7">
                <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                  Top Mentors
                </h3>
                <Link to="/leaderboard" className="font-bold text-sm leading-5 flex items-center text-[#10B77F] hover:underline">
                  View all
                </Link>
              </div>

              <div className="flex flex-col items-start gap-4 w-full h-[254px]">
                {loadingLeaders ? (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="h-[74px] rounded-2xl bg-slate-100 animate-pulse"></div>
                    <div className="h-[74px] rounded-2xl bg-slate-100 animate-pulse"></div>
                    <div className="h-[74px] rounded-2xl bg-slate-100 animate-pulse"></div>
                  </div>
                ) : topMentors.length > 0 ? (
                  topMentors.map((mentor, index) => (
                    <div
                      key={mentor.user_id}
                      className={`box-border flex flex-row items-center p-3 gap-3 w-full h-[74px] ${index === 0 ? 'bg-[#10B77F]/5 border border-[#10B77F]/10 rounded-2xl' : 'rounded-2xl hover:bg-slate-50 transition-colors'}`}
                    >
                      {index === 0 ? (
                        <div className="absolute flex flex-row justify-center items-center py-1 px-0 w-6 h-6 -left-[7px] -top-[7px] bg-[#FACC15] shadow-sm rounded-full z-10">
                          <span className="font-bold text-[10px] leading-[15px] text-center text-white">1st</span>
                        </div>
                      ) : null}
                      <div className="box-border w-12 h-12 border-2 border-white shadow-sm rounded-full bg-slate-300 overflow-hidden flex-shrink-0 relative z-0">
                        <div className="w-full h-full bg-slate-400"></div>
                      </div>
                      <div className="flex flex-col items-start gap-1 flex-1 h-[34px] z-0">
                        <span className="font-bold text-sm leading-[14px] text-[#0F172A]">
                          {mentor.first_name} {mentor.last_name}
                        </span>
                        <span className="font-normal text-xs leading-4 text-[#64748B]">
                          {mentor.university || 'Mentor'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end w-[27px] h-[31px]">
                        <span className="font-bold text-xs leading-4 text-right text-[#10B77F]">
                          {mentor.skill_coins?.toLocaleString() || 0}
                        </span>
                        <span className="font-normal text-[10px] leading-[15px] text-right text-[#94A3B8]">
                          Coins
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#64748B]">No leaderboard data available yet.</div>
                )}
              </div>
            </div>

            {/* Learning Progress Card */}
            <div className="box-border flex flex-col items-start p-6 gap-4 w-full h-[246px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row items-center gap-2 w-full h-7">
                <div className="flex flex-col items-start w-5 h-3 text-[#10B77F]">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -mt-1">
                    <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7H22V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                  Learning Progress
                </h3>
              </div>

              <div className="flex flex-col items-start gap-4 w-full h-[152px]">
                <div className="flex flex-row justify-between items-end w-full h-9">
                    <span className="font-bold text-[30px] leading-[36px] flex items-center text-[#0F172A]">
                      {loadingProgress ? '...' : `${learningProgress.percent}%`}
                    </span>
                    <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8] pb-1">
                      {loadingProgress
                        ? 'Loading...'
                        : `${Math.min(learningProgress.completed, learningProgress.goal)} / ${learningProgress.goal} courses`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#10B77F] rounded-full"
                      style={{ width: `${loadingProgress ? 0 : learningProgress.percent}%` }}
                    />
                  </div>

                  <span className="font-normal text-sm leading-5 flex items-center text-[#64748B]">
                    {progressError
                      ? progressError
                      : loadingProgress
                      ? 'Loading learning progress...'
                      : learningProgress.total === 0
                      ? 'Book your first session to begin learning.'
                      : 'Keep going! You’re almost at your weekly goal.'}
                  </span>
                <button className="box-border flex flex-row justify-center items-center py-2 px-0 w-full h-[38px] bg-[#10B77F]/5 border border-[#10B77F]/10 rounded-2xl hover:bg-[#10B77F]/10 transition-colors">
                  <span className="font-bold text-sm leading-5 text-center text-[#10B77F]">
                    View Learning Path
                  </span>
                </button>
              </div>
            </div>

            {/* Skill Wishlist Card */}
            <div className="box-border flex flex-col items-start p-6 gap-4 w-full bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row items-center gap-2 w-full h-7">
                <span className="text-xl">🎯</span>
                <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                  Skill Wishlist
                </h3>
              </div>

              <div className="flex flex-col items-start gap-4 w-full">
                <p className="font-normal text-sm leading-relaxed text-[#64748B] -mt-2">
                  Based on your interests, we'll recommend mentors.
                </p>

                <div className="flex flex-col gap-2 w-full">
                  {loadingWishlist ? (
                    <div className="h-20 w-full bg-slate-50 animate-pulse rounded-2xl"></div>
                  ) : wishlistSkills.length > 0 ? (
                    wishlistSkills.map((skill) => (
                      <div 
                        key={skill.Skill_Id} 
                        className="flex flex-row justify-between items-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100/50"
                      >
                        <span className="text-sm font-semibold text-[#0F172A]">
                          {skill.Skill_Name}
                        </span>
                        <button
                          onClick={() => handleDeleteSkill(skill.Skill_Id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer animate-none"
                          title="Remove Skill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic py-1">
                      No wishlist skills added yet.
                    </p>
                  )}
                </div>

                {isAdding ? (
                  <form onSubmit={handleAddSkillSubmit} className="flex flex-col gap-2.5 w-full mt-2 animate-none">
                    <select
                      value={selectedSkillId}
                      onChange={(e) => setSelectedSkillId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] focus:border-[#10B77F] focus:outline-none rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors text-slate-800 font-medium"
                      autoFocus
                    >
                      <option value="">-- Select a Skill --</option>
                      {allSkills
                        .filter(s => !wishlistSkills.some(ws => ws.Skill_Id === s.Skill_Id))
                        .map(s => (
                          <option key={s.Skill_Id} value={s.Skill_Id}>
                            {s.Skill_Name}
                          </option>
                        ))
                      }
                    </select>
                    <div className="flex gap-2 justify-end w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting || !selectedSkillId}
                        className="px-4 py-2 bg-[#10B77F] hover:bg-[#059669] text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAdding(false); setSelectedSkillId(''); }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex flex-row items-center gap-1.5 mt-1 text-sm font-bold text-[#10B77F] hover:text-[#059669] transition-colors py-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnerDashboard;
