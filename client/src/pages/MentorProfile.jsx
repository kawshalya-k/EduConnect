import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiStar, FiCalendar, FiMessageCircle } from 'react-icons/fi';
import PageLayout from '../components/Layout/PageLayout';
import { LoadingState } from '../components/Layout/LoadingState';
import { fetchMentorProfile } from '../services/mentorApi';
import { useAuth } from '../context/AuthContext';
import './MentorProfile.css';

export default function MentorProfile() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [mentorId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchMentorProfile(mentorId);
      setMentor(res.data?.mentor);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading mentor profile..." />
      </PageLayout>
    );
  }

  if (!mentor) {
    return (
      <PageLayout>
        <div className="profile-error">
          <h2>Mentor not found</h2>
          <button onClick={() => navigate('/discovery')}>Back to Discovery</button>
        </div>
      </PageLayout>
    );
  }

  const levelIcon =
    mentor.level === 'GOLD' ? '🏆' : mentor.level === 'SILVER' ? '⭐' : '🥉';

  // Mock availability
  const availability = [
    { date: 'Monday, Oct 24', times: ['10:00 AM', '11:30 AM'] },
    { date: 'Wednesday, Oct 26', times: ['11:00 AM', '1:00 PM'] },
    { date: 'Saturday, Oct 29', times: ['11:00 AM', '1:00 PM'] },
  ];

  return (
    <PageLayout>
      <div className="mentor-profile-page">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="profile-hero-content">
            {/* Avatar & Badge */}
            <div className="profile-hero-left">
              <div className="profile-hero-avatar">
                {mentor.avatar ? (
                  <img src={mentor.avatar} alt={mentor.name} />
                ) : (
                  <span>{mentor.name?.slice(0, 1)}</span>
                )}
                <div className={`profile-level-badge level-${mentor.level?.toLowerCase()}`}>
                  {levelIcon}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="profile-hero-info">
              <h1 className="profile-name">{mentor.name}</h1>
              <p className="profile-title">
                {mentor.title}
                {mentor.verified && (
                  <span className="verified-badge">
                    <FiCheckCircle size={14} />
                    VERIFIED
                  </span>
                )}
              </p>

              <div className="profile-meta">
                <span>{mentor.university}</span>
                <span className={`level-badge-text level-${mentor.level?.toLowerCase()}`}>
                  {mentor.level} MENTOR RANK
                </span>
                <div className="rank-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${mentor.levelProgress || 70}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    {mentor.currentXP || 140} / {mentor.nextLevelXP || 200} KP to Silver
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <FiCalendar size={16} />
                  <div>
                    <p className="stat-label">SESSIONS TAUGHT</p>
                    <p className="stat-value">{mentor.sessionsTaught || 12}</p>
                  </div>
                </div>
                <div className="stat-item">
                  <FiStar size={16} />
                  <div>
                    <p className="stat-label">RATING</p>
                    <p className="stat-value">
                      {mentor.rating?.toFixed(1) || '4.9'} <span className="stars">★★★★★</span>
                    </p>
                  </div>
                </div>
                <div className="stat-item">
                  <FiCalendar size={16} />
                  <div>
                    <p className="stat-label">MEMBER SINCE</p>
                    <p className="stat-value">{mentor.memberSince || 'Oct 2023'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content-grid">
          {/* Left Column */}
          <div className="profile-main">
            {/* Verified Skills */}
            {mentor.skills && mentor.skills.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">✓ Verified Skills</h2>
                <div className="skills-grid">
                  {mentor.skills.map((skill) => (
                    <div key={skill.id} className="skill-detail-card">
                      <div className="flex gap-2 items-center mb-2 flex-wrap" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <div className="skill-badge-verified">
                          <FiCheckCircle size={14} />
                          <span>VERIFIED SKILL</span>
                        </div>
                        {skill.level && (
                          <div className={`skill-badge-level skill-badge-level--${skill.level.toLowerCase()}`} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontWeight: '700',
                            fontSize: '11px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            background: skill.level.toLowerCase() === 'expert' ? 'rgba(245, 158, 11, 0.12)' :
                                        skill.level.toLowerCase() === 'intermediate' ? 'rgba(59, 130, 246, 0.12)' :
                                        'rgba(16, 185, 129, 0.12)',
                            color: skill.level.toLowerCase() === 'expert' ? '#92400E' :
                                   skill.level.toLowerCase() === 'intermediate' ? '#1E40AF' :
                                   '#065F46'
                          }}>
                            {skill.level}
                          </div>
                        )}
                      </div>
                      <h3 className="skill-detail-name">{skill.name}</h3>
                      <p className="skill-detail-desc">{skill.description}</p>
                      <div className="skill-detail-techs">
                        {skill.technologies?.map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learner Feedback */}
            {mentor.reviews && mentor.reviews.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">📚 Learner Feedback</h2>
                <div className="reviews-list">
                  {mentor.reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.learnerAvatar ? (
                            <img src={review.learnerAvatar} alt={review.learnerName} />
                          ) : (
                            <span>{review.learnerName?.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className="review-info">
                          <p className="review-name">{review.learnerName}</p>
                          <p className="review-session">{review.sessionTopic}</p>
                        </div>
                        <div className="review-rating">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i} className="star">★</span>
                          ))}
                          {Array.from({ length: 5 - review.rating }).map((_, i) => (
                            <span key={`empty-${i}`} className="star empty">☆</span>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Booking */}
          <aside className="profile-sidebar">
            {/* Availability */}
            <div className="booking-card">
              <h3 className="booking-title">Select Availability</h3>
              <div className="availability-dates">
                {availability.map((slot, idx) => (
                  <div key={idx} className="availability-slot">
                    <p className="slot-date">{slot.date}</p>
                    <div className="slot-times">
                      {slot.times.map((time) => (
                        <button
                          key={time}
                          className={`time-btn ${selectedDate === slot.date && selectedTime === time ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedDate(slot.date);
                            setSelectedTime(time);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Session Info */}
              <div className="session-info-list">
                <div className="info-item">
                  <span className="info-icon">✓</span>
                  <span>60-minute focused session</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">✓</span>
                  <span>Project review & feedback</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">✓</span>
                  <span>Follow-up resource list</span>
                </div>
              </div>

              <button 
                className="book-session-btn" 
                disabled={!selectedTime}
                onClick={() => {
                  if (user) {
                    navigate('/session-booking', {
                      state: {
                        mentorId: mentor.id || mentor.userId || mentorId,
                        mentorName: mentor.name,
                        mentorAvatar: mentor.avatar,
                        mentorTitle: mentor.title,
                        mentorUniversity: mentor.university,
                        date: selectedDate,
                        time: selectedTime
                      }
                    });
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Book a Session
              </button>

              <button 
                className="message-btn"
                onClick={() => {
                  if (user) {
                    navigate('/messages', {
                      state: {
                        recipientId: mentor.id || mentor.userId || mentorId,
                        recipientName: mentor.name,
                        recipientAvatar: mentor.avatar,
                        recipientTitle: mentor.title,
                        recipientUniversity: mentor.university
                      }
                    });
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <FiMessageCircle size={16} />
                Message {mentor.name?.split(' ')[0]}
              </button>

              <p className="satisfaction-guarantee">100% SATISFACTION GUARANTEED</p>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}