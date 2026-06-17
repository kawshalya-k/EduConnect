import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiArrowUp, FiEdit2, FiVideo } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import WalletCard from '../../components/Mentorship/WalletCard';
import PerformanceChart from '../../components/Mentorship/PerformanceChart';
import SkillsWidget from '../../components/Mentorship/SkillsPanel';
import { useAuth } from '../../context/AuthContext';
import {
  fetchMentorDashboard,
  fetchPerformanceChart,
  fetchMentorSkills,
} from '../../services/mentorApi';
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

  const mentor = dashData?.mentor || {};
  const upcoming = dashData?.upcomingSessions || [];
  const pendingRequests = dashData?.pendingRequests || [];
  const walletBalance = dashData?.walletBalance ?? 0;
  const avgRating = dashData?.avgRating ?? null;
  const ratingChange = dashData?.ratingChange ?? null;

  const levelLabel = mentor.level || 'Silver Mentor';
  const levelXP = mentor.currentXP || 750;
  const levelMaxXP = mentor.nextLevelXP || 1000;
  const levelNum = mentor.levelNumber || 12;

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

                {/* Level Badge */}
                <div className="dash-level-badge">
                  <div className="level-badge-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" stroke="#9ca3af" strokeWidth="1.5" />
                      <circle cx="16" cy="10" r="5" fill="#9ca3af" />
                      <path d="M8 26c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#9ca3af" />
                    </svg>
                  </div>
                  <div className="level-badge-info">
                    <p className="level-badge-title">{levelLabel}</p>
                    <p className="level-badge-level">LVL {levelNum}</p>
                    <p className="level-badge-xp">{levelXP}/{levelMaxXP} XP to Gold</p>
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
                <Link to="/MySessions" className="dash-view-all">View All</Link>
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