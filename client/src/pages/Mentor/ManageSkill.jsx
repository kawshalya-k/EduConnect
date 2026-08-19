import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  Star, 
  ShieldCheck,
  Search,
  User
} from 'lucide-react';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchMentorSkills, 
  fetchMentorSessions, 
  acceptSessionRequest, 
  rejectSessionRequest 
} from '../../services/mentorApi';

export default function ManageSkill() {
  const { skillId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const mentorId = user?.mentorId || user?.id;

  const loadData = async () => {
    if (!mentorId) return;
    setLoading(true);
    try {
      // 1. Fetch skills (this joins Levelling_Data in backend, providing avg rating & sessions from db)
      const skillsRes = await fetchMentorSkills(mentorId);
      const skillsArray = Array.isArray(skillsRes.data)
        ? skillsRes.data
        : (skillsRes.data?.skills || []);
      
      const skill = skillsArray.find(s => String(s.Skill_Id || s.id) === String(skillId));
      if (skill) {
        setCurrentSkill({
          id: skill.Skill_Id || skill.id,
          name: skill.Skill_Name || skill.name,
          level: skill.Mentor_Level || 'Bronze',
          verified: skill.Verification_Status === 1 || skill.Verification_Status === true || skill.Verification_Status === 'Verified',
          avgRating: skill.Average_Rating !== undefined && skill.Average_Rating !== null ? Number(skill.Average_Rating) : null,
          totalSessions: skill.Total_Sessions !== undefined && skill.Total_Sessions !== null ? Number(skill.Total_Sessions) : null,
          score: skill.Score !== undefined && skill.Score !== null ? Number(skill.Score) : 0
        });
      }

      // 2. Fetch sessions
      const sessionsRes = await fetchMentorSessions(mentorId);
      const rawSessions = sessionsRes.data || sessionsRes || [];
      const filteredSessions = rawSessions.filter(
        s => String(s.Skill_Id) === String(skillId) && String(s.Mentor_Id) === String(user?.id)
      );
      setSessions(filteredSessions);

      // Filter pending requests for this skill
      const pending = filteredSessions.filter(s => s.Status === 'Pending');
      setPendingRequests(pending);

    } catch (err) {
      console.error('Error loading skill dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [skillId, mentorId]);

  const handleAccept = async (sessionId) => {
    try {
      await acceptSessionRequest(sessionId);
      alert('Session accepted successfully!');
      loadData();
    } catch (err) {
      console.error('Error accepting session:', err);
      alert('Failed to accept session request.');
    }
  };

  const handleReject = async (sessionId) => {
    try {
      await rejectSessionRequest(sessionId);
      alert('Session rejected successfully.');
      loadData();
    } catch (err) {
      console.error('Error rejecting session:', err);
      alert('Failed to reject session request.');
    }
  };

  // Helper calculations
  const completedSessions = sessions.filter(s => s.Status === 'Completed');
  
  // Total Sessions completed for this skill from DB
  const sessionCount = currentSkill?.totalSessions !== null && currentSkill?.totalSessions !== undefined && currentSkill.totalSessions > 0
    ? currentSkill.totalSessions
    : completedSessions.length;

  // Average Rating directly from DB (Levelling_Data)
  const avgRating = (currentSkill?.avgRating !== null && currentSkill?.avgRating !== undefined && currentSkill.avgRating > 0)
    ? Number(currentSkill.avgRating).toFixed(1)
    : (completedSessions.filter(s => s.Rating != null).length > 0
        ? (completedSessions.filter(s => s.Rating != null).reduce((sum, s) => sum + s.Rating, 0) / completedSessions.filter(s => s.Rating != null).length).toFixed(1)
        : '4.8'); // Fallback to 4.8 if 0 / null in DB

  // Total Earned in this skill (completed sessions * session cost)
  const totalEarned = completedSessions.reduce((sum, s) => sum + (s.Cost || 10), 0);

  // Level thresholds
  const currentLevel = currentSkill?.level || 'Bronze';
  const levelXP = sessionCount;
  const levelMaxXP = currentLevel.toLowerCase() === 'gold' ? 15 : currentLevel.toLowerCase() === 'silver' ? 15 : 5;
  const pointsToNext = levelMaxXP - levelXP;
  const progressPercent = Math.min(100, (levelXP / levelMaxXP) * 100);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-grow flex items-center justify-center py-20 bg-[#F8FAFC]">
          <div className="text-[#059669] font-bold text-lg animate-pulse">Loading skill dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  if (!currentSkill) {
    return (
      <PageLayout>
        <div className="flex-grow max-w-md mx-auto py-20 text-center space-y-6 bg-[#F8FAFC] px-6">
          <h2 className="text-2xl font-black text-slate-800">Skill Not Found</h2>
          <p className="text-slate-500">The verified skill you are trying to view could not be loaded or verified yet.</p>
          <Link to="/mentor-dashboard" className="inline-block bg-[#059669] text-white font-bold px-6 py-3 rounded-xl">
            Back to Dashboard
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        
        {/* Main Content Area */}
        <div className="px-6 md:px-8 py-8" style={{ flex: 1, minWidth: 0, backgroundColor: '#F8FAFC', maxWidth: 'none', margin: '0' }}>
          
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/mentor-dashboard' },
              { label: 'Skills', path: '/verification' },
              { label: currentSkill.name }
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            
            {/* Column 2: Welcome & Teaching Overview (2/3 width) */}
            <div className="w-full lg:w-2/3 space-y-8 flex flex-col">
              
              {/* Welcome Header */}
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-[#0F172A]">Welcome back, Mentor!</h1>
                <p className="text-slate-500 text-sm">Here's what's happening with your teaching profile today.</p>
              </div>

              {/* Teaching Overview Card */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Teaching Overview</h2>
                
                <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 bg-[#10B981]/5 border border-[#10B981]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#10B981]">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">
                        1 Verified Skill: {currentSkill.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Skill Verified
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-base leading-relaxed">
                      Your {currentSkill.name} expertise has been validated by EduConnect. You are now eligible to mentor learners and earn Skill Coins for your knowledge.
                    </p>
                    
                    <Link to="/verification" className="inline-block font-bold text-[#10B981] hover:underline text-sm cursor-pointer">
                      Manage Skills
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pending Requests / Empty State */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Requests</h2>
                
                {sessions.length === 0 && pendingRequests.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-6 min-h-[280px]">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="font-extrabold text-[#0F172A] text-lg">Waiting for your first learner...</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Your profile is now visible to the community. We'll notify you as soon as a learner requests a session with you.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => navigate(`/profile`)}
                        className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                      >
                        Preview Profile
                      </button>
                      <button 
                        onClick={() => navigate(`/profile`)}
                        className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                      >
                        Edit Bio
                      </button>
                    </div>
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-slate-400 font-medium">
                    No new pending learning requests for this skill at the moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div 
                        key={request.Session_Id}
                        className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center text-slate-500 font-bold">
                            {request.Learner_Avatar ? (
                              <img src={request.Learner_Avatar} alt={request.Learner_First} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#0F172A] text-base leading-tight">
                              {request.Learner_First} {request.Learner_Last}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
                              <span className="px-2 py-0.5 bg-[#10B981]/10 rounded text-[#10B981] font-bold">
                                {request.Skill_Name}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {request.Duration || 45} mins
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => handleAccept(request.Session_Id)}
                            className="bg-[#10B981] hover:bg-[#0ea873] text-white font-bold py-2 px-5 rounded-xl text-sm transition-all flex-1 md:flex-none cursor-pointer"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleReject(request.Session_Id)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-5 rounded-xl text-sm transition-all flex-1 md:flex-none cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Column 3: Skill Level & Stats Column (1/3 width) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              {/* Leveling Widget */}
              <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 border-4 border-orange-50 rounded-full flex items-center justify-center text-orange-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg leading-tight capitalize">
                      {currentLevel} Mentor
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Level {currentLevel.toLowerCase() === 'gold' ? 3 : currentLevel.toLowerCase() === 'silver' ? 2 : 1} Educator
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-semibold text-slate-600">Progress to {currentLevel.toLowerCase() === 'gold' ? 'Mastery' : currentLevel.toLowerCase() === 'silver' ? 'Gold Level' : 'Silver Level'}</span>
                    <span className="px-2 py-0.5 bg-[#10B981]/10 rounded-full text-xs font-bold text-[#10B981]">
                      {levelXP} / {levelMaxXP} Sessions
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {pointsToNext > 0 ? (
                      `${pointsToNext} more sessions until ${currentLevel.toLowerCase() === 'silver' ? 'Gold' : 'Silver'} Level upgrade!`
                    ) : (
                      "✨ Maximum Rank Achieved"
                    )}
                  </p>
                </div>
              </div>

              {/* Total Earned Card */}
              <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 space-y-2">
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase text-slate-400 font-bold">Total Earned</p>
                <h4 className="text-2xl font-black text-slate-800">{totalEarned} SC</h4>
              </div>

              {/* Avg Rating Card */}
              <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 space-y-2">
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase text-slate-400 font-bold">Avg Rating</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
                  <h4 className="text-2xl font-black text-slate-800">{avgRating}</h4>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageLayout>
  );
}
