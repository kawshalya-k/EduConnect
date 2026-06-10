import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import './VerifySkill.css';

export default function VerifySkill() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const handleTakeQuiz = () => {
    // In production: redirect to real external quiz
    // For now: simulate result with random pass/fail
    const passed = Math.random() > 0.4;
    if (passed) {
      navigate('/verification/success');
    } else {
      navigate('/verification/failed');
    }
  };

  return (
    <PageLayout>
      <div className="verify-skill-page">
        <Breadcrumb
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Skills', path: '/verification' },
            { label: 'Add New Skill', path: '/verification/add' },
          ]}
        />

        <div className="verify-skill-center">
          <div className="verify-skill-card">
            {/* Big Check Icon */}
            <div className="verify-check-icon">
              <FiCheckCircle size={60} />
            </div>

            <h1 className="verify-skill-title">Verify Skill</h1>
            <p className="verify-skill-desc">
              Take the quiz and join as a verified mentor!
            </p>

            <button className="take-quiz-btn" onClick={handleTakeQuiz}>
              Take the Quiz
              <FiArrowRight size={16} />
            </button>

            {/* Community Footer */}
            <div className="verify-community-row">
              <div className="community-avatars">
                {/* Placeholder avatar stack */}
                <div className="community-avatar c1" />
                <div className="community-avatar c2" />
                <span className="community-plus">+12k</span>
              </div>
              <span className="community-label">Join 12,000+ verified mentors</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}