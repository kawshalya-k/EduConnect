import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import './SuccessState.css';

export default function VerificationSuccess() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="success-page">
        <div className="success-center">
          <div className="success-card">
            {/* Badge Icon */}
            <div className="success-badge-icon">
              <div className="badge-medal">
                <span className="medal-icon">🎖</span>
              </div>
              <div className="badge-check">
                <FiCheckCircle size={18} />
              </div>
            </div>

            <h1 className="success-title">Verification Success</h1>
            <p className="success-subtitle">Verification Successful!</p>

            {/* Reward Box */}
            <div className="success-reward-box">
              <p className="reward-label">NEW REWARD EARNED</p>
              <div className="reward-coins">
                <span className="reward-coin-icon">🪙</span>
                <span>+100 Skill Coins</span>
              </div>
            </div>

            <p className="success-message">
              Congratulations! You have officially become a{' '}
              <strong>Bronze Mentor</strong>. Your expertise is now ready to inspire others
              across the EduConnect community.
            </p>

            <button
              className="go-dashboard-btn"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard →
            </button>

            <button className="share-achievement-btn">
              Share Achievement
            </button>

            {/* Community */}
            <div className="success-community-row">
              <div className="community-avatars">
                <div className="community-avatar c1" />
                <div className="community-avatar c2" />
                <span className="community-plus">+12k</span>
              </div>
              <span className="community-label">Join 12,000+ verified mentors</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}