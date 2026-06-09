import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { addSkill } from '../../services/mentorApi';
import API from '../../services/axiosConfig';
import './AddSkill.css';

const CONFIDENCE_LEVELS = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export default function AddSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [confidence, setConfidence] = useState({}); // skillName -> level index
  const [suggested, setSuggested] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load suggested skills from backend
    const loadSuggested = async () => {
      try {
        const res = await API.get('/skills/suggested');
        setSuggested(res.data?.skills || []);
      } catch {
        // fallback
        setSuggested(['TypeScript', 'Node.js', 'Figma', 'SQL']);
      }
    };
    loadSuggested();
  }, []);

  const addToSelected = (skillName) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills((prev) => [...prev, skillName]);
      // Default confidence to BEGINNER (index 0)
      setConfidence((prev) => ({ ...prev, [skillName]: 0 }));
    }
    setSearch('');
  };

  const removeSkill = (skillName) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillName));
    setConfidence((prev) => {
      const copy = { ...prev };
      delete copy[skillName];
      return copy;
    });
  };

  const handleConfidenceChange = (skillName, levelIndex) => {
    setConfidence((prev) => ({ ...prev, [skillName]: levelIndex }));
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      addToSelected(search.trim());
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      for (const skillName of selectedSkills) {
        await addSkill(user.mentorId, {
          name: skillName,
          confidence: CONFIDENCE_LEVELS[confidence[skillName] || 0],
          status: 'draft',
        });
      }
      navigate('/verification');
    } catch (err) {
      console.error('Save draft error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      for (const skillName of selectedSkills) {
        await addSkill(user.mentorId, {
          name: skillName,
          confidence: CONFIDENCE_LEVELS[confidence[skillName] || 0],
          status: 'pending',
        });
      }
      // Go to verify skill page for the first skill
      navigate('/verification/verify');
    } catch (err) {
      console.error('Continue error:', err);
    } finally {
      setSaving(false);
    }
  };

  // The skill shown in confidence slider (first selected)
  const activeSkill = selectedSkills[0] || null;

  return (
    <PageLayout>
      <div className="add-skill-page">
        <Breadcrumb
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Skills', path: '/verification' },
            { label: 'Add New Skill' },
          ]}
        />

        <h1 className="add-skill-title">Add New Skill</h1>
        <p className="add-skill-sub">Add a new skill and verify.</p>

        {/* Search & Selection Box */}
        <div className="add-skill-box">
          <p className="add-skill-box-label">Search or select your skills</p>

          <div className="skill-search-input-wrap">
            <FiSearch size={16} className="skill-search-icon" />
            <input
              type="text"
              className="skill-search-input"
              placeholder="e.g. JavaScript, Product Management, Spanish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>

          {/* Selected Tags */}
          {selectedSkills.length > 0 && (
            <div className="selected-skills-row">
              {selectedSkills.map((skill) => (
                <span key={skill} className="selected-skill-tag">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="tag-remove-btn">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              <button className="add-more-tag" onClick={() => {}}>
                + Add More
              </button>
            </div>
          )}

          {/* Suggested */}
          <div className="suggested-section">
            <p className="suggested-label">SUGGESTED FOR YOU</p>
            <div className="suggested-tags">
              {suggested.map((skill) => (
                <button
                  key={skill}
                  className={`suggested-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => addToSelected(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence Slider */}
        {activeSkill && (
          <div className="confidence-section">
            <h2 className="confidence-title">Rate your confidence</h2>

            <div className="confidence-card">
              <div className="confidence-skill-header">
                <div className="confidence-skill-icon">
                  <span>&lt;/&gt;</span>
                </div>
                <span className="confidence-skill-name">{activeSkill}</span>
              </div>

              <div className="confidence-slider-wrap">
                <input
                  type="range"
                  min={0}
                  max={CONFIDENCE_LEVELS.length - 1}
                  value={confidence[activeSkill] ?? 0}
                  onChange={(e) =>
                    handleConfidenceChange(activeSkill, Number(e.target.value))
                  }
                  className="confidence-slider"
                />
              </div>

              <div className="confidence-levels">
                {CONFIDENCE_LEVELS.map((level, i) => (
                  <span
                    key={level}
                    className={`confidence-level-label ${
                      i === (confidence[activeSkill] ?? 0) ? 'active' : ''
                    }`}
                    onClick={() => handleConfidenceChange(activeSkill, i)}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="add-skill-actions">
          <button className="back-link" onClick={() => navigate('/verification')}>
            Back
          </button>
          <div className="add-skill-right-actions">
            <button
              className="save-draft-btn"
              onClick={handleSaveDraft}
              disabled={saving || selectedSkills.length === 0}
            >
              Save Draft
            </button>
            <button
              className="continue-btn"
              onClick={handleContinue}
              disabled={saving || selectedSkills.length === 0}
            >
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}