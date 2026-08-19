import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiCheckCircle,
  FiInfo,
  FiLock,
  FiClock,
  FiTerminal,
  FiPenTool,
  FiGrid,
  FiZap,
  FiAward,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { LoadingState } from '../../components/Layout/LoadingState';
import { useAuth } from '../../context/AuthContext';
import { fetchMentorSkills } from '../../services/mentorApi';
import API from '../../services/axiosConfig';
import './VerificationCenter.css';

// ─── Rank / level helpers ────────────────────────────────────────────────────

const RANK_ORDER = ['Unranked', 'Bronze', 'Silver', 'Gold'];

/**
 * Derive the mentor's current overall rank from their verified skills.
 * Rules (from backend evaluateMentorLevel):
 *   Gold   → Score >= 50
 *   Silver → Score >= 20
 *   Bronze → any verified skill
 *   Unranked → no verified skills
 *
 * The mentor's "effective" level is the highest level any single verified
 * skill has reached (stored in Mentor_Level on User_Skill / Levelling_Data).
 */
function deriveCurrentRank(skills) {
  const verified = skills.filter(isVerified);
  if (verified.length === 0) return 'Unranked';

  const levelPriority = { Gold: 3, Silver: 2, Bronze: 1 };
  let best = 'Bronze';
  for (const s of verified) {
    const lvl = s.Mentor_Level || 'Bronze';
    if ((levelPriority[lvl] || 0) > (levelPriority[best] || 0)) {
      best = lvl;
    }
  }
  return best;
}

function nextRank(current) {
  const idx = RANK_ORDER.indexOf(current);
  return RANK_ORDER[idx + 1] || null; // null means already at Gold
}

/**
 * Compute progress toward the next rank.
 * Bronze → verify 3 skills (skill count gating)
 * Silver → highest verified skill Score >= 20
 * Gold   → highest verified skill Score >= 50
 */
function computeProgress(skills, currentRank) {
  if (currentRank === 'Gold') {
    return { pct: 100, label: 'Maximum rank achieved', current: 0, required: 0 };
  }

  if (currentRank === 'Unranked' || currentRank === 'Bronze') {
    // Path to Bronze: need 3 verified skills
    const verifiedCount = skills.filter(isVerified).length;
    const required = 3;
    const pct = Math.min(Math.round((verifiedCount / required) * 100), 100);
    return {
      pct,
      label: `Complete core assessments to earn your first verification badge.`,
      current: verifiedCount,
      required,
      unit: 'Skills Verified',
    };
  }

  if (currentRank === 'Silver') {
    // Path to Gold: need Score >= 50 on any skill
    const maxScore = Math.max(0, ...skills.filter(isVerified).map((s) => s.Score || 0));
    const required = 50;
    const pct = Math.min(Math.round((maxScore / required) * 100), 100);
    return {
      pct,
      label: `Reach a session score of 50 on any skill to earn Gold status.`,
      current: maxScore,
      required,
      unit: 'Score Points',
    };
  }

  // Bronze → Silver: need Score >= 20
  const maxScore = Math.max(0, ...skills.filter(isVerified).map((s) => s.Score || 0));
  const required = 20;
  const pct = Math.min(Math.round((maxScore / required) * 100), 100);
  return {
    pct,
    label: `Reach a session score of 20 on any skill to earn Silver status.`,
    current: maxScore,
    required,
    unit: 'Score Points',
  };
}

function isVerified(skill) {
  const v = skill.Verification_Status;
  return v === 1 || v === true || v === 'Verified';
}

const RANK_ICON = {
  Bronze: <FiAward size={16} />,
  Silver: <FiStar size={16} />,
  Gold: <FiTrendingUp size={16} />,
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VerificationCenter() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [searchParams] = useSearchParams();

  const isAllSkillsView = searchParams.get('view') === 'all';

  useEffect(() => {
    loadData();
  }, [user]);

  // Live countdown update every second (to animate active background timers)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    const userId = user?.mentorId || user?.id;
    if (!userId) return;
    setLoading(true);
    try {
      const skillsRes = await fetchMentorSkills(userId);
      const skillsList = Array.isArray(skillsRes.data)
        ? skillsRes.data
        : (skillsRes.data?.skills || []);
      setSkills(skillsList);
    } catch (err) {
      console.error('Verification load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check for expired background timers and notify backend
  useEffect(() => {
    const checkExpiredTimers = async () => {
      let changed = false;
      for (const skill of skills) {
        const storedStartTime = localStorage.getItem(`quiz_start_time_${skill.Skill_Id}`);
        if (storedStartTime) {
          const elapsed = (Date.now() - parseInt(storedStartTime, 10)) / 1000;
          if (elapsed >= 3600) {
            localStorage.removeItem(`quiz_start_time_${skill.Skill_Id}`);
            changed = true;
            try {
              await API.post('/mentors/skills/verify', { skillId: skill.Skill_Id, passed: false });
            } catch (err) {
              console.error('Failed to notify background timeout:', err);
            }
          }
        }
      }
      if (changed) {
        loadData();
      }
    };

    if (skills.length > 0) {
      checkExpiredTimers();
    }
  }, [skills, currentTime]);

  const getSkillStatus = (skill) => {
    if (isVerified(skill)) return 'verified';

    if (skill.Verification_Status === 'Testing') {
      if (skill.Last_Attempt) {
        const diffSecs = (Date.now() - new Date(skill.Last_Attempt).getTime()) / 1000;
        if (diffSecs < 600) {
          return 'testing';
        }
      }
    }

    if (skill.Last_Attempt) {
      const diffHours = (Date.now() - new Date(skill.Last_Attempt).getTime()) / (1000 * 60 * 60);
      if (diffHours < 4) return 'retry';
    }

    return 'available';
  };

  const formatRetryTime = (lastAttempt) => {
    if (!lastAttempt) return '';
    const diff = new Date(lastAttempt).getTime() + 4 * 60 * 60 * 1000 - currentTime;
    if (diff <= 0) return '0h 0m';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const formatTestingTime = (lastAttempt) => {
    if (!lastAttempt) return '';
    const diff = new Date(lastAttempt).getTime() + 10 * 60 * 1000 - currentTime;
    if (diff <= 0) return '00:00';
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Derived rank / progress (all from DB data) ──
  const currentRank = deriveCurrentRank(skills);
  const next = nextRank(currentRank);
  const progress = computeProgress(skills, currentRank);

  const progressTitle =
    currentRank === 'Gold'
      ? 'Gold Mentor — Maximum Rank'
      : `Path to ${next} Mentor`;

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="verification-page" style={{ flex: 1, minWidth: 0 }}>
          {isAllSkillsView ? (
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/mentor-dashboard' },
              { label: 'Skills', path: '/verification' },
              { label: 'All Skills' },
            ]}
          />
        ) : (
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/mentor-dashboard' },
              { label: 'Skills' },
            ]}
          />
        )}

        <div className="verification-header">
          <p className="verification-eyebrow">✦ VERIFICATION CENTER</p>
          <h1 className="verification-title">
            {isAllSkillsView ? 'All Skills' : 'MENTOR VERIFICATION CENTER'}
          </h1>
          <p className="verification-desc">
            {isAllSkillsView
              ? 'View and manage all of your teaching skills and their corresponding verification statuses.'
              : 'Validate your expertise and level up your mentor status. Achieving Bronze status unlocks premium tutoring tools and higher visibility.'}
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading verification status..." />
        ) : (
          <>
            {/* ── Progress Card ── (Hide on All Skills View) */}
            {!isAllSkillsView && (
              <div className="verification-progress-card">
                <div className="progress-card-left">
                  <h3 className="progress-card-title">{progressTitle}</h3>
                  <p className="progress-card-sub">{progress.label}</p>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${progress.pct}%` }} />
                  </div>
                  <div className="progress-verified-row">
                    <FiCheckCircle className="progress-check-icon" />
                    <span>
                      {progress.current}/{progress.required} {progress.unit}
                    </span>
                  </div>
                </div>

                <div className="progress-card-right">
                  {/* Current rank badge */}
                  <div className="current-rank-badge">
                    <span className={`rank-dot rank-dot--${currentRank.toLowerCase()}`} />
                    Current: <strong>{currentRank}</strong>
                  </div>

                  {/* Next rank badge (hide if Gold) */}
                  {next && (
                    <div className="next-rank-badge">
                      {RANK_ICON[next] || <FiAward size={16} />}
                      <span>Next Rank: {next}</span>
                    </div>
                  )}

                  <p className="progress-pct">
                    {progress.pct}% <span>Complete</span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Add Skill CTA ── (Hide on All Skills View) */}
            {!isAllSkillsView && (
              <Link to="/verification/add" className="add-skill-cta">
                ADD NEW SKILL
              </Link>
            )}

            {/* ── Skills Grid ── */}
            <div className="skills-await-section">
              <div className="skills-await-header">
                <h2 className="skills-await-title">
                  {isAllSkillsView ? 'My Skills' : 'Skills'}
                </h2>
                {!isAllSkillsView && (
                  <Link to="/verification?view=all" className="view-all-skills">
                    View All Skills →
                  </Link>
                )}
              </div>

              <div className="skills-await-grid">
                {skills.map((skill) => {
                  const status = getSkillStatus(skill);
                  return (
                    <SkillCard
                      key={skill.User_Skill_Id || skill.Skill_Id}
                      skill={skill}
                      status={status}
                      retryTime={formatRetryTime(skill.Last_Attempt)}
                      testingTime={formatTestingTime(skill.Last_Attempt)}
                    />
                  );
                })}

                {skills.length === 0 && (
                  <div className="skills-empty-state">
                    No skills added yet. Add your first skill to get started.
                  </div>
                )}
              </div>
            </div>

            {/* ── Verification Tips ── (Hide on All Skills View) */}
            {!isAllSkillsView && (
              <div className="verification-tips-card">
                <div className="tips-icon">
                  <FiZap />
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
            )}
          </>
        )}
        </div>
      </div>
    </PageLayout>
  );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────

function SkillCard({ skill, status, retryTime, testingTime }) {
  const getSkillIcon = (skillName) => {
    const name = skillName?.toLowerCase() || '';
    if (name.includes('python') || name.includes('code') || name.includes('backend'))
      return <FiTerminal />;
    if (name.includes('design') || name.includes('ux') || name.includes('ui'))
      return <FiPenTool />;
    if (name.includes('project') || name.includes('manage') || name.includes('agile'))
      return <FiGrid />;
    return <FiTerminal />;
  };

  // Mentor level from DB (Levelling_Data join)
  const mentorLevel = skill.Mentor_Level || null;
  const score = skill.Score ?? null;
  const totalSessions = skill.Total_Sessions ?? null;
  const avgRating = skill.Average_Rating ?? null;

  return (
    <div className={`skill-verify-card ${status}`}>
      {(status === 'locked' || status === 'retry') && (
        <div className="skill-card-lock">
          <FiLock size={14} />
        </div>
      )}

      <div className="skill-card-icon-area">
        <div className="skill-card-big-icon">{getSkillIcon(skill.Skill_Name)}</div>
      </div>

      <div className="skill-card-body">
        <div className="skill-card-name-desc">
          <h3 className="skill-card-name">{skill.Skill_Name}</h3>
          <p className="skill-card-desc">{skill.Description}</p>
        </div>

        {/* DB stats — only shown for verified skills that have levelling data */}
        {status === 'verified' && mentorLevel && (
          <div className="skill-stats-row">
            <span className={`skill-level-badge skill-level-badge--${mentorLevel.toLowerCase()}`}>
              {mentorLevel}
            </span>
            {score !== null && (
              <span className="skill-stat">
                <FiTrendingUp size={11} /> {score} pts
              </span>
            )}
            {totalSessions !== null && (
              <span className="skill-stat">{totalSessions} sessions</span>
            )}
            {avgRating !== null && avgRating > 0 && (
              <span className="skill-stat">★ {Number(avgRating).toFixed(1)}</span>
            )}
          </div>
        )}
      </div>

      <div className="skill-card-footer-wrap">
        <div className="skill-card-footer">
          {status === 'verified' && (
            <>
              <div className="skill-verified-badge">
                <FiCheckCircle size={13} />
                <span>VERIFIED</span>
              </div>
              <Link 
                to={`/verification/skill/${skill.Skill_Id || skill.id}/dashboard`}
                className="skill-card-info-btn" 
                aria-label="Manage skill dashboard"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FiInfo size={14} />
              </Link>
            </>
          )}

          {status === 'available' && (
            <>
              <p className="skill-duration">
                <FiClock size={12} /> 10 Min Quiz
              </p>
              <Link
                to={`/verification/skill/${skill.Skill_Id}/start`}
                className="start-verify-btn"
              >
                Start Assessment ▶
              </Link>
            </>
          )}

          {status === 'testing' && (
            <>
              <p className="skill-duration" style={{ color: '#10B981', fontWeight: 'bold' }}>
                <FiClock size={12} /> {testingTime} left
              </p>
              <Link
                to={`/verification/skill/${skill.Skill_Id}/start`}
                className="start-verify-btn"
                style={{ background: 'linear-gradient(106.18deg, #006C49 0%, #10B981 100%)', color: '#002113' }}
              >
                Resume Quiz ▶
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
      </div>
    </div>
  );
}