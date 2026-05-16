import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, mode, toggleMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMentorMode = mode === 'mentor';

  // Navbar links differ by mode
  const mentorLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Sessions', path: '/sessions' },
    { label: 'Messages', path: '/messages' },
  ];

  const learnerLinks = [
    { label: 'Dashboard', path: '/learner' },
    { label: 'Sessions', path: '/sessions' },
    { label: 'Messages', path: '/messages' },
  ];

  const links = isMentorMode ? mentorLinks : learnerLinks;

  const handleToggle = () => {
    toggleMode();
    if (mode === 'mentor') {
      navigate('/learner');
    } else {
      navigate('/dashboard');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={isMentorMode ? '/dashboard' : '/learner'} className="navbar-logo">
          <span className="navbar-logo-icon">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a9e6e" />
              <path d="M8 20L16 10L24 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 20H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar-logo-text">EduConnect</span>
        </Link>

        {/* Nav Links */}
        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="navbar-right">
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${isMentorMode ? 'active' : ''}`}
              onClick={isMentorMode ? undefined : handleToggle}
            >
              Mentor Mode
            </button>
            <button
              className={`mode-btn ${!isMentorMode ? 'active' : ''}`}
              onClick={!isMentorMode ? undefined : handleToggle}
            >
              Learner
            </button>
          </div>

          {/* Skill Coins */}
          <Link to="/wallet" className="skill-coins-btn">
            <span className="coins-icon">$</span>
            <span>{user?.skillCoins ?? 0} Skill Coins</span>
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="navbar-icon-btn">
            <FiBell size={20} />
          </Link>

          {/* Avatar */}
          <Link to="/profile" className="navbar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="avatar-initials">{getInitials(user?.name)}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}