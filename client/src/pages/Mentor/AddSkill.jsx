import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCode } from 'react-icons/fi';
import PageLayout from '../../components/Layout/PageLayout';
import Breadcrumb from '../../components/Layout/Breadcrumb';
import DashboardSidebar from '../../components/Mentorship/MentorSideBar';
import { useAuth } from '../../context/AuthContext';
import { addSkill } from '../../services/mentorApi';
import API from '../../services/axiosConfig';
import './AddSkill.css';

const CONFIDENCE_LEVELS = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const TARGET_SKILLS = [
  'JavaScript',
  'Python',
  'SQL',
  'Git',
  'Figma',
  'Information Architecture',
  'Statistics',
  'NLP',
  'Android Development',
  'Flutter'
];

const SUGGESTED_SKILLS = [
  'JavaScript',
  'Python',
  'SQL',
  'Git',
  'Figma',
  'Flutter'
];

export default function AddSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const [confidence, setConfidence] = useState({});
  const [allSkills, setAllSkills] = useState([]);
  const [skillIdMap, setSkillIdMap] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAllSkills = async () => {
      try {
        const res = await API.get('/mentors/skills/all');
        const skills = res.data || [];
        setAllSkills(skills);

        // Build the dynamic map from DB
        const map = {};
        skills.forEach(skill => {
          map[skill.Skill_Name.toLowerCase()] = skill.Skill_Id;
        });
        setSkillIdMap(map);
      } catch (err) {
        console.error('Failed to load all skills:', err);
      }
    };

    loadAllSkills();
  }, []);

  const resolveSkillId = (skillName) => {
    const match = allSkills.find(
      (s) => s.Skill_Name.toLowerCase() === skillName.toLowerCase()
    );
    return match ? match.Skill_Id : skillIdMap[skillName.toLowerCase()] || null;
  };

  const addToSelected = (skillName) => {
    if (!selectedSkills.includes(skillName)) {
      const updated = [...selectedSkills, skillName];
      setSelectedSkills(updated);
      setConfidence((prev) => ({ ...prev, [skillName]: 2 }));
      if (selectedSkills.length === 0 || !activeSkill) {
        setActiveSkill(skillName);
      }
    }
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

  const handleSaveDraft = async () => {
    if (selectedSkills.length === 0) return;
    setSaving(true);
    try {
      for (const skillName of selectedSkills) {
        const resolvedSkillId = resolveSkillId(skillName);
        await addSkill(user?.mentorId || user?.id, {
          skill_id: resolvedSkillId,
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
        const resolvedSkillId = resolveSkillId(skillName);
        try {
          const res = await addSkill(user?.mentorId || user?.id, {
            skill_id: resolvedSkillId,
            name: skillName,
            confidence: CONFIDENCE_LEVELS[confidence[skillName] || 0],
            status: 'pending',
          });

          if (!targetSkillId) {
            targetSkillId = res.data?.skill_id || resolvedSkillId;
          }
        } catch (singleErr) {
          console.warn(`Error adding skill ${skillName}:`, singleErr);
          if (!targetSkillId) {
            targetSkillId = resolvedSkillId;
          }
        }
      }
    } catch (err) {
      console.error('Continue error:', err);
    } finally {
      setSaving(false);
      if (targetSkillId) {
        navigate(`/verification/skill/${targetSkillId}/start`);
      } else {
        const firstSkill = selectedSkills[0];
        const fallbackId = resolveSkillId(firstSkill);
        if (fallbackId) {
          navigate(`/verification/skill/${fallbackId}/start`);
        } else {
          navigate('/verification');
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
            <p className="add-skill-sub">Select a skill to verify.</p>
          </div>

          {/* Selection Box */}
          <div className="add-skill-box">
            <p className="add-skill-box-label">Choose a skill from the list</p>

            <div className="skill-search-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                className="skill-select-dropdown"
                onChange={(e) => {
                  if (e.target.value) {
                    addToSelected(e.target.value);
                  }
                }}
                defaultValue=""
                disabled={saving}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  padding: '0 40px 0 16px',
                  fontSize: '16px',
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="" disabled>Select a skill...</option>
                {TARGET_SKILLS.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#16A34A',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                ▼
              </div>
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
              </div>
            )}

            <div className="suggested-divider" />

            {/* Suggested */}
            <div className="suggested-section">
              <p className="suggested-label">Suggested for you</p>
              <div className="suggested-tags">
                {SUGGESTED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    className="suggested-tag"
                    onClick={() => addToSelected(skill)}
                    disabled={saving}
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
                    <FiCode size={20} style={{ color: '#10B981' }} />
                  </div>
                  <span className="confidence-skill-name">{activeSkill}</span>
                </div>

                <div className="confidence-slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={CONFIDENCE_LEVELS.length - 1}
                    value={confidence[activeSkill] ?? 2}
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
                      className={`confidence-level-label ${i === (confidence[activeSkill] ?? 2) ? 'active' : ''}`}
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