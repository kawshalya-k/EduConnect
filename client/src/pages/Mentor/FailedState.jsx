import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSkills } from '../../services/mentorApi';
import { FiClock, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import failureHero from '../../Assets/FailedStateImage.jpg';
import './FailedState.css';

export default function VerificationFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || 'dashboard';
  const skillId = params.get('skillId');
  const score = params.get('score') || '0';

  const [cooldownRemaining, setCooldownRemaining] = useState(4 * 60 * 60 * 1000); // 4 hours in ms
  const [cooldownActive, setCooldownActive] = useState(true);

  // Fetch skill info to synchronize cooldown timer with backend Last_Attempt
  useEffect(() => {
    const checkSkillCooldown = async () => {
      const userId = user?.mentorId || user?.id;
      if (userId && skillId) {
        try {
          const res = await fetchMentorSkills(userId);
          const skillsList = Array.isArray(res.data) ? res.data : (res.data?.skills || []);
          const target = skillsList.find(s => (s.Skill_Id || s.id || '').toString() === skillId.toString());
          if (target && target.Last_Attempt) {
            const lastAttempt = new Date(target.Last_Attempt).getTime();
            const elapsed = Date.now() - lastAttempt;
            const cooldownMs = 4 * 60 * 60 * 1000;
            if (elapsed < cooldownMs) {
              setCooldownRemaining(cooldownMs - elapsed);
              setCooldownActive(true);
            } else {
              setCooldownActive(false);
              setCooldownRemaining(0);
            }
          }
        } catch (err) {
          console.error('Failed to fetch skill for cooldown check:', err);
        }
      }
    };

    checkSkillCooldown();
  }, [user, skillId]);

  // Cooldown ticking
  useEffect(() => {
    if (!cooldownActive || cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          setCooldownActive(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownActive, cooldownRemaining]);

  const formatCooldown = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="failed-page" style={{ flex: 1, minWidth: 0 }}>
          {/* Hero image */}
          <div className="failed-hero-image">
            <img src={failureHero} alt="Verification Failure Banner" />
          </div>

          <div className="failed-content">
            {/* Alert Icon */}
            <div className="failed-alert-icon">
              <FiAlertTriangle size={24} style={{ color: '#EF4444' }} />
            </div>

            <h1 className="failed-title">Verification Failed</h1>
            
            {/* Score Display */}
            <div className="failed-score-box" style={{ margin: '16px 0', padding: '10px 24px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FCA5A5', display: 'inline-block' }}>
              <span style={{ fontSize: '15px', color: '#B91C1C', fontWeight: '500' }}>Your Score: </span>
              <strong style={{ fontSize: '18px', color: '#991B1B' }}>{score} / 15 ({Math.round((score / 15) * 100)}%)</strong>
            </div>

            <p className="failed-desc">
              Don't worry, it happens to the best of us. Take some time to review the materials and try again. Practice makes perfect! A minimum score of 40% (6 correct answers) is required to verify.
            </p>

            {/* Countdown */}
            <div className="failed-countdown-box">
              <p className="countdown-label">{cooldownActive ? "RE-ATTEMPT AVAILABLE IN" : "RE-ATTEMPT AVAILABLE NOW"}</p>
              <div className="countdown-timer" style={{ justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                {cooldownActive ? (
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E293B' }}>
                    {formatCooldown(cooldownRemaining)}
                  </span>
                ) : (
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                    READY TO RETAKE
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px', margin: '24px auto' }}>
              <button
                className={`review-materials-btn ${cooldownActive ? 'locked' : ''}`}
                onClick={() => {
                  if (!cooldownActive && skillId) {
                    navigate(`/verification/skill/${skillId}/start`);
                  }
                }}
                disabled={cooldownActive}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: cooldownActive ? '#E2E8F0' : '#10B981',
                  color: cooldownActive ? '#94A3B8' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: cooldownActive ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {cooldownActive ? (
                  <>
                    <FiClock />
                    <span>Try Again (Locked)</span>
                  </>
                ) : (
                  <>
                    <span>Try Again Now</span>
                    <FiArrowRight />
                  </>
                )}
              </button>

              <button
                className="visit-help-btn"
                onClick={() => {
                  if (from === 'onboarding') {
                    navigate('/profile-setup');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: 'transparent',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {from === 'onboarding' ? 'Return to Profile Setup' : 'Go to Dashboard'}
              </button>
            </div>

            {/* Progress dots */}
            <div className="progress-dots">
              <span className="dot active" />
              <span className="dot active" />
              <span className="dot active" />
              <span className="dot error" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}