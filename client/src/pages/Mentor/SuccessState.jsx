import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiAward, FiArrowRight } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSkills } from '../../services/mentorApi';
import './SuccessState.css';

export default function VerificationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || 'dashboard';
  const skillId = params.get('skillId');
  const score = params.get('score') || '12';
  const level = params.get('level') || 'Expert';

  const [cooldownRemaining, setCooldownRemaining] = useState(4 * 60 * 60 * 1000); // default 4 hours
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
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getLevelCoins = (lvl) => {
    if (lvl === 'Beginner') return 5;
    if (lvl === 'Intermediate') return 10;
    return 15; // Expert
  };

  const coins = getLevelCoins(level);

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="success-page" style={{ flex: 1, minWidth: 0 }}>
          <div className="success-center">
            <div className="success-card">
              {/* Badge Icon */}
              <div className="success-badge-icon">
                <div className="badge-medal" style={{ background: level === 'Expert' ? '#FBBF24' : level === 'Intermediate' ? '#94A3B8' : '#D97706' }}>
                  <span className="medal-icon">🎖</span>
                </div>
                <div className="badge-check">
                  <FiCheckCircle size={18} />
                </div>
              </div>

              <h1 className="success-title">Skill Verified! 🎉</h1>
              <p className="success-subtitle">{level} Level Achieved</p>

              {/* Score Display */}
              <div className="success-score-box" style={{ margin: '16px 0', padding: '10px 24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'inline-block' }}>
                <span style={{ fontSize: '15px', color: '#64748B', fontWeight: '500' }}>Score: </span>
                <strong style={{ fontSize: '18px', color: '#0F172A' }}>{score} / 15 ({Math.round((score / 15) * 100)}%)</strong>
              </div>

              {/* Reward Box */}
              <div className="success-reward-box" style={{ marginTop: '8px' }}>
                <p className="reward-label">REWARDS CREDITED</p>
                <div className="reward-coins">
                  <span className="reward-coin-icon">🪙</span>
                  <span>+{coins} SC</span>
                </div>
              </div>

              <p className="success-message">
                Congratulations! You successfully completed the quiz. You have been awarded the <strong>{level}</strong> badge level for this skill, and <strong>{coins} SC</strong> has been credited to your wallet balance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '16px' }}>
                <button
                  className="go-dashboard-btn"
                  onClick={() => {
                    if (from === 'onboarding') {
                      navigate(`/profile-setup?verified_skill=${encodeURIComponent(skillId)}`);
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  {from === 'onboarding' ? 'Return to Profile Setup →' : 'Go to Dashboard →'}
                </button>

                <button
                  className={`redo-quiz-btn ${cooldownActive ? 'locked' : ''}`}
                  onClick={() => {
                    if (!cooldownActive && skillId) {
                      navigate(`/verification/skill/${skillId}/start`);
                    }
                  }}
                  disabled={cooldownActive}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    border: cooldownActive ? '1px solid #E2E8F0' : '1px solid #10B981',
                    background: cooldownActive ? '#F8FAFC' : '#FFFFFF',
                    color: cooldownActive ? '#94A3B8' : '#10B981',
                    fontWeight: '700',
                    cursor: cooldownActive ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cooldownActive ? (
                    <>
                      <FiClock />
                      <span>Redo Quiz (Locked: {formatCooldown(cooldownRemaining)})</span>
                    </>
                  ) : (
                    <>
                      <span>Redo Quiz to Improve Level</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>

              {/* Community */}
              <div className="success-community-row" style={{ marginTop: '24px' }}>
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