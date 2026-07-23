import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { FiClock, FiArrowLeft, FiArrowRight, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import { fetchMentorSkills } from '../../services/mentorApi';
import API from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { quizQuestions } from '../../data/quizData';
import './VerifySkill.css';

// ─── Skill name → quiz key mapping ───────────────────────────────────────────
// Add any new skills here so their name maps to a quizQuestions key.
const QUIZ_KEY_MAP = [
  { pattern: /javascript|js\b/i, key: 'JavaScript' },
  { pattern: /python/i, key: 'Python' },
  { pattern: /\bsql\b|database/i, key: 'SQL' },
  { pattern: /\bgit\b/i, key: 'Git' },
  { pattern: /figma|ui\/ux|design|strategy/i, key: 'Figma' },
  { pattern: /information architecture|^ia$/i, key: 'Information Architecture' },
  { pattern: /statistic|data science/i, key: 'Statistics' },
  { pattern: /\bnlp\b|natural language/i, key: 'NLP' },
  { pattern: /android/i, key: 'Android Development' },
  { pattern: /flutter/i, key: 'Flutter' },
  { pattern: /web development/i, key: 'JavaScript' },
];

function getQuizKey(skillName) {
  if (!skillName) return null;
  for (const { pattern, key } of QUIZ_KEY_MAP) {
    if (pattern.test(skillName)) return key;
  }
  // Fallback: try an exact match (case-insensitive) against available keys
  const lower = skillName.toLowerCase();
  const directMatch = Object.keys(quizQuestions).find(k => k.toLowerCase() === lower);
  return directMatch || null;
}

// ─── Score → level helper (15 questions) ─────────────────────────────────────
// Expert      : 12-15 correct  (80-100%)
// Intermediate: 9-11  correct  (60-73%)
// Beginner    : 6-8   correct  (40-53%)
// Failed      : 0-5   correct  (<40%)
function scoreToLevel(correct) {
  if (correct >= 12) return 'Expert';
  if (correct >= 9) return 'Intermediate';
  if (correct >= 6) return 'Beginner';
  return 'Failed';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function VerifySkill() {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [skillName, setSkillName] = useState('');
  const [quizState, setQuizState] = useState('start'); // 'start' | 'quiz' | 'submitting' | 'cooldown'
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'dashboard';

  // ── Load skill info ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadSkillInfo = async () => {
      const userId = user?.mentorId || user?.id;
      if (!userId) return;
      setLoading(true);

      try {
        const res = await fetchMentorSkills(userId);
        const skills = Array.isArray(res.data) ? res.data : (res.data?.skills || []);

        let targetSkill = null;
        if (skillId) {
          targetSkill = skills.find(
            s => (s.Skill_Id || s.id || '').toString() === skillId.toString()
          );
          
          if (!targetSkill) {
            // Fetch name from all skills list if not yet present in user's mentor skills list
            try {
              const allRes = await API.get('/mentors/skills/all');
              const allSkills = allRes.data || [];
              const matchedSkill = allSkills.find(
                s => (s.Skill_Id || s.id || '').toString() === skillId.toString()
              );
              if (matchedSkill) {
                targetSkill = {
                  Skill_Id: matchedSkill.Skill_Id,
                  Skill_Name: matchedSkill.Skill_Name,
                  Verification_Status: 'Draft'
                };
              }
            } catch (err) {
              console.error('Failed to fetch skill name fallback:', err);
            }
          }
        } else {
          // Fallback: first unverified skill (only if skillId not specified in URL)
          targetSkill = skills.find(
            s => !(s.Verification_Status === 1 || s.Verification_Status === true || s.Verification_Status === 'Verified')
          );
        }

        if (targetSkill) {
          const name = targetSkill.Skill_Name || targetSkill.name || '';
          setSkillName(name);
          loadQuestionsForSkill(name);

          // Handle cooldown / mid-quiz resume
          if (targetSkill.Verification_Status === 'Testing') {
            await attemptResume(targetSkill.Skill_Id, name);
          } else if (targetSkill.Last_Attempt) {
            const diffMs = Date.now() - new Date(targetSkill.Last_Attempt).getTime();
            if (diffMs < 4 * 60 * 60 * 1000) {
              setQuizState('cooldown');
              setCooldownTimeLeft(4 * 60 * 60 * 1000 - diffMs);
            } else {
              setQuizState('start');
            }
          } else {
            setQuizState('start');
          }
        } else {
          // No skill found — show start screen with fallback questions
          setSkillName('General Mentor Skill');
          loadQuestionsForSkill('JavaScript');
          setQuizState('start');
        }
      } catch (err) {
        console.error('Failed to load skill info:', err);
        setSkillName('General Mentor Skill');
        loadQuestionsForSkill('JavaScript');
        setQuizState('start');
      } finally {
        setLoading(false);
      }
    };

    loadSkillInfo();
  }, [user, skillId]);

  function loadQuestionsForSkill(name) {
    const key = getQuizKey(name);
    const qs = key ? quizQuestions[key] : null;
    if (!qs || qs.length === 0) {
      console.warn(`No questions found for skill "${name}"`);
      setQuestions([]);
    } else {
      setQuestions(qs);
    }
  }

  async function attemptResume(id, name) {
    try {
      const startRes = await API.post('/mentors/skills/start-quiz', { skillId: id });
      const data = startRes.data;
      // Backend may return updated skillName — prefer it
      if (data.skillName) setSkillName(data.skillName);
      loadQuestionsForSkill(data.skillName || name);
      if (data.quizTimeLeft) {
        setQuizTimeLeft(data.quizTimeLeft);
        setQuizState('quiz');
      } else {
        setQuizState('start');
      }
    } catch (err) {
      const data = err.response?.data || {};
      if (data.timeoutExpired || data.cooldownActive) {
        setQuizState('cooldown');
        setCooldownTimeLeft(data.cooldownTimeLeft || 4 * 60 * 60 * 1000);
      } else {
        setQuizState('start');
      }
    }
  }

  // ── Cooldown ticker ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (quizState !== 'cooldown' || cooldownTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownTimeLeft(prev => {
        if (prev <= 1000) { clearInterval(timer); setQuizState('start'); return 0; }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, cooldownTimeLeft]);

  // ── Quiz countdown ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (quizState !== 'quiz') return;
    const timer = setInterval(() => {
      setQuizTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); submitQuizAnswers(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState]); // eslint-disable-line

  // ── Start quiz ────────────────────────────────────────────────────────────────
  const handleStartQuiz = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const targetSkillId = skillId || '1';
      const response = await API.post('/mentors/skills/start-quiz', { skillId: targetSkillId });
      const data = response.data;

      // Use skill name returned from backend to load the correct question set
      const resolvedSkillName = data.skillName || skillName;
      setSkillName(resolvedSkillName);
      loadQuestionsForSkill(resolvedSkillName);

      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizTimeLeft(data.quizTimeLeft || 600);
      setQuizState('quiz');
    } catch (err) {
      const data = err.response?.data || {};
      setSubmitError(data.message || 'Failed to start assessment.');
      if (data.cooldownActive || data.timeoutExpired) {
        setQuizState('cooldown');
        setCooldownTimeLeft(data.cooldownTimeLeft || 4 * 60 * 60 * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(i => i + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(i => i - 1);
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const submitQuizAnswers = async (isTimeOut = false) => {
    setIsSubmitting(true);
    setSubmitError('');
    setQuizState('submitting');

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) correctCount++;
    });

    const level = scoreToLevel(correctCount);
    const passed = level !== 'Failed';
    const actualSkillId = skillId || '1';
    const queryStr = `?from=${from}&skillId=${encodeURIComponent(actualSkillId)}&score=${correctCount}&total=${questions.length}&level=${level}`;

    try {
      await API.post('/mentors/skills/verify', {
        skillId: actualSkillId,
        passed,
        score: correctCount,
        level,
      });

      navigate(passed ? `/verification/success${queryStr}` : `/verification/failed${queryStr}`);
    } catch (err) {
      const data = err.response?.data || {};
      setSubmitError(data.message || 'An error occurred while submitting. Please try again.');
      setQuizState('quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Formatting ────────────────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatCooldownTime = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageLayout>
        <div className="dash-layout">
          <DashboardSidebar user={user} />
          <div className="verify-skill-page" style={{ flex: 1, minWidth: 0 }}>
            <div className="verify-skill-center">
              <div className="verify-skill-card-focused">
                <p>Loading assessment details...</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="verify-skill-page" style={{ flex: 1, minWidth: 0 }}>
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/mentor-dashboard' },
              { label: 'Skills', path: '/verification' },
              { label: 'Verify Skill' },
            ]}
          />

          {/* ── Cooldown ── */}
          {quizState === 'cooldown' && (
            <div className="verify-skill-center" style={{ marginTop: '60px' }}>
              <div className="verify-skill-card-focused text-center">
                <div className="verify-check-container" style={{ margin: '0 auto 24px' }}>
                  <div className="verify-check-blur" style={{ backgroundColor: 'rgba(239,68,68,0.2)' }} />
                  <div className="verify-check-background" style={{ background: 'linear-gradient(135deg,#EF4444 0%,#B91C1C 100%)' }}>
                    <FiClock className="verify-check-svg" style={{ width: 48, height: 48 }} />
                  </div>
                </div>
                <h2 className="verify-skill-title">Cooldown Active</h2>
                <p className="verify-skill-desc" style={{ maxWidth: 400, margin: '16px auto' }}>
                  You have recently attempted this assessment. Please wait for the 4-hour cooldown period before trying again.
                </p>
                <div className="failed-countdown-box" style={{ width: '100%', margin: '24px 0', padding: 16 }}>
                  <p className="countdown-label" style={{ fontSize: 11, fontWeight: 'bold', color: '#64748B', letterSpacing: 1 }}>TIME REMAINING</p>
                  <p className="countdown-timer" style={{ fontSize: 28, fontWeight: 'bold', color: '#1E293B', margin: '8px 0 0' }}>
                    {formatCooldownTime(cooldownTimeLeft)}
                  </p>
                </div>
                <button className="take-quiz-btn" style={{ backgroundColor: '#64748B', cursor: 'not-allowed' }} disabled>
                  Assessment Locked
                </button>
              </div>
            </div>
          )}

          {/* ── Start screen ── */}
          {quizState === 'start' && (
            <div className="verify-start-layout">
              <div className="verify-decor-top" />
              <div className="verify-decor-bottom" />

              <div className="verify-hero-card">
                <div className="verify-hero-left">
                  <h1 className="verify-hero-title">Verify Skill: {skillName}</h1>
                  <p className="verify-hero-subtitle">
                    Take the 10-minute assessment to verify your skill level and join as a verified mentor!
                  </p>
                </div>
                <div className="verify-hero-right">
                  <button className="take-quiz-btn-gradient" onClick={handleStartQuiz}>
                    <span className="btn-text">Start Assessment</span>
                    <FiArrowRight size={18} style={{ color: '#002113' }} />
                  </button>
                </div>
              </div>

              {submitError && (
                <div className="quiz-error-message" style={{ margin: '16px 0' }}>
                  <FiAlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="verify-instructions-card">
                <div className="instructions-header">
                  <div className="instructions-icon-container">
                    <FiCheckSquare className="instructions-icon" />
                  </div>
                  <div className="instructions-header-text">
                    <h3 className="instructions-title">Assessment Rules & Guidelines</h3>
                    <p className="instructions-subtitle">Please read the following instructions before starting.</p>
                  </div>
                </div>

                <div className="instructions-steps-row">
                  <div className="step-card">
                    <h4 className="step-title">15 Questions</h4>
                    <p className="step-text">Multiple-choice questions covering core concepts and real-world scenarios for <strong>{skillName}</strong>.</p>
                    <span className="step-number">01</span>
                  </div>
                  <div className="step-card">
                    <h4 className="step-title">10 Minutes</h4>
                    <p className="step-text">Strict time limit. The quiz auto-submits when the timer reaches 0.</p>
                    <span className="step-number">02</span>
                  </div>
                  <div className="step-card">
                    <h4 className="step-title">Scoring Levels</h4>
                    <p className="step-text">
                      Beginner: 6–8 correct<br />
                      Intermediate: 9–11 correct<br />
                      Expert: 12–15 correct
                    </p>
                    <span className="step-number">03</span>
                  </div>
                  <div className="step-card">
                    <h4 className="step-title">Rewards & Cooldown</h4>
                    <p className="step-text">Earn up to 15 Skill Coins upon verification. 4-hour cooldown between attempts.</p>
                    <span className="step-number">04</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Quiz ── */}
          {quizState === 'quiz' && (
            <div className="verify-skill-center" style={{ marginTop: 20 }}>
              <div className="quiz-wizard-card">
                {/* Header */}
                <div className="quiz-header">
                  <div>
                    <h2 className="quiz-skill-title">{skillName} Assessment</h2>
                    <p className="quiz-question-counter">
                      Question {currentQuestionIndex + 1} of {questions.length}
                      <span style={{ marginLeft: 12, color: '#64748B', fontSize: 13 }}>
                        ({answeredCount} answered)
                      </span>
                    </p>
                  </div>
                  <div className={`quiz-timer-badge ${quizTimeLeft <= 120 ? 'timer-low-alert' : ''}`}>
                    <FiClock className="timer-icon" />
                    <span>{formatTime(quizTimeLeft)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="quiz-progress-bar-container">
                  <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                {/* Question */}
                {currentQuestion ? (
                  <div className="quiz-question-container">
                    <h3 className="quiz-question-text">{currentQuestion.question}</h3>
                    <div className="quiz-options-list">
                      {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                        return (
                          <div
                            key={idx}
                            className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectOption(idx)}
                          >
                            <div className="option-radio">
                              {isSelected && <div className="option-radio-dot" />}
                            </div>
                            <span className="option-text">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p style={{ padding: 24, textAlign: 'center', color: '#64748B' }}>
                    No questions available for this skill yet.
                  </p>
                )}

                {submitError && (
                  <div className="quiz-error-message">
                    <FiAlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Navigation */}
                <div className="quiz-footer-actions">
                  <button
                    className="quiz-prev-btn"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <FiArrowLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      className="quiz-next-btn"
                      onClick={handleNext}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    >
                      <span>Next</span>
                      <FiArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      className="quiz-submit-btn"
                      onClick={() => submitQuizAnswers(false)}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit Assessment'}
                    </button>
                  )}
                </div>

                {/* Question navigator dots */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16, justifyContent: 'center' }}>
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                        background: idx === currentQuestionIndex ? '#10B981'
                          : selectedAnswers[idx] !== undefined ? '#D1FAE5'
                            : '#F1F5F9',
                        color: idx === currentQuestionIndex ? '#fff'
                          : selectedAnswers[idx] !== undefined ? '#065F46'
                            : '#64748B',
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Submitting ── */}
          {quizState === 'submitting' && (
            <div className="verify-skill-center" style={{ marginTop: 60 }}>
              <div className="verify-skill-card-focused text-center">
                <div className="verify-grading-pulse">
                  <div className="verify-check-container" style={{ margin: '0 auto 24px' }}>
                    <div className="verify-check-blur" />
                    <div className="verify-check-background">
                      <FiCheckSquare className="verify-check-svg" style={{ width: 48, height: 48 }} />
                    </div>
                  </div>
                </div>
                <h2 className="verify-skill-title">Grading Your Answers…</h2>
                <p className="verify-skill-desc" style={{ maxWidth: 300, margin: '16px auto' }}>
                  Please wait while we score your assessment and update your credentials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}