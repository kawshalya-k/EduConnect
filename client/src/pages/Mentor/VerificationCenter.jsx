import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiInfo, FiLock, FiClock } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import { LoadingState } from '../../components/Layout/LoadingState';
import { useAuth } from '../../context/AuthContext';
import { fetchVerificationProgress, fetchMentorSkills } from '../../services/mentorApi';
import './VerificationCenter.css';

export default function VerificationCenter() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.mentorId) return;
    setLoading(true);
    try {
      const [progRes, skillsRes] = await Promise.all([
        fetchVerificationProgress(user.mentorId),
        fetchMentorSkills(user.mentorId),
      ]);
      setProgress(progRes.data);
      setSkills(skillsRes.data?.skills || []);
    } catch (err) {
      console.error('Verification load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = skills.filter((s) => s.verified).length;
  const totalRequired = progress?.totalRequired || 3;
  const pct = progress?.percentage || Math.round((verifiedCount / totalRequired) * 100);
  const nextRank = progress?.nextRank || 'Bronze';

  const getSkillStatus = (skill) => {
    if (skill.verified) return 'verified';
    if (skill.retryAvailableAt) {
      const retryDate = new Date(skill.retryAvailableAt);
      if (retryDate > new Date()) return 'retry';
    }
    if (skill.locked) return 'locked';
    return 'available';
  };

  const formatRetryTime = (retryAt) => {
    if (!retryAt) return '';
    const diff = new Date(retryAt) - new Date();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  return (
    <PageLayout>
      <div className="verification-page">
        <Breadcrumb
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Skills' },
          ]}
        />

        <div className="verification-header">
          <p className="verification-eyebrow">✦ VERIFICATION CENTER</p>
          <h1 className="verification-title">MENTOR VERIFICATION CENTER</h1>
          <p className="verification-desc">
            Validate your expertise and level up your mentor status. Achieving Bronze status unlocks
            premium tutoring tools and higher visibility.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading verification status..." />
        ) : (
          <>
            {/* Progress Card */}
            <div className="verification-progress-card">
              <div className="progress-card-left">
                <h3 className="progress-card-title">Path to Bronze Mentor</h3>
                <p className="progress-card-sub">
                  Complete core assessments to earn your first verification badge.
                </p>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="progress-verified-row">
                  <FiCheckCircle size={15} className="progress-check-icon" />
                  <span>{verifiedCount}/{totalRequired} Skills Verified</span>
                </div>
              </div>
              <div className="progress-card-right">
                <div className="next-rank-badge">
                  <span>🏆</span>
                  <span>Next Rank: {nextRank}</span>
                </div>
                <p className="progress-pct">{pct}% <span>Complete</span></p>
              </div>
            </div>

            {/* Add New Skill CTA */}
            <Link to="/verification/add" className="add-skill-cta">
              ADD NEW SKILL
            </Link>

            {/* Skills Awaiting Verification */}
            <div className="skills-await-section">
              <div className="skills-await-header">
                <h2 className="skills-await-title">Skills Awaiting Verification</h2>
                <Link to="/verification/skills" className="view-all-skills">
                  View All Skills →
                </Link>
              </div>

              <div className="skills-await-grid">
                {skills.slice(0, 3).map((skill) => {
                  const status = getSkillStatus(skill);
                  return (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      status={status}
                      retryTime={formatRetryTime(skill.retryAvailableAt)}
                    />
                  );
                })}

                {/* Empty placeholders */}
                {skills.length === 0 && (
                  <div className="skills-empty-state">
                    <p>No skills added yet. Add your first skill to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Tips */}
            <div className="verification-tips-card">
              <div className="tips-icon">
                <span>💡</span>
              </div>
              <div className="tips-content">
                <h4>Verification Tips</h4>
                <p>
                  Each assessment consists of 20 multiple-choice questions and one practical case
                  study. You need a score of 85% or higher to receive your badge.
                </p>
              </div>
              <button className="tips-guide-btn">Preparation Guide</button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

/* Skill Card subcomponent */
function SkillCard({ skill, status, retryTime }) {
  const iconMap = {
    python: '🐍',
    javascript: '📜',
    react: '⌨️',
    design: '🎨',
    management: '🎯',
    default: '🔧',
  };

  const skillKey = skill.name?.toLowerCase().includes('python')
    ? 'python'
    : skill.name?.toLowerCase().includes('design')
    ? 'design'
    : skill.name?.toLowerCase().includes('manage')
    ? 'management'
    : 'default';

  return (
    <div className={`skill-verify-card ${status}`}>
      {status === 'locked' && (
        <div className="skill-card-lock">
          <FiLock size={14} />
        </div>
      )}

      <div className="skill-card-icon-area">
        <div className="skill-card-big-icon">
          <span>{iconMap[skillKey] || iconMap.default}</span>
        </div>
      </div>

      <div className="skill-card-body">
        <h3 className="skill-card-name">{skill.name}</h3>
        <p className="skill-card-desc">{skill.description}</p>
      </div>

      <div className="skill-card-footer">
        {status === 'verified' && (
          <div className="skill-verified-badge">
            <FiCheckCircle size={13} />
            <span>VERIFIED</span>
          </div>
        )}

        {status === 'available' && (
          <>
            {skill.duration && (
              <p className="skill-duration">
                <FiClock size={12} /> {skill.duration} Min Assessment
              </p>
            )}
            <Link
              to={`/verification/skill/${skill.id}/start`}
              className="start-verify-btn"
            >
              Start Verification ▶
            </Link>
          </>
        )}

        {status === 'retry' && (
          <div className="skill-retry-box">
            <p className="retry-label">RETRY IN</p>
            <p className="retry-time">{retryTime}</p>
          </div>
        )}
      </div>

      {status === 'verified' && (
        <button className="skill-card-info-btn">
          <FiInfo size={14} />
        </button>
      )}
    </div>
  );
}