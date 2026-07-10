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
  const skillId = params.get('skillId') || '';
  const score = parseInt(params.get('score') || '0', 10);
  const total = parseInt(params.get('total') || '15', 10);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const [cooldownRemaining, setCooldownRemaining] = useState(4 * 60 * 60 * 1000);
  const [cooldownActive, setCooldownActive] = useState(true);

  // Sync cooldown with actual Last_Attempt
  useEffect(() => {
    const check = async () => {
      const userId = user?.mentorId || user?.id;
      if (!userId || !skillId) return;
      try {
        const res = await fetchMentorSkills(userId);
        const list = Array.isArray(res.data) ? res.data : (res.data?.skills || []);
        const target = list.find(s => (s.Skill_Id || s.id || '').toString() === skillId.toString());
        if (target?.Last_Attempt) {
          const elapsed = Date.now() - new Date(target.Last_Attempt).getTime();
          const remaining = 4 * 60 * 60 * 1000 - elapsed;
          if (remaining > 0) {
            setCooldownRemaining(remaining);
            setCooldownActive(true);
          } else {
            setCooldownActive(false);
            setCooldownRemaining(0);
          }
        }
      } catch (err) {
        console.error('Cooldown check failed:', err);
      }
    };
    check();
  }, [user, skillId]);

  // Countdown tick
  useEffect(() => {
    if (!cooldownActive || cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1000) { clearInterval(timer); setCooldownActive(false); return 0; }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownActive, cooldownRemaining]);

  const formatCooldown = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  const handleRetry = () => {
    if (!cooldownActive && skillId) navigate(`/verification/skill/${skillId}/start`);
  };

  const handleBack = () => {
    navigate(from === 'onboarding' ? '/profile-setup' : '/dashboard');
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
            {/* Alert icon */}
            <div className="failed-alert-icon">
              <FiAlertTriangle size={24} style={{ color: '#EF4444' }} />
            </div>

            <h1 className="failed-title">Verification Failed</h1>

            {/* Score */}
            <div
              className="failed-score-box"
              style={{
                margin: '16px 0', padding: '10px 24px',
                backgroundColor: '#FEF2F2', borderRadius: 12,
                border: '1px solid #FCA5A5', display: 'inline-block',
              }}
            >
              <span style={{ fontSize: 15, color: '#B91C1C', fontWeight: 500 }}>Your Score: </span>
              <strong style={{ fontSize: 18, color: '#991B1B' }}>
                {score} / {total} ({pct}%)
              </strong>
            </div>

            <p className="failed-desc">
              Don't worry — it happens to everyone. Review the materials and try again when the
              cooldown expires. A minimum score of <strong>40% (6 out of 15)</strong> is needed to
              verify your skill.
            </p>

            {/* Level thresholds reminder */}
            <div
              style={{
                margin: '12px auto',
                maxWidth: 360,
                padding: '10px 16px',
                background: '#FFF7ED',
                borderRadius: 10,
                border: '1px solid #FED7AA',
                fontSize: 13,
                color: '#92400E',
                lineHeight: 1.6,
                textAlign: 'left',
              }}
            >
              <strong>Level thresholds (15 questions):</strong><br />
              🥉 Beginner: 6–8 correct&nbsp;&nbsp;
              🥈 Intermediate: 9–11 correct&nbsp;&nbsp;
              🏆 Expert: 12–15 correct
            </div>

            {/* Countdown */}
            <div className="failed-countdown-box">
              <p className="countdown-label">
                {cooldownActive ? 'RE-ATTEMPT AVAILABLE IN' : 'RE-ATTEMPT AVAILABLE NOW'}
              </p>
              <div className="countdown-timer" style={{ justifyContent: 'center', gap: 16, marginTop: 12 }}>
                {cooldownActive ? (
                  <span style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>
                    {formatCooldown(cooldownRemaining)}
                  </span>
                ) : (
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
                    READY TO RETAKE
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, margin: '24px auto' }}>
              <button
                className={`review-materials-btn ${cooldownActive ? 'locked' : ''}`}
                onClick={handleRetry}
                disabled={cooldownActive}
                style={{
                  width: '100%', height: 48,
                  backgroundColor: cooldownActive ? '#E2E8F0' : '#10B981',
                  color: cooldownActive ? '#94A3B8' : '#FFFFFF',
                  border: 'none', borderRadius: 12, fontWeight: 700,
                  cursor: cooldownActive ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {cooldownActive ? (
                  <><FiClock /><span>Try Again (Locked)</span></>
                ) : (
                  <><span>Try Again Now</span><FiArrowRight /></>
                )}
              </button>

              <button
                className="visit-help-btn"
                onClick={handleBack}
                style={{
                  width: '100%', height: 48,
                  backgroundColor: 'transparent',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
                  borderRadius: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
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