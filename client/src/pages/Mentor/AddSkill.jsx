import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiCode } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { addSkill } from '../../services/mentorApi';
import API from '../../services/axiosConfig';
import './AddSkill.css';

const CONFIDENCE_LEVELS = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export default function AddSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Python', 'UI Design']);
  const [activeSkill, setActiveSkill] = useState('React');
  const [confidence, setConfidence] = useState({ React: 0, Python: 0, 'UI Design': 0 });
  const [suggested, setSuggested] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load all skills from backend to map names to IDs
    const loadAllSkills = async () => {
      try {
        const res = await API.get('/mentors/skills/all');
        setAllSkills(res.data || []);
      } catch (err) {
        console.error('Failed to load all skills:', err);
      }
    };

    // Load suggested skills from backend
    const loadSuggested = async () => {
      try {
        const res = await API.get('/skills/suggested');
        setSuggested(res.data?.skills || []);
      } catch {
        // fallback matching mockup screenshot
        setSuggested(['TypeScript', 'Node.js', 'Figma', 'SQL']);
      }
    };

    loadAllSkills();
    loadSuggested();
  }, []);

  const addToSelected = (skillName) => {
    if (!selectedSkills.includes(skillName)) {
      const updated = [...selectedSkills, skillName];
      setSelectedSkills(updated);
      // Default confidence to BEGINNER (index 0)
      setConfidence((prev) => ({ ...prev, [skillName]: 0 }));
      if (selectedSkills.length === 0 || !activeSkill) {
        setActiveSkill(skillName);
      }
    }
    setSearch('');
  };

  const removeSkill = (skillName) => {
    const updated = selectedSkills.filter((s) => s !== skillName);
    setSelectedSkills(updated);
    setConfidence((prev) => {
      const copy = { ...prev };
      delete copy[skillName];
      return copy;
    });
    if (activeSkill === skillName) {
      setActiveSkill(updated[0] || null);
    }
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
    if (selectedSkills.length === 0) return;
    setSaving(true);
    try {
      for (const skillName of selectedSkills) {
        const match = allSkills.find(
          (s) => s.Skill_Name.toLowerCase() === skillName.toLowerCase()
        );
        await addSkill(user?.mentorId || user?.id, {
          skill_id: match ? match.Skill_Id : null,
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
    if (selectedSkills.length === 0) return;
    setSaving(true);
    let targetSkillId = null;
    try {
      for (const skillName of selectedSkills) {
        const match = allSkills.find(
          (s) => s.Skill_Name.toLowerCase() === skillName.toLowerCase()
        );
        try {
          const res = await addSkill(user?.mentorId || user?.id, {
            skill_id: match ? match.Skill_Id : null,
            name: skillName,
            confidence: CONFIDENCE_LEVELS[confidence[skillName] || 0],
            status: 'pending',
          });

          if (!targetSkillId && res.data?.skill_id) {
            targetSkillId = res.data.skill_id;
          }
        } catch (singleErr) {
          console.warn(`Error adding skill ${skillName}:`, singleErr);
          if (!targetSkillId && match) {
            targetSkillId = match.Skill_Id;
          }
        }
      }
    } catch (err) {
      console.error('Continue error:', err);
    } finally {
      setSaving(false);
      // Navigate to the verification page regardless of success/failure of individual additions
      if (targetSkillId) {
        navigate(`/verification/skill/${targetSkillId}/start`);
      } else {
        const match = allSkills.find(
          (s) => s.Skill_Name.toLowerCase() === selectedSkills[0].toLowerCase()
        );
        if (match) {
          navigate(`/verification/skill/${match.Skill_Id}/start`);
        } else {
          navigate('/verification/verify');
        }
      }
    }
  };

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="add-skill-page" style={{ flex: 1, minWidth: 0 }}>
          <div className="add-skill-header-container">
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/mentor-dashboard' },
              { label: 'Skills', path: '/verification' },
              { label: 'Add New Skill' },
            ]}
          />
          <h1 className="add-skill-title">Add New Skill</h1>
          <p className="add-skill-sub">Add a new skill and verify.</p>
        </div>

        {/* Search & Selection Box */}
        <div className="add-skill-box">
          <p className="add-skill-box-label">Search or select your skills</p>

          <div className="skill-search-input-wrap">
            <FiSearch size={18} className="skill-search-icon" />
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
                <span
                  key={skill}
                  className={`selected-skill-tag ${skill === activeSkill ? 'active' : 'inactive'}`}
                  onClick={() => setActiveSkill(skill)}
                >
                  <span className="tag-text">{skill}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSkill(skill);
                    }}
                    className="tag-remove-btn"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              <button className="add-more-tag">
                + Add More
              </button>
            </div>
          )}

          {/* Divider line before Suggested for you */}
          <div className="suggested-divider" />

          {/* Suggested */}
          <div className="suggested-section">
            <p className="suggested-label">Suggested for you</p>
            <div className="suggested-tags">
              {suggested.map((skill) => (
                <button
                  key={skill}
                  className="suggested-tag"
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
                  <FiCode size={20} />
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
                    className={`confidence-level-label ${i === (confidence[activeSkill] ?? 0) ? 'active' : ''
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
      </div>
    </PageLayout>
  );
}