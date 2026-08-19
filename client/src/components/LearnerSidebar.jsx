import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiAward, FiDollarSign } from 'react-icons/fi';
import './Mentorship/MentorSideBar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/learner-dashboard', icon: <FiGrid size={17} />, exact: true },
  { label: 'Mentors', path: '/find-mentor', icon: <FiUsers size={17} /> },
  { label: 'My Sessions', path: '/my-sessions', icon: <FiCalendar size={17} /> },
  { label: 'Badges and Achievements', path: '/badges', icon: <FiAward size={17} /> },
  { label: 'Wallet', path: '/mentor-wallet', icon: <FiDollarSign size={17} /> },
];

export default function LearnerSidebar() {
  const location = useLocation();

  return (
    <aside className="dash-sidebar">
      <nav className="dash-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          let isActive = false;
          if (item.path === '/learner-dashboard') {
            isActive = location.pathname === '/learner-dashboard' || location.pathname === '/dashboard';
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
    </aside>
  );
}
