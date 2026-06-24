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

export default function VerifySkill() {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [skillName, setSkillName] = useState('');
  const [quizState, setQuizState] = useState('start'); // 'start', 'quiz', 'submitting', 'cooldown'
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

  // Quiz questions and selection state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'dashboard';

  const getQuizKey = (name) => {
    if (!name) return 'JavaScript';
    const norm = name.toLowerCase();
    if (norm.includes('javascript') || norm.includes('js')) return 'JavaScript';
    if (norm.includes('python')) return 'Python';
    if (norm.includes('sql') || norm.includes('database')) return 'SQL';
    if (norm.includes('git')) return 'Git';
    if (norm.includes('figma')) return 'Figma';
    if (norm.includes('information architecture') || norm.includes('ia')) return 'Information Architecture';
    if (norm.includes('statistics') || norm.includes('stat')) return 'Statistics';
    if (norm.includes('nlp') || norm.includes('natural language')) return 'NLP';
    if (norm.includes('android')) return 'Android Development';
    if (norm.includes('flutter')) return 'Flutter';
    return 'JavaScript'; // fallback
  };

  useEffect(() => {
    const loadSkillInfo = async () => {
      const userId = user?.mentorId || user?.id;
      if (userId) {
        setLoading(true);
        try {
          const res = await fetchMentorSkills(userId);
          const skills = Array.isArray(res.data) ? res.data : (res.data?.skills || []);
          let targetSkill = null;

          if (skillId) {
            targetSkill = skills.find(s => (s.Skill_Id || s.id || '').toString() === skillId.toString());
          } else {
            targetSkill = skills.find(s => !(s.Verification_Status === 1 || s.Verification_Status === true || s.Verification_Status === 'Verified' || s.verified));
          }

          if (targetSkill) {
            const name = targetSkill.Skill_Name || targetSkill.name;
            setSkillName(name);
            
            // Check for cooldown / active resume
            if (targetSkill.Verification_Status === 'Testing') {
              try {
                const startRes = await API.post('/mentors/skills/start-quiz', { skillId: targetSkill.Skill_Id });
                const startData = startRes.data;
                if (startData.quizTimeLeft) {
                  setQuestions(quizQuestions[getQuizKey(name)] || quizQuestions['JavaScript']);
                  setQuizTimeLeft(startData.quizTimeLeft);
                  setQuizState('quiz');
                } else {
                  setQuizState('start');
                }
              } catch (startErr) {
                const startData = startErr.response?.data || {};
                if (startData.timeoutExpired || startData.cooldownActive) {
                  setQuizState('cooldown');
                  setCooldownTimeLeft(startData.cooldownTimeLeft || 4 * 60 * 60 * 1000);
                } else {
                  console.error('Failed to resume quiz:', startErr);
                  setQuizState('start');
                }
              }
            } else if (targetSkill.Last_Attempt) {
              const lastAttempt = new Date(targetSkill.Last_Attempt);
              const now = new Date();
              const diffMs = now - lastAttempt;
              const cooldownMs = 4 * 60 * 60 * 1000; // 4 hours
              if (diffMs < cooldownMs) {
                setQuizState('cooldown');
                setCooldownTimeLeft(cooldownMs - diffMs);
              } else {
                setQuizState('start');
              }
            } else {
              setQuizState('start');
            }

            // Get questions for this skill
            const key = getQuizKey(name);
            setQuestions(quizQuestions[key] || quizQuestions['JavaScript']);
          } else {
            setSkillName('General Mentor Skill');
            setQuestions(quizQuestions['JavaScript']);
            setQuizState('start');
          }
        } catch (err) {
          console.error('Failed to load skills:', err);
          setSkillName('General Mentor Skill');
          setQuestions(quizQuestions['JavaScript']);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSkillInfo();
  }, [user, skillId]);

  // Cooldown timer tick
  useEffect(() => {
    if (quizState !== 'cooldown' || cooldownTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          setQuizState('start');
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, cooldownTimeLeft]);

  // Quiz timer tick
  useEffect(() => {
    if (quizState !== 'quiz') return;
    const timer = setInterval(() => {
      setQuizTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuizAnswers(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState]);

  const handleStartQuiz = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const targetSkillId = skillId || '1'; // fallback
      const response = await API.post('/mentors/skills/start-quiz', {
        skillId: targetSkillId
      });

      const data = response.data;
      setQuizState('quiz');
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizTimeLeft(data.quizTimeLeft || 600);
    } catch (err) {
      console.error(err);
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
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuizAnswers = async (isTimeOut = false) => {
    setIsSubmitting(true);
    setSubmitError('');
    setQuizState('submitting');

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    const passed = correctCount >= 6; // 40% of 15 is 6

    let level = 'Failed';
    if (correctCount >= 12) level = 'Expert';
    else if (correctCount >= 9) level = 'Intermediate';
    else if (correctCount >= 6) level = 'Beginner';

    const actualSkillId = skillId || '1';
    const queryStr = `?from=${from}&skillId=${encodeURIComponent(actualSkillId)}&score=${correctCount}&level=${level}`;

    try {
      const response = await API.post('/mentors/skills/verify', {
        skillId: actualSkillId,
        passed,
        score: correctCount,
        level
      });

      if (passed) {
        navigate(`/verification/success${queryStr}`);
      } else {
        navigate(`/verification/failed${queryStr}`);
      }
    } catch (err) {
      console.error(err);
      const data = err.response?.data || {};
      setSubmitError(data.message || 'An error occurred while submitting. Please try again.');
      setQuizState('quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCooldownTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

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

          {quizState === 'cooldown' && (
            <div className="verify-skill-center" style={{ marginTop: '60px' }}>
              <div className="verify-skill-card-focused text-center">
                <div className="verify-check-container" style={{ margin: '0 auto 24px' }}>
                  <div className="verify-check-blur" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
                  <div className="verify-check-background" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' }}>
                    <FiClock className="verify-check-svg" style={{ width: '48px', height: '48px' }} />
                  </div>
                </div>
                <h2 className="verify-skill-title">Redo Cooldown Active</h2>
                <p className="verify-skill-desc" style={{ maxWidth: '400px', margin: '16px auto' }}>
                  You have recently attempted this assessment. To upgrade your level or try again, please wait for the 4-hour cooldown period to complete.
                </p>
                <div className="failed-countdown-box" style={{ width: '100%', margin: '24px 0', padding: '16px' }}>
                  <p className="countdown-label" style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748B', letterSpacing: '1px' }}>TIME REMAINING</p>
                  <p className="countdown-timer" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', margin: '8px 0 0 0' }}>
                    {formatCooldownTime(cooldownTimeLeft)}
                  </p>
                </div>
                <button
                  className="take-quiz-btn"
                  style={{ backgroundColor: '#64748B', cursor: 'not-allowed' }}
                  disabled
                >
                  Assessment Locked
                </button>
              </div>
            </div>
          )}

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
                  <button
                    className="take-quiz-btn-gradient"
                    onClick={handleStartQuiz}
                  >
                    <span className="btn-text">Start Assessment</span>
                    <FiArrowRight size={18} style={{ color: '#002113' }} />
                  </button>
                </div>
              </div>

              {/* Detailed Instructions Section */}
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
                    <p className="step-text">Multiple-choice questions covering core concepts and scenarios.</p>
                    <span className="step-number">01</span>
                  </div>

                  <div className="step-card">
                    <h4 className="step-title">10 Minutes</h4>
                    <p className="step-text">Strict 10-minute time limit. The quiz will auto-submit when the timer hits 0.</p>
                    <span className="step-number">02</span>
                  </div>

                  <div className="step-card">
                    <h4 className="step-title">Scoring Levels</h4>
                    <p className="step-text">
                      Beginner: 6-8 correct<br />
                      Intermediate: 9-11 correct<br />
                      Expert: 12-15 correct
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

          {quizState === 'quiz' && (
            <div className="verify-skill-center" style={{ marginTop: '20px' }}>
              <div className="quiz-wizard-card">
                {/* Quiz Header */}
                <div className="quiz-header">
                  <div>
                    <h2 className="quiz-skill-title">{skillName} Assessment</h2>
                    <p className="quiz-question-counter">Question {currentQuestionIndex + 1} of {questions.length}</p>
                  </div>
                  <div className={`quiz-timer-badge ${quizTimeLeft <= 120 ? 'timer-low-alert' : ''}`}>
                    <FiClock className="timer-icon" />
                    <span>{formatTime(quizTimeLeft)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="quiz-progress-bar-container">
                  <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                {/* Question Area */}
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
                  <p>Loading question...</p>
                )}

                {submitError && (
                  <div className="quiz-error-message">
                    <FiAlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Footer Navigation */}
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
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {quizState === 'submitting' && (
            <div className="verify-skill-center" style={{ marginTop: '60px' }}>
              <div className="verify-skill-card-focused text-center">
                <div className="verify-grading-pulse">
                  <div className="verify-check-container" style={{ margin: '0 auto 24px' }}>
                    <div className="verify-check-blur" />
                    <div className="verify-check-background">
                      <FiCheckSquare className="verify-check-svg" style={{ width: '48px', height: '48px' }} />
                    </div>
                  </div>
                </div>
                <h2 className="verify-skill-title">Grading Your Answers...</h2>
                <p className="verify-skill-desc" style={{ maxWidth: '300px', margin: '16px auto' }}>
                  Please wait while our engine scores your assessment and updates your credentials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}