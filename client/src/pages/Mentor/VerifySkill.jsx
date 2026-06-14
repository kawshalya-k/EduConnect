import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import { FiCheckCircle, FiArrowRight, FiXCircle } from 'react-icons/fi';
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
  
  // Quiz states
  const [skillName, setSkillName] = useState('');
  const [quizState, setQuizState] = useState('start'); // 'start', 'quiz', 'grading'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Attempt to load skill name if skillId is present
    const loadSkillInfo = async () => {
      if (user?.mentorId) {
        try {
          const res = await fetchMentorSkills(user.mentorId);
          const skills = res.data?.skills || [];
          let targetSkill = null;

          if (skillId) {
            targetSkill = skills.find(s => s.id.toString() === skillId);
          } else {
            targetSkill = skills.find(s => !s.verified);
          }

          if (targetSkill) {
            setSkillName(targetSkill.name);
            setQuestions(getQuizForSkill(targetSkill.name));
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

  const handleStartQuiz = () => {
    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
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
    
    // 70% passing threshold
    const passingScore = Math.ceil(questions.length * 0.7);
    const passed = finalScore >= passingScore;
    
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const actualSkillId = skillId || '1'; // fallback if undefined
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
      <div className="verify-skill-page">
        <Breadcrumb
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Skills', path: '/verification' },
            { label: 'Verify Skill' },
          ]}
        />

        <div className="verify-skill-center">
          <div className="verify-skill-card">
            
            {quizState === 'start' && (
              <>
                <div className="verify-check-icon">
                  <FiCheckCircle size={60} />
                </div>
                <h1 className="verify-skill-title">Verify {skillName || 'Skill'}</h1>
                <p className="verify-skill-desc">
                  Take the quiz to validate your expertise. You must score at least 70% to pass and earn your badge!
                </p>
                <div className="quiz-meta-info" style={{marginBottom: '20px', color: '#64748b'}}>
                  <p>{questions.length} Multiple Choice Questions</p>
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                <button className="take-quiz-btn" onClick={handleStartQuiz} disabled={loading || questions.length === 0}>
                  {loading ? 'Preparing...' : 'Start Quiz'}
                  <FiArrowRight size={16} />
                </button>
              </>
            )}

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
                        border: selectedOption === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        backgroundColor: selectedOption === idx ? '#eff6ff' : '#ffffff',
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
              <>
                <div className="verify-check-icon" style={{ animation: 'pulse 1.5s infinite' }}>
                  <FiCheckCircle size={60} color="#94a3b8" />
                </div>
                <h1 className="verify-skill-title">Grading Quiz...</h1>
                <p className="verify-skill-desc">Please wait while we evaluate your answers.</p>
              </>
            )}

            {/* Community Footer */}
            {quizState === 'start' && (
              <div className="verify-community-row" style={{ marginTop: '40px' }}>
                <div className="community-avatars">
                  <div className="community-avatar c1" />
                  <div className="community-avatar c2" />
                  <span className="community-plus">+12k</span>
                </div>
                <span className="community-label">Join 12,000+ verified mentors</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}