import { Link } from 'react-router-dom';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import './MentorCard.css';

export default function MentorCard({ mentor, onBooking }) {
  const levelBadgeColor = {
    GOLD: 'gold',
    SILVER: 'silver',
    BRONZE: 'bronze',
  }[mentor.level] || 'bronze';

  return (
    <div className={`mentor-card level-${levelBadgeColor.toLowerCase()}`}>
      {/* Header with avatar and level badge */}
      <div className="mentor-card-header">
        <Link to={`/mentor/${mentor.id}`} className="mentor-avatar-link">
          <div className="mentor-avatar">
            {mentor.avatar ? (
              <img src={mentor.avatar} alt={mentor.name} />
            ) : (
              <span>{mentor.name?.slice(0, 1)}</span>
            )}
            <div className={`level-badge level-badge-${levelBadgeColor.toLowerCase()}`}>
              <span className="level-badge-icon">
                {levelBadgeColor === 'gold' ? '🏆' : levelBadgeColor === 'silver' ? '⭐' : '🥉'}
              </span>
            </div>
          </div>
        </Link>

        <div className="mentor-header-info">
          <Link to={`/mentor/${mentor.id}`} className="mentor-name-link">
            <h3 className="mentor-name">{mentor.name}</h3>
          </Link>
          <p className="mentor-location">
            {mentor.university} • <span className={`level-label level-${levelBadgeColor.toLowerCase()}`}>{mentor.level} MENTOR</span>
          </p>
        </div>
      </div>

      {/* Rating and stats */}
      <div className="mentor-stats-row">
        <div className="mentor-rating">
          <FiStar size={14} fill="currentColor" />
          <span>{mentor.rating.toFixed(1)}</span>
          {mentor.ratingCount && <span className="rating-count">({mentor.ratingCount})</span>}
        </div>
      </div>

      {/* Bio */}
      <p className="mentor-bio">{mentor.bio}</p>

      {/* Skills */}
      <div className="mentor-skills">
        {mentor.skills?.slice(0, 3).map((skill) => (
          <span key={skill} className="mentor-skill-badge">
            {skill}
          </span>
        ))}
      </div>

      {/* Footer with cost and CTA */}
      <div className="mentor-card-footer">
        <div className="mentor-cost">
          <span className="cost-icon">$</span>
          <span className="cost-amount">{mentor.costPerSession}</span>
          <span className="cost-unit">Coins</span>
        </div>
        <button
          className="mentor-book-btn"
          onClick={() => onBooking?.(mentor)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}