import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { FiCheckCircle, FiArrowRight, FiXCircle, FiUploadCloud, FiTrash2, FiClock, FiFileText, FiImage } from 'react-icons/fi';
import { getQuizForSkill } from '../../utils/quizData';
import { fetchMentorSkills } from '../../services/mentorApi';
import { useAuth } from '../../context/AuthContext';
import './VerifySkill.css';

export default function VerifySkill() {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Skill state
  const [skillName, setSkillName] = useState('');
  const [quizState, setQuizState] = useState('start'); // 'start', 'quiz', 'grading'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  // Countdown timer and proof upload states
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Attempt to load skill name if skillId is present
    const loadSkillInfo = async () => {
      const userId = user?.mentorId || user?.id;
      if (userId) {
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
            setSkillName(targetSkill.Skill_Name || targetSkill.name);
            setQuestions(getQuizForSkill(targetSkill.Skill_Name || targetSkill.name));
          } else {
            setSkillName('General Mentor Skill');
            setQuestions(getQuizForSkill('default'));
          }
        } catch (err) {
          console.error('Failed to load skills:', err);
          setQuestions(getQuizForSkill('default'));
        }
      } else {
        setQuestions(getQuizForSkill('default'));
      }
    };

    loadSkillInfo();
  }, [user, skillId]);

  // Check for active timer on mount or when skillId changes
  useEffect(() => {
    const storedStartTime = localStorage.getItem(`quiz_start_time_${skillId || 'default'}`);
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 3600) {
        // Expired already
        handleQuizTimeout();
      } else {
        setQuizStartTime(startTime);
        setTimerActive(true);
        setTimeLeft(Math.max(0, Math.floor(3600 - elapsed)));
      }
    } else {
      setQuizStartTime(null);
      setTimerActive(false);
      setTimeLeft(3600);
      setSelectedFile(null);
      setSubmitError('');
    }
  }, [skillId]);

  // Countdown timer ticking logic
  useEffect(() => {
    if (!timerActive || !quizStartTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - quizStartTime) / 1000;
      const remaining = Math.max(0, Math.floor(3600 - elapsed));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleQuizTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, quizStartTime, skillId]);

  const handleStartQuiz = () => {
    window.open('https://www.hackerrank.com/dashboard', '_blank');
    const startTimestamp = Date.now();
    localStorage.setItem(`quiz_start_time_${skillId || 'default'}`, startTimestamp.toString());
    setQuizStartTime(startTimestamp);
    setTimerActive(true);
    setTimeLeft(3600);
  };

  const handleQuizTimeout = async () => {
    localStorage.removeItem(`quiz_start_time_${skillId || 'default'}`);
    setTimerActive(false);
    setQuizStartTime(null);
    setSelectedFile(null);

    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const actualSkillId = skillId || '1';
    const queryStr = from ? `?from=${from}&skillId=${encodeURIComponent(actualSkillId)}` : `?skillId=${encodeURIComponent(actualSkillId)}`;

    try {
      const token = localStorage.getItem('token');
      await fetch('/api/mentors/skills/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skillId: actualSkillId, passed: false })
      });
    } catch (err) {
      console.error('Failed to notify backend of quiz timeout:', err);
    }

    navigate(`/verification/failed${queryStr}`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setSubmitError('Only PDF and image files (JPG, JPEG, PNG) are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size must be less than 5MB.');
      return;
    }
    setSelectedFile(file);
    setSubmitError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setSubmitError('');
  };

  const handleSubmitProof = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setSubmitError('Please select or upload a certificate file.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const actualSkillId = skillId || '1';
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const queryStr = from ? `?from=${from}&skillId=${encodeURIComponent(actualSkillId)}` : `?skillId=${encodeURIComponent(actualSkillId)}`;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('skillId', actualSkillId);
      formData.append('passed', 'true');
      formData.append('certificate', selectedFile);

      const response = await fetch('/api/mentors/skills/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || 'Failed to submit proof. Please try again.');
      } else {
        localStorage.removeItem(`quiz_start_time_${skillId || 'default'}`);
        setTimerActive(false);
        setQuizStartTime(null);
        navigate(`/verification/success${queryStr}`);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('An error occurred while uploading. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const currentQ = questions[currentQuestionIndex];
    let newScore = score;
    if (selectedOption === currentQ.answer) {
      newScore += 1;
    }
    setScore(newScore);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishQuiz(newScore);
    }
  };

  const finishQuiz = async (finalScore) => {
    setQuizState('grading');
    setLoading(true);
    setError('');

    const passingScore = Math.ceil(questions.length * 0.7);
    const passed = finalScore >= passingScore;

    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const actualSkillId = skillId || '1';
    const queryStr = from ? `?from=${from}&skillId=${encodeURIComponent(actualSkillId)}` : `?skillId=${encodeURIComponent(actualSkillId)}`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mentors/skills/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skillId: actualSkillId, passed })
      });

      const data = await response.json();

      if (response.status === 403) {
        alert(data.message || 'Cooldown active.');
        navigate(`/verification/failed${queryStr}`);
      } else if (!response.ok) {
        setError(data.message || 'Verification failed');
        setQuizState('start');
      } else {
        if (passed) {
          navigate(`/verification/success${queryStr}`);
        } else {
          navigate(`/verification/failed${queryStr}`);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification');
      setQuizState('start');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="verify-skill-page" style={{ flex: 1, minWidth: 0 }}>
          <Breadcrumb
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Skills', path: '/verification' },
            { label: 'Add New Skill' },
          ]}
        />

        {quizState === 'start' && (
          <div className="verify-start-layout">
            {/* Decorative gradients */}
            <div className="verify-decor-top" />
            <div className="verify-decor-bottom" />

            {/* Embossed Hero Card */}
            <div className="verify-hero-card">
              <div className="verify-hero-left">
                <h1 className="verify-hero-title">Verify Skill: {skillName || 'Loading...'}</h1>
                <p className="verify-hero-subtitle">
                  {timerActive
                    ? 'Quiz is active. Complete it on HackerRank and upload your proof below.'
                    : 'Take the quiz and join as a verified mentor!'}
                </p>
              </div>
              <div className="verify-hero-right">
                <button
                  className={`take-quiz-btn-gradient ${timerActive ? 'quiz-active-pulse' : ''}`}
                  onClick={handleStartQuiz}
                  disabled={loading}
                >
                  <span className="btn-text">
                    {loading ? 'Preparing...' : timerActive ? 'HackerRank Portal' : 'Take the Quiz'}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="take-quiz-arrow-icon">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Detailed Instructions Section */}
            <div className="verify-instructions-card">
              <div className="instructions-header">
                <div className="instructions-icon-container">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="instructions-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                </div>
                <div className="instructions-header-text">
                  <h3 className="instructions-title">Verification Process</h3>
                  <p className="instructions-subtitle">Follow these steps to complete your skill endorsement.</p>
                </div>
              </div>

              <div className="instructions-steps-row">
                <div className="step-card">
                  <div className="step-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="step-icon">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <h4 className="step-title">Access Portal</h4>
                  <p className="step-text">Go to the opened HackerRank page, start an account and start your assessment.</p>
                  <span className="step-number">01</span>
                </div>

                <div className="step-card">
                  <div className="step-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="step-icon">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h4 className="step-title">Complete Quiz</h4>
                  <p className="step-text">Solve the technical challenges within the allotted time frame.</p>
                  <span className="step-number">02</span>
                </div>

                <div className="step-card">
                  <div className="step-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="step-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h4 className="step-title">Upload Result</h4>
                  <p className="step-text">
                    Upload the passed certificate to the next verification screen.{' '}
                    <a
                      href="#upload-section"
                      onClick={(e) => {
                        e.preventDefault();
                        if (timerActive) {
                          document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          alert("Please click 'Take the Quiz' first to start the 1-hour verification session and activate the upload section.");
                        }
                      }}
                      style={{ color: '#006C49', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      (Upload here)
                    </a>
                  </p>
                  <span className="step-number">03</span>
                </div>

                <div className="step-card">
                  <div className="step-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="step-icon">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h4 className="step-title">Final Review</h4>
                  <p className="step-text">Wait for a confirmation notification from our academic team.</p>
                  <span className="step-number">04</span>
                </div>
              </div>

              <div className="instructions-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="note-info-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="note-text">
                  <em>Additional Note: "If the quiz is not directly opened, go to the HackerRank page, find the relevant skill, complete the quiz, and upload the certificate."</em>
                </p>
              </div>
            </div>

            {/* Upload Proof Section (Visible when timer is active) */}
            {timerActive && (
              <div id="upload-section" className="verify-upload-card">
                <div className="upload-header">
                  <div className="upload-header-left">
                    <div className="upload-icon-container">
                      <FiUploadCloud className="upload-header-icon" />
                    </div>
                    <div className="upload-header-text">
                      <h3 className="upload-title">Upload Proof of Success</h3>
                      <p className="upload-subtitle">Submit your certificate or screenshot of verification success.</p>
                    </div>
                  </div>
                  <div className={`upload-timer-badge ${timeLeft < 600 ? 'timer-low-alert' : ''}`}>
                    <FiClock className="timer-icon" />
                    <span>Time Left: {formatTimeLeft(timeLeft)}</span>
                  </div>
                </div>

                <div className="upload-body">
                  <div
                    className={`file-dropzone ${isDragOver ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="proof-file-input"
                      className="file-hidden-input"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {!selectedFile ? (
                      <label htmlFor="proof-file-input" className="dropzone-label">
                        <div className="dropzone-illustrations">
                          <FiFileText className="illust-file" />
                          <FiImage className="illust-img" />
                        </div>
                        <p className="dropzone-main-text">
                          <strong>Click to upload</strong> or drag and drop
                        </p>
                        <p className="dropzone-sub-text">
                          PDF, JPG, JPEG, or PNG up to 5MB
                        </p>
                      </label>
                    ) : (
                      <div className="selected-file-details">
                        <div className="file-icon-wrap">
                          {selectedFile.type.includes('image') ? <FiImage size={24} /> : <FiFileText size={24} />}
                        </div>
                        <div className="file-info-text">
                          <span className="file-name">{selectedFile.name}</span>
                          <span className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <button className="remove-file-btn" onClick={removeSelectedFile} type="button">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {submitError && (
                    <div className="upload-error-message">
                      <FiXCircle className="error-icon" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="upload-actions">
                    <button
                      className="submit-proof-btn"
                      onClick={handleSubmitProof}
                      disabled={submitting || !selectedFile}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner"></span>
                          <span>Uploading Proof...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Verification Proof</span>
                          <FiArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Widgets Row */}
            <div className="verify-widgets-row">
              <div className="widget-assistance">
                <div className="widget-content">
                  <h4 className="widget-title">Need assistance?</h4>
                  <p className="widget-text">Our technical support is available 24/7 for mentor onboarding.</p>
                  <a href="/support" className="widget-link">
                    <span>Contact Support</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="link-arrow-icon">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
                <div className="assistance-question-mark">?</div>
              </div>

              <div className="widget-reach">
                <div className="reach-content">
                  <h4 className="reach-title">Community Reach</h4>
                  <p className="reach-text">Verified mentors get 2.4x more session requests.</p>
                </div>
                <div className="reach-number">+15,000</div>
                <div className="reach-overlay-blur" />
              </div>
            </div>
          </div>
        )}

        {(quizState === 'quiz' || quizState === 'grading') && (
          <div className="verify-skill-center">
            <div className="verify-skill-card-focused">
              {quizState === 'quiz' && questions.length > 0 && (
                <div className="quiz-container" style={{ width: '100%', textAlign: 'left' }}>
                  <div className="quiz-progress" style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <h2 className="quiz-question-text" style={{ fontSize: '18px', color: '#0f172a', marginBottom: '24px', lineHeight: '1.5' }}>
                    {questions[currentQuestionIndex].question}
                  </h2>

                  <div className="quiz-options">
                    {questions[currentQuestionIndex].options.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedOption(idx)}
                        style={{
                          padding: '16px',
                          border: selectedOption === idx ? '2px solid #10B981' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          cursor: 'pointer',
                          backgroundColor: selectedOption === idx ? '#F0FDF4' : '#ffffff',
                          transition: 'all 0.2s',
                          color: '#334155'
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <button
                    className="take-quiz-btn"
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    style={{ width: '100%', marginTop: '20px', opacity: selectedOption === null ? 0.5 : 1 }}
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish & Grade' : 'Next Question'}
                  </button>
                </div>
              )}

              {quizState === 'grading' && (
                <div className="verify-grading-container">
                  <div className="verify-check-container verify-grading-pulse">
                    <div className="verify-check-blur" />
                    <div className="verify-check-background">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="verify-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="verify-check-shadow" />
                  </div>
                  <h1 className="verify-skill-title">Grading Quiz...</h1>
                  <p className="verify-skill-desc">Please wait while we evaluate your answers.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </PageLayout>
  );
}