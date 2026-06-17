import { Link } from 'react-router-dom';
import { FiFacebook, FiGithub, FiMail } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a9e6e" />
              <path d="M8 20L16 10L24 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 20H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>EduConnect</span>
          </div>
          <p className="footer-tagline">
            Empowering University students through peer-to-peer learning and community recognition.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook"><FiFacebook size={16} /></a>
            <a href="#" className="social-icon" aria-label="GitHub"><FiGithub size={16} /></a>
            <a href="#" className="social-icon" aria-label="Email"><FiMail size={16} /></a>
          </div>
        </div>

        {/* Student Center */}
        <div className="footer-col">
          <h4>Student Center</h4>
          <ul>
            <li><Link to="/register">Student Registration</Link></li>
            <li><Link to="/discovery">Search Mentors</Link></li>
            <li><Link to="/skills">Skill Marketplace</Link></li>
          </ul>
        </div>

        {/* Mentorship */}
        <div className="footer-col">
          <h4>Mentorship</h4>
          <ul>
            <li><Link to="/onboarding">Mentor Onboarding</Link></li>
            <li><Link to="/verification">Verification Center</Link></li>
            <li><Link to="/tools">Teaching Tools</Link></li>
            <li><Link to="/guidelines">Mentor Guidelines</Link></li>
          </ul>
        </div>

        {/* Portal */}
        <div className="footer-col">
          <h4>Portal</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/community">Community Guidelines</Link></li>
            <li><Link to="/support">Contact Support</Link></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EduConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}