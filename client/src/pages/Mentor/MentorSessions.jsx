import { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiVideo, FiMessageSquare } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import { LoadingState } from '../../components/Layout/LoadingState';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSessions } from '../../services/mentorApi';
import './MentorSessions.css';

const SESSION_TABS = [
  { id: 'upcoming', label: 'Upcoming Sessions' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function Sessions() {
  const { user, mode } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSessions();
  }, [user, activeTab]);

  const loadSessions = async () => {
    if (!user?.mentorId && mode === 'mentor') return;
    setLoading(true);
    try {
      const res = await fetchMentorSessions(user.mentorId || user.id, {
        status: activeTab,
      });
      setSessions(res.data?.sessions || []);
    } catch (err) {
      console.error('Sessions load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sidebar = (
    <div className="sessions-sidebar">
      <h3 className="sidebar-title">Session Manager</h3>
      <p className="sidebar-subtitle">Manage your learning sessions</p>

      <nav className="sessions-nav">
        {SESSION_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sessions-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Filter */}
      <div className="sessions-filter">
        <label className="filter-label">Filter</label>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Sessions</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );

  return (
    <PageLayout sidebar={sidebar}>
      <div className="sessions-main">
        <div className="sessions-header">
          <h1 className="sessions-title">
            {SESSION_TABS.find((t) => t.id === activeTab)?.label || 'Sessions'}
          </h1>
          <p className="sessions-subtitle">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading sessions..." />
        ) : sessions.length === 0 ? (
          <div className="sessions-empty">
            <p>No {activeTab} sessions</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} status={activeTab} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function SessionCard({ session, status }) {
  const isMentor = localStorage.getItem('educonnect_mode') === 'mentor';

  const statusColor = {
    confirmed: 'success',
    pending: 'warning',
    completed: 'gray',
    cancelled: 'error',
  }[session.status] || 'gray';

  return (
    <div className={`session-card status-${statusColor}`}>
      <div className="session-card-top">
        <div className="session-learner">
          <div className="session-avatar">
            {session.learnerAvatar ? (
              <img src={session.learnerAvatar} alt={session.learnerName} />
            ) : (
              <span>{session.learnerName?.slice(0, 1)}</span>
            )}
          </div>
          <div className="session-learner-info">
            <h3 className="session-learner-name">{session.learnerName}</h3>
            <p className="session-topic">{session.topic}</p>
          </div>
        </div>

        <div className={`session-status-badge status-${statusColor}`}>
          {session.status.toUpperCase()}
        </div>
      </div>

      <div className="session-details">
        <div className="detail-item">
          <FiClock size={14} />
          <span>{session.startTime}</span>
        </div>
        <div className="detail-item">
          <FiMapPin size={14} />
          <span>{session.duration}</span>
        </div>
      </div>

      {status === 'upcoming' && (
        <div className="session-actions">
          <button className="session-action-btn primary">
            <FiVideo size={14} />
            Join Video Call
          </button>
          <button className="session-action-btn">
            <FiMessageSquare size={14} />
            Message
          </button>
        </div>
      )}

      {status === 'completed' && session.rating && (
        <div className="session-rating">
          <span className="rating-stars">{'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}</span>
          <span className="rating-text">{session.rating}/5 - {session.ratingComment}</span>
        </div>
      )}
    </div>
  );
}