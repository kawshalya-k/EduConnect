import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiVideo, FiPlus, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { LoadingState } from '../../components/Layout/LoadingState';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSessions } from '../../services/mentorApi';
import './MentorSessions.css';

export default function Sessions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Calls fetchMentorSessions (which we aliased to /sessions/my)
      const res = await fetchMentorSessions(user.mentorId || user.id);
      // Ensure we filter for sessions where the user is the Mentor
      const mentorSessions = (res.data || res || []).filter(
        (s) => String(s.Mentor_Id) === String(user.mentorId || user.id)
      );
      setSessions(mentorSessions);
    } catch (err) {
      console.error('Sessions load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time (e.g. '14:30:00' -> '2:30 PM')
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minutes} ${ampm}`;
  };

  // Helper to format date (e.g. '2026-06-20' -> 'June 20')
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Parse Date and Time to Date object
  const getSessionDateObject = (session) => {
    if (!session?.Date || !session?.Time) return null;
    try {
      const datePart = session.Date.split('T')[0]; // Handle IsoString
      const [yy, mm, dd] = datePart.split('-').map(Number);
      const [hh, min, sec] = session.Time.split(':').map(Number);
      return new Date(yy, mm - 1, dd, hh || 0, min || 0, sec || 0);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // 1. Determine "Active Focus" (Next Session)
  // Find upcoming scheduled sessions
  const scheduledSessions = sessions
    .filter((s) => {
      if (s.Status === 'Completed' || s.Status === 'Cancelled') return false;
      const start = getSessionDateObject(s);
      if (!start) return false;
      const durationMs = (s.Duration || 60) * 60 * 1000;
      const endTime = start.getTime() + durationMs;
      return Date.now() <= endTime;
    })
    .sort((a, b) => {
      const dateA = getSessionDateObject(a);
      const dateB = getSessionDateObject(b);
      return (dateA || 0) - (dateB || 0);
    });

  const nextSession = scheduledSessions[0];

  // 2. Upcoming Sessions (excluding the active focus one)
  const upcomingList = scheduledSessions.slice(1);

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />

        <div className="sessions-main-content">
          <div className="sessions-content-container">
            {loading ? (
              <LoadingState message="Loading your sessions..." />
            ) : (
              <>
                {/* Active Focus Header */}
                <div className="sessions-section-wrapper">
                  <div className="section-header-title-row">
                    <div className="section-header-title">
                      <FiTrendingUp className="header-icon" />
                      <h2>Active Focus</h2>
                    </div>
                    <span className="live-soon-tag">LIVE SOON</span>
                  </div>

                  {nextSession ? (
                    <ActiveFocusCard 
                      session={nextSession} 
                      formatTime={formatTime}
                      formatDate={formatDate}
                      getSessionDateObject={getSessionDateObject}
                      navigate={navigate}
                    />
                  ) : (
                    <div className="no-active-focus">
                      <FiAlertCircle size={24} />
                      <p>No active sessions scheduled soon.</p>
                    </div>
                  )}
                </div>

                {/* Upcoming Sessions List */}
                <div className="sessions-section-wrapper">
                  <div className="section-header-title-row">
                    <div className="section-header-title">
                      <FiClock className="header-icon" />
                      <h2>Upcoming Sessions</h2>
                    </div>
                  </div>

                  <div className="timeline-container">
                    {upcomingList.length > 0 ? (
                      upcomingList.map((session) => (
                        <TimelineEntry 
                          key={session.Session_Id} 
                          session={session} 
                          formatTime={formatTime}
                          navigate={navigate}
                        />
                      ))
                    ) : (
                      nextSession && upcomingList.length === 0 ? (
                        <div className="no-more-sessions">
                          <p>No other upcoming sessions scheduled.</p>
                        </div>
                      ) : (
                        <div className="no-sessions-timeline">
                          <FiAlertCircle size={20} />
                          <p>You have no scheduled sessions at this time.</p>
                        </div>
                      )
                    )}

                    {/* Dotted Schedule Button */}
                    <div className="manual-schedule-entry">
                      <div className="timeline-time-col"></div>
                      <div className="manual-schedule-box">
                        <FiPlus className="plus-icon" />
                        <span>Manually Schedule a Session</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Active Focus Countdown Card
function ActiveFocusCard({ session, formatTime, formatDate, getSessionDateObject, navigate }) {
  const [timeLeft, setTimeLeft] = useState({ value1: '00', label1: 'MIN', value2: '00', label2: 'SEC' });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const targetDate = getSessionDateObject(session);
    if (!targetDate) return;

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ value1: '00', label1: 'MIN', value2: '00', label2: 'SEC' });
        setIsLive(true);
      } else {
        setIsLive(false);
        const totalSecs = Math.floor(difference / 1000);
        const totalMins = Math.floor(totalSecs / 60);
        const totalHours = Math.floor(totalMins / 60);
        const totalDays = Math.floor(totalHours / 24);

        if (totalDays > 0) {
          setTimeLeft({
            value1: String(totalDays).padStart(2, '0'),
            label1: 'DAYS',
            value2: String(totalHours % 24).padStart(2, '0'),
            label2: 'HRS'
          });
        } else if (totalHours > 0) {
          setTimeLeft({
            value1: String(totalHours).padStart(2, '0'),
            label1: 'HRS',
            value2: String(totalMins % 60).padStart(2, '0'),
            label2: 'MIN'
          });
        } else {
          setTimeLeft({
            value1: String(totalMins).padStart(2, '0'),
            label1: 'MIN',
            value2: String(totalSecs % 60).padStart(2, '0'),
            label2: 'SEC'
          });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const joinCall = () => {
    navigate(`/session-room?id=${session.Session_Id || session.id}`);
  };

  return (
    <div className="active-focus-card">
      <div className="active-focus-gradient"></div>
      <div className="active-focus-content">
        {/* Left Side: Workstation Image */}
        <div className="active-focus-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80" 
            alt="Session workstation" 
            className="active-focus-img" 
          />
        </div>

        {/* Right Side: Info & Controls */}
        <div className="active-focus-details">
          <div className="active-focus-meta">
            <span className="starts-in-label">
              Starts at {formatTime(session.Time)} ({formatDate(session.Date)})
            </span>
            <h3 className="next-session-title">
              Next Session: {session.Learner_First} {session.Learner_Last}
            </h3>
            <span className="skill-category-tag">
              {session.Skill_Name || 'React.js Development'}
            </span>
          </div>

          <div className="active-focus-actions">
            {/* Countdown Blocks */}
            <div className="countdown-blocks-container">
              <div className="countdown-block">
                <span className="block-number">{timeLeft.value1}</span>
                <span className="block-label">{timeLeft.label1}</span>
              </div>
              <div className="countdown-block">
                <span className="block-number">{timeLeft.value2}</span>
                <span className="block-label">{timeLeft.label2}</span>
              </div>
            </div>

            {/* Join Call button */}
            <button className="join-call-btn" onClick={joinCall}>
              <FiVideo size={18} />
              <span>Join Video Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Entry Component
function TimelineEntry({ session, formatTime, navigate }) {
  const isPending = session.Status === 'Pending' || !session.Meeting_Link;
  const statusLabel = isPending ? 'LINK PENDING' : 'CONFIRMED';
  const statusClass = isPending ? 'pending' : 'confirmed';

  return (
    <div className="timeline-entry" onClick={() => navigate(`/session-room?id=${session.Session_Id || session.id}`)} style={{ cursor: 'pointer' }}>
      {/* Time column */}
      <div className="timeline-time-col">
        <span className="timeline-time-text">{formatTime(session.Time)}</span>
        <div className="timeline-line-indicator"></div>
      </div>

      {/* Card column */}
      <div className="timeline-card hover:bg-slate-50 transition-colors">
        {/* Avatar */}
        <div className="timeline-avatar-wrapper">
          <span>
            {session.Learner_First?.slice(0, 1)}
            {session.Learner_Last?.slice(0, 1)}
          </span>
        </div>

        {/* Information */}
        <div className="timeline-info-wrapper">
          <h4 className="timeline-student-name">
            {session.Learner_First} {session.Learner_Last}
          </h4>
          <span className="timeline-session-slot">
            🕐 {formatTime(session.Time)} ({session.Duration} min session)
          </span>
        </div>

        {/* Action Tags */}
        <div className="timeline-tags-wrapper">
          <span className="timeline-topic-badge">{session.Skill_Name}</span>
          <span className={`timeline-status-badge ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}