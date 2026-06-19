import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPlusCircle } from 'react-icons/fi';
import './SkillsPanel.css';

export default function SkillsWidget({ skills = [], loading = false }) {
  return (
    <div className="skills-widget">
      <Link to="/verification?view=all" className="skills-widget-header hover:opacity-80 transition-opacity block no-underline text-inherit">
        <span className="skills-widget-icon">✓</span>
        <h3 className="skills-widget-title">Skills</h3>
      </Link>

      {loading ? (
        <div className="skills-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skill-skeleton" />
          ))}
        </div>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <Link
              to="/verification?view=all"
              key={skill.id}
              className="skill-item"
            >
              <div className="skill-item-icon">
                {skill.icon ? (
                  <img src={skill.icon} alt={skill.name} />
                ) : (
                  <span className="skill-icon-placeholder">
                    {skill.name?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="skill-item-info">
                <p className="skill-item-name">{skill.name}</p>
                <p className="skill-item-level">
                  {skill.level} • {skill.endorsements} Endorsements
                </p>
              </div>
              {skill.verified && (
                <FiCheckCircle size={16} className="skill-verified-icon" />
              )}
            </Link>
          ))}
        </div>
      )}

      <Link to="/verification/add" className="add-skill-btn">
        <FiPlusCircle size={15} />
        <span>Add New Skill</span>
      </Link>
    </div>
  );
}