import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiAward, FiArrowRight } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSkills } from '../../services/mentorApi';
import './SuccessState.css';

// Level → accent colour for the medal badge
const LEVEL_COLOR = {
  Expert: '#FBBF24', // gold
  Intermediate: '#94A3B8', // silver
  Beginner: '#D97706', // bronze-ish amber
};

const LEVEL_EMOJI = {
  Expert: '🏆',
  Intermediate: '🥈',
  Beginner: '🥉',
};

const LEVEL_COINS = {
  Expert: 15,
  Intermediate: 10,
  Beginner: 5,
};

export default function VerificationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const params = new URLSearchParams(location.search);
  const from = params.get('from') || 'dashboard';
  const skillId = params.get('skillId') || '';
  const score = parseInt(params.get('score') || '12', 10);
  const total = parseInt(params.get('total') || '15', 10);
  const level = params.get('level') || 'Expert';

  const coins = LEVEL_COINS[level] ?? 5;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const [cooldownRemaining, setCooldownRemaining] = useState(4 * 60 * 60 * 1000);
  const [cooldownActive, setCooldownActive] = useState(true);

  // Sync cooldown with actual Last_Attempt from backend
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
    return `${h}h ${m}m ${s}s`;
  };

  const handleDashboard = () => {
    if (from === 'onboarding') {
      navigate(`/profile-setup?verified_skill=${encodeURIComponent(skillId)}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRedo = () => {
    if (!cooldownActive && skillId) {
      navigate(`/verification/skill/${skillId}/start`);
    }
  };

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="success-page" style={{ flex: 1, minWidth: 0 }}>
          <div className="success-center">
            <div className="success-card">

              {/* ── Medal badge ── */}
              <div className="success-badge-icon">
                <div
                  className="badge-medal"
                  style={{ background: LEVEL_COLOR[level] || '#D97706' }}
                >
                  <span className="medal-icon">{LEVEL_EMOJI[level] || '🎖'}</span>
                </div>
                <div className="badge-check">
                  <FiCheckCircle size={18} />
                </div>
              </div>

              <h1 className="success-title">Skill Verified! 🎉</h1>
              <p className="success-subtitle">{level} Level Achieved</p>

              {/* ── Score ── */}
              <div
                className="success-score-box"
                style={{
                  margin: '16px 0',
                  padding: '10px 24px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  display: 'inline-block',
                }}
              >
                <span style={{ fontSize: 15, color: '#64748B', fontWeight: 500 }}>Score: </span>
                <strong style={{ fontSize: 18, color: '#0F172A' }}>
                  {score} / {total} ({pct}%)
                </strong>
              </div>

              {/* ── Rewards ── */}
              <div className="success-reward-box" style={{ marginTop: 8 }}>
                <p className="reward-label">REWARDS CREDITED</p>
                <div className="reward-coins">
                  <span className="reward-coin-icon">🪙</span>
                  <span>+{coins} SC</span>
                </div>
              </div>

              {/* ── Level breakdown hint ── */}
              <div
                style={{
                  margin: '12px 0',
                  padding: '10px 16px',
                  background: '#F0FDF4',
                  borderRadius: 10,
                  border: '1px solid #BBF7D0',
                  fontSize: 13,
                  color: '#065F46',
                  lineHeight: 1.6,
                  textAlign: 'left',
                }}
              >
                <strong>Level thresholds (15 questions):</strong><br />
                🥉 Beginner: 6–8 correct (+5 SC)&nbsp;&nbsp;
                🥈 Intermediate: 9–11 correct (+10 SC)&nbsp;&nbsp;
                🏆 Expert: 12–15 correct (+15 SC)
              </div>

              <p className="success-message">
                Congratulations! You successfully completed the assessment. You have been awarded the{' '}
                <strong>{level}</strong> badge for this skill, and <strong>{coins} SC</strong> has
                been credited to your wallet.
              </p>

              {/* ── Actions ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 16 }}>
                <button className="go-dashboard-btn" onClick={handleDashboard} style={{ width: '100%' }}>
                  {from === 'onboarding' ? 'Return to Profile Setup →' : 'Go to Dashboard →'}
                </button>

                <button
                  className={`redo-quiz-btn ${cooldownActive ? 'locked' : ''}`}
                  onClick={handleRedo}
                  disabled={cooldownActive}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', height: 48, borderRadius: 12,
                    border: cooldownActive ? '1px solid #E2E8F0' : '1px solid #10B981',
                    background: cooldownActive ? '#F8FAFC' : '#FFFFFF',
                    color: cooldownActive ? '#94A3B8' : '#10B981',
                    fontWeight: 700, cursor: cooldownActive ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cooldownActive ? (
                    <>
                      <FiClock />
                      <span>Improve Level (Locked: {formatCooldown(cooldownRemaining)})</span>
                    </>
                  ) : (
                    <>
                      <span>Redo Quiz to Improve Level</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>

              {/* ── Community row ── */}
              <div className="success-community-row" style={{ marginTop: 24 }}>
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
      </div>
    </PageLayout>
  );
}