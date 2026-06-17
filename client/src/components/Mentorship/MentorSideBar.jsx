import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiCalendar, FiCheckSquare, FiBookOpen, FiDollarSign, FiBarChart2, FiWifi
} from 'react-icons/fi';
import './MentorSideBar.css';

const NAV_ITEMS = [
  { label: 'Upcoming Sessions', path: '/mentor-dashboard', icon: <FiGrid size={17} /> },
  { label: 'Upcoming Sessions', path: '/mentor-sessions', icon: <FiCalendar size={17} /> },
  { label: 'Verified Skills', path: '/verification', icon: <FiCheckSquare size={17} /> },
  { label: 'Skills & Quizzes', path: '/verification/add', icon: <FiBookOpen size={17} /> },
  { label: 'Wallet', path: '/wallet', icon: <FiDollarSign size={17} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <FiBarChart2 size={17} /> },
];

export default function DashboardSidebar({ user }) {
  const location = useLocation();
  const mentorId = user?.mentorId || user?.id || '1';

  // Availability Toggle State
  const [accepting, setAccepting] = useState(() => {
    const saved = localStorage.getItem(`mentor_accepting_${mentorId}`);
    return saved ? JSON.parse(saved) : true;
  });

  const handleToggle = () => {
    const newVal = !accepting;
    setAccepting(newVal);
    localStorage.setItem(`mentor_accepting_${mentorId}`, JSON.stringify(newVal));
  };

  return (
    <aside className="dash-sidebar">
      <div className="sidebar-header-section">
        <h3 className="sidebar-title">Session Manager</h3>
        <p className="sidebar-subtitle">Manage your learning sessions</p>
      </div>

      <nav className="dash-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          // Match `/mentor-sessions` for Sessions tab, and respect active state
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`dash-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="dash-sidebar-icon">{item.icon}</span>
              <span className="dash-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Quick Actions */}
      <div className="sidebar-quick-actions">
        {/* Availability Toggle */}
        <div className="availability-toggle-card">
          <div className="toggle-header">
            <span className="toggle-title">AVAILABILITY</span>
            <button 
              onClick={handleToggle}
              className={`toggle-switch ${accepting ? 'active' : ''}`}
              aria-label="Toggle availability"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
          <span className="toggle-description">
            {accepting ? 'Accepting new requests' : 'Not accepting requests'}
          </span>
        </div>

        {/* Daily Earnings Card */}
        <div className="daily-earnings-card">
          <div className="earnings-header">
            <FiDollarSign className="earnings-icon" size={14} />
            <span className="earnings-title">Daily Earnings</span>
          </div>
          <div className="earnings-value-row">
            <span className="earnings-amount">150</span>
            <span className="earnings-currency">Skill Coins</span>
          </div>
        </div>

        {/* Go Live Button */}
        <button className="go-live-btn">
          <FiWifi className="live-icon" size={16} />
          <span className="live-text">Go Live</span>
        </button>
      </div>
    </aside>
  );
}