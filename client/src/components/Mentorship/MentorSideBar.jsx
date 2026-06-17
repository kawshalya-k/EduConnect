// Left sidebar for Mentor Dashboard 

import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiCalendar, FiCheckSquare, FiBookOpen, FiBarChart2,
} from 'react-icons/fi';
import './MentorSideBar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiGrid size={17} /> },
  { label: 'Upcoming Sessions', path: '/MySessions', icon: <FiCalendar size={17} /> },
  { label: 'Verified Skills', path: '/verification', icon: <FiCheckSquare size={17} /> },
  { label: 'Skills & Quizzes', path: '/verification/add', icon: <FiBookOpen size={17} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <FiBarChart2 size={17} /> },
];

export default function DashboardSidebar({ user }) {
  const location = useLocation();

  return (
    <aside className="dash-sidebar">
      <nav className="dash-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`dash-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="dash-sidebar-icon">{item.icon}</span>
            <span className="dash-sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Info at bottom */}
      {user && (
        <div className="dash-sidebar-user">
          <div className="sidebar-user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user.name}</p>
            <p className="sidebar-user-dept">{user.department}</p>
          </div>
        </div>
      )}
    </aside>
  );
}