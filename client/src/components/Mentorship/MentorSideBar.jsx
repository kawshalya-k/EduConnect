import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../services/axiosConfig';
import {
  FiGrid, FiCalendar, FiCheckSquare, FiBookOpen, FiDollarSign, FiBarChart2, FiWifi
} from 'react-icons/fi';
import './MentorSideBar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/mentor-dashboard', icon: <FiGrid size={17} />, exact: true },
  { label: 'Upcoming Sessions', path: '/mentor-sessions', icon: <FiCalendar size={17} /> },
  { label: 'Verified Skills', path: '/verification', icon: <FiCheckSquare size={17} />, exact: true },
  { label: 'Skills & Quizzes', path: '/verification/add', icon: <FiBookOpen size={17} />, exact: true },
  { label: 'Wallet', path: '/mentor-wallet', icon: <FiDollarSign size={17} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <FiBarChart2 size={17} /> },
];

export default function DashboardSidebar({ user }) {
  const location = useLocation();
  const mentorId = user?.mentorId || user?.id || '1';

  const [accepting, setAccepting] = useState(() => {
    const saved = localStorage.getItem(`mentor_accepting_${mentorId}`);
    return saved ? JSON.parse(saved) : true;
  });

  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [earningsLoading, setEarningsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyEarnings = async () => {
      try {
        setEarningsLoading(true);
        const response = await API.get(`/wallet/${mentorId}/transactions`);
        const data = response.data;

        const today = new Date().toISOString().split('T')[0];

        const todayEarnings = (data.transactions || data).reduce((sum, txn) => {
          const txnDate = new Date(txn.date || txn.createdAt || txn.timestamp).toISOString().split('T')[0];
          const isToday = txnDate === today;
          const isCredit = txn.type === 'credit' || txn.type === 'earning' || txn.amount > 0;
          return isToday && isCredit ? sum + (txn.amount || 0) : sum;
        }, 0);

        setDailyEarnings(todayEarnings);
      } catch (err) {
        console.error('Error fetching daily earnings:', err);
        setDailyEarnings(0);
      } finally {
        setEarningsLoading(false);
      }
    };

    fetchDailyEarnings();
  }, [mentorId]);

  const handleToggle = () => {
    const newVal = !accepting;
    setAccepting(newVal);
    localStorage.setItem(`mentor_accepting_${mentorId}`, JSON.stringify(newVal));
  };

  return (
    <aside className="dash-sidebar">

      <nav className="dash-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          let isActive = false;
          if (item.path === '/mentor-dashboard') {
            isActive = location.pathname === '/mentor-dashboard' || location.pathname === '/dashboard';
          } else if (item.path === '/verification') {
            isActive = location.pathname.startsWith('/verification') && location.pathname !== '/verification/add';
          } else if (item.path === '/verification/add') {
            isActive = location.pathname === '/verification/add';
          } else {
            isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
          }
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

      <div className="sidebar-quick-actions">
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

        <div className="daily-earnings-card">
          <div className="earnings-header">
            <FiDollarSign className="earnings-icon" size={14} />
            <span className="earnings-title">Daily Earnings</span>
          </div>
          <div className="earnings-value-row">
            {earningsLoading ? (
              <span className="earnings-loading">...</span>
            ) : (
              <>
                <span className="earnings-amount">{dailyEarnings}</span>
                <span className="earnings-currency">Skill Wallet</span>
              </>
            )}
          </div>
        </div>

        <button className="go-live-btn">
          <FiWifi className="live-icon" size={16} />
          <span className="live-text">Go Live</span>
        </button>
      </div>
    </aside>
  );
}