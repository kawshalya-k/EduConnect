import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiArrowUp, FiEdit2, FiVideo } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import RoleSwitcher from '../../components/Dashboard/RoleSwitcher';
import WalletCard from '../../components/Mentorship/WalletCard';
import PerformanceChart from '../../components/Mentorship/PerformanceChart';
import SkillsWidget from '../../components/Mentorship/SkillsPanel';
import { useAuth } from '../../context/AuthContext';
import {
  fetchMentorDashboard,
  fetchPerformanceChart,
  fetchMentorSkills,
} from '../../services/mentorApi';
import { fetchMentorSessions } from '../../services/mentorApi';
import './MentorDashboard.css';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user?.mentorId) return;
    setLoading(true);
    try {
      const [dashRes, chartRes, skillsRes] = await Promise.all([
        fetchMentorDashboard(user.mentorId),
        fetchPerformanceChart(user.mentorId, '7days'),
        fetchMentorSkills(user.mentorId),
      ]);
      setDashData(dashRes.data);
      setChartData(chartRes.data?.data || []);
      setSkills(skillsRes.data?.skills || []);
      // Fetch sessions separately to compute upcoming & pending requests
      try {
        const sessionsRes = await fetchMentorSessions(user.mentorId);
        const sessions = sessionsRes.data || [];

        // Upcoming = Scheduled or Pending and date >= today
        const now = new Date();
        const upcoming = sessions
          .map((s) => {
            let start = null;
            try {
              start = s.Date ? new Date(s.Date) : null;
              if (start && s.Time) {
                const [hh, mm, ss] = (s.Time || '').split(':').map(Number);
                start.setHours(hh || 0, mm || 0, ss || 0, 0);
              }
            } catch (e) { start = null; }
            return { ...s, _start: start };
          })
          .filter((s) => s._start && (s.Status === 'Scheduled' || s.Status === 'Pending') && s._start >= now)
          .sort((a, b) => a._start - b._start);

        const pending = sessions.filter((s) => s.Status === 'Pending');

        // Attach derived arrays onto dashData for UI
        setDashData((d) => ({ ...(d || {}), upcomingSessions: upcoming, pendingRequests: pending }));
      } catch (e) {
        console.error('Failed loading sessions for mentor dashboard:', e);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = async (period) => {
    if (!user?.mentorId) return;
    setChartLoading(true);
    try {
      const map = { 'Last 7 Days': '7days', 'Last 30 Days': '30days', 'This Month': 'month' };
      const res = await fetchPerformanceChart(user.mentorId, map[period] || '7days');
      setChartData(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setChartLoading(false);
    }
  };

  const mentor = { ...user };
  const upcoming = dashData?.upcomingSessions || [];
  const pendingRequests = dashData?.pendingRequests || [];
  const walletBalance = dashData?.wallet_balance ?? dashData?.walletBalance ?? 0;
  const avgRating = dashData?.session_stats?.Overall_Rating ?? null;
  const ratingChange = null;

  // ── Dynamically map backend metrics to UI ──────────────────────────────────────
  // derive overall level/score from skill_stats
  const skillStats = dashData?.skill_stats || [];
  const level = (() => {
    const ranks = { GOLD: 3, SILVER: 2, BRONZE: 1 };
    let best = 'BRONZE';
    for (const s of skillStats) {
      if (s.Mentor_Level && ranks[s.Mentor_Level.toUpperCase()] > ranks[best]) best = s.Mentor_Level.toUpperCase();
    }
    return best.toLowerCase();
  })();
  const score = skillStats.reduce((sum, s) => sum + (Number(s.Score) || 0), 0);
  const pointsToNext = null;
  const nextLevel = null;

  // Formatted Label (e.g., 'silver' -> 'Silver Mentor')
  const levelLabel = `${level.charAt(0).toUpperCase() + level.slice(1)} Mentor`;

  // Define local boundaries matching backend thresholds for precise bar scaling
  const thresholds = { bronze: 0, silver: 50, gold: 100 };

  let levelXP = score;
  let levelMaxXP = thresholds.silver; // Default maximum boundary if Bronze

  if (level === 'silver') {
    levelXP = score - thresholds.silver;
    levelMaxXP = thresholds.gold - thresholds.silver; // 50 points window
  } else if (level === 'gold') {
    levelXP = score;
    levelMaxXP = score; // Progress bar fills up completely when maxed out
  }

  // Optional derived numeric leveling metric if needed by design layout
  const levelNum = level === 'gold' ? 3 : level === 'silver' ? 2 : 1;

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />

        <div className="dash-content">
          <div className="dash-main">
            {/* Top Row */}
            <div className="dash-top-row">
              {/* Welcome */}
              <div className="dash-welcome-area">
                <div className="dash-welcome-text">
                  <h1 className="dash-welcome-heading">
                    Welcome back, {user?.name?.split(' ')[0] || 'Mentor'}! 👋
                  </h1>
                  <p className="dash-welcome-sub">
                    You have {upcoming.length} session{upcoming.length !== 1 ? 's' : ''} scheduled for today.
                  </p>
                </div>

                {/* Level Badge Card */}
                <div className="dash-level-badge bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-[280px]">
                  <div className={`level-badge-icon w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 
                    ${level === 'gold' ? 'bg-amber-50 text-amber-500 border-amber-300' : 
                      level === 'silver' ? 'bg-slate-50 text-slate-500 border-slate-300' : 
                      'bg-orange-50 text-orange-700 border-orange-300'}`}
                  >
                    {level.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="level-badge-info flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="level-badge-title font-bold text-slate-800 text-sm">{levelLabel}</p>
                      <p className="text-xs font-semibold text-slate-400">Score: {score}</p>
                    </div>
                    
                    {/* Dynamic Progress Indicator */}
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          level === 'gold' ? 'bg-amber-400' : level === 'silver' ? 'bg-slate-400' : 'bg-orange-400'
                        }`}
                        style={{ width: `${Math.min(100, (levelXP / levelMaxXP) * 100)}%` }}
                      />
                    </div>

                    <p className="level-badge-xp text-[11px] text-slate-500 mt-1">
                      {pointsToNext !== null && nextLevel ? (
                        <>
                          Need <span className="font-bold text-[#10B981]">{pointsToNext}</span> more points for <span className="capitalize">{nextLevel}</span>
                        </>
                      ) : (
                        <span className="text-amber-500 font-medium">✨ Maximum Rank Achieved</span>
                      )}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Stats Row */}
            <div className="dash-stats-row">
              {/* Wallet */}
              <WalletCard balance={walletBalance} loading={loading} />

              {/* Average Rating */}
              <div className="dash-rating-card">
                <div className="rating-card-icon">
                  <FiStar size={22} fill="#3b82f6" stroke="#3b82f6" />
                </div>
                <div className="rating-card-body">
                  <p className="rating-card-label">Average Rating</p>
                  {loading ? (
                    <div className="rating-skeleton" />
                  ) : (
                    <div className="rating-card-value-row">
                      <span className="rating-card-value">
                        {avgRating != null ? avgRating.toFixed(1) : '—'}
                      </span>
                      {ratingChange != null && (
                        <span className="rating-change positive">
                          <FiArrowUp size={12} />
                          {ratingChange}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="dash-section-card">
              <div className="dash-section-header">
                <h2 className="dash-section-title">Upcoming Sessions</h2>
                <Link to="/mentor-sessions" className="dash-view-all">View All</Link>
              </div>

              {loading ? (
                <div className="sessions-loading">
                  {[1, 2].map((i) => <div key={i} className="session-skeleton" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="no-sessions">
                  <p>No upcoming sessions scheduled</p>
                </div>
              ) : (
                <div className="upcoming-list">
                  {upcoming.slice(0, 2).map((session) => (
                    <div key={session.id} className="upcoming-session-item">
                      <div className="session-avatar">
                        {session.learnerAvatar ? (
                          <img src={session.learnerAvatar} alt={session.learnerName} />
                        ) : (
                          <span>{session.learnerName?.slice(0, 1)}</span>
                        )}
                      </div>
                      <div className="session-info">
                        <p className="session-name">{session.learnerName}</p>
                        <p className="session-topic">{session.topic}</p>
                        <p className="session-time">
                          🕐 {session.time} ({session.duration})
                        </p>
                      </div>
                      <div className="session-actions">
                        {session.isNow ? (
                          <button className="session-join-btn">
                            <FiVideo size={14} /> Join Meeting
                          </button>
                        ) : (
                          <span className="session-starts-in">
                            Starts in {session.startsIn}
                          </span>
                        )}
                        <button className="session-edit-btn">
                          <FiEdit2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Chart */}
            <PerformanceChart
              data={chartData}
              loading={loading || chartLoading}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {/* Right Column */}
          <div className="dash-right-col">
            {/* Skills */}
            <SkillsWidget skills={skills} loading={loading} />

            {/* Mentor Spotlight */}
            <div className="mentor-spotlight-card">
              <div className="spotlight-header">
                <span>📢</span>
                <h3>Mentor Spotlight</h3>
              </div>
              <div className="spotlight-webinar">
                <div className="webinar-tag">LIVE WEBINAR</div>
                <p className="webinar-title">How to handle complex technical questions</p>
                <button className="webinar-remind-btn">Remind Me</button>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="achievement-badges">
              <div className="achievement-badge">
                <span className="badge-flame">🔥</span>
                <span>7 Day Streak</span>
              </div>
              <div className="achievement-badge">
                <span className="badge-star">✨</span>
                <span>First Class</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}