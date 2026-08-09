import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiStar, FiCalendar, FiMessageCircle } from 'react-icons/fi';
import PageLayout from '../components/Layout/PageLayout';
import { LoadingState } from '../components/Layout/LoadingState';
import { fetchMentorProfile } from '../services/mentorApi';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosConfig';
import './MentorProfile.css';

export default function MentorProfile() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);

  useEffect(() => {
    loadProfile();
    if (mentorId) {
      loadAvailability();
    }
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

  const loadAvailability = async () => {
    const upcomingDays = [];
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateVal = String(d.getDate()).padStart(2, '0');
      upcomingDays.push({
        value: `${year}-${month}-${dateVal}`,
        label: d.toLocaleDateString('en-US', options)
      });
    }

    try {
      const promises = upcomingDays.map(async (day) => {
        try {
          const res = await axiosInstance.get(`/sessions/availability/${mentorId}`, {
            params: { date: day.value }
          });
          const activeSlots = (res.data.slots || [])
            .filter(slot => slot.available)
            .map(slot => ({
              label: slot.label.split(' - ')[0],
              value: slot.value
            }));
          return {
            date: day.value,
            dateLabel: day.label,
            times: activeSlots
          };
        } catch (err) {
          console.error(`Error loading availability for ${day.value}:`, err);
          return {
            date: day.value,
            dateLabel: day.label,
            times: []
          };
        }
      });
      const results = await Promise.all(promises);
      setAvailabilitySlots(results);
    } catch (err) {
      console.error('Failed to load availability:', err);
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



  return (
    <PageLayout>
      <div className="mentor-profile-page-container">
        <div className="mentor-profile-main-layout">
          
          {/* Left Column: Hero, Stats, Skills, Reviews */}
          <div className="profile-left-column">
            
            {/* Hero Section */}
            <div className="profile-hero-card">
              <div className="profile-hero-inner">
                {/* Avatar container */}
                <div className="profile-hero-avatar-wrapper">
                  <div className="profile-hero-avatar-outer-border">
                    <div className="profile-hero-avatar-inner">
                      {mentor.avatar ? (
                        <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-white">{mentor.name?.slice(0, 1)}</span>
                      )}
                    </div>
                  </div>
                  {/* Floating level label */}
                  <div className="profile-hero-level-badge">
                    <span className="profile-hero-level-badge-text">{mentor.level}</span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="profile-hero-details">
                  <h1 className="profile-hero-name">
                    {mentor.name}
                    {mentor.verified && (
                      <span className="profile-hero-verified-badge">
                        <FiCheckCircle size={14} />
                        VERIFIED
                      </span>
                    )}
                  </h1>
                  <p className="profile-hero-title">{mentor.title}</p>
                  
                  {/* Progress bar info */}
                  <div className="profile-progress-bar-container">
                    <div className="profile-progress-bar-header">
                      <span className="profile-progress-bar-role-text">VERIFIED MENTOR</span>
                      <span className="profile-progress-bar-xp-text">
                        {mentor.currentXP || 140} / {mentor.nextLevelXP || 200} KP to {mentor.level === 'GOLD' ? 'Legend' : mentor.level === 'SILVER' ? 'Gold' : 'Silver'}
                      </span>
                    </div>
                    <div className="profile-progress-bar-track">
                      <div
                        className="profile-progress-bar-fill"
                        style={{ width: `${mentor.levelProgress || 70}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stats Section */}
            <div className="profile-stats-row">
              {/* Stat 1 */}
              <div className="profile-stat-card">
                <div className="profile-stat-icon-wrapper">
                  <FiCalendar size={20} className="text-[#10B981]" />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-value">{mentor.sessionsTaught || 12}</span>
                  <span className="profile-stat-label">SESSIONS TAUGHT</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="profile-stat-card">
                <div className="profile-stat-icon-wrapper">
                  <FiStar size={20} className="text-[#10B981]" />
                </div>
                <div className="profile-stat-info">
                  <div className="profile-stat-rating-row">
                    <span className="profile-stat-value">{mentor.rating?.toFixed(1) || '4.9'}</span>
                    <div className="profile-stat-stars-row">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                  <span className="profile-stat-label">RATING</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="profile-stat-card">
                <div className="profile-stat-icon-wrapper">
                  <FiCalendar size={20} className="text-[#10B981]" />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-value">{mentor.memberSince || 'Oct 2023'}</span>
                  <span className="profile-stat-label">MEMBER SINCE</span>
                </div>
              </div>
            </div>

            {/* Verified Skills Section */}
            {mentor.skills && mentor.skills.length > 0 && (
              <div className="profile-skills-section">
                <div className="profile-section-heading">
                  <div className="profile-section-heading-indicator" />
                  <h3 className="profile-section-title">Verified Skills</h3>
                </div>
                <div className="profile-skills-grid">
                  {mentor.skills.map((skill) => (
                    <div key={skill.id} className="profile-skill-card">
                      <div className="profile-skill-card-header">
                        <div className="profile-skill-card-icon-container">
                          <span className="profile-skill-card-icon">⚡</span>
                        </div>
                        <div className="profile-skill-card-badge">
                          <span className="profile-skill-card-badge-bullet">•</span>
                          <span>Verified Skill</span>
                        </div>
                      </div>
                      <h4 className="profile-skill-card-title">{skill.name}</h4>
                      <p className="profile-skill-card-description">{skill.description}</p>
                      <div className="profile-skill-card-tags">
                        {skill.technologies && skill.technologies.length > 0 ? (
                          skill.technologies.map((tech) => (
                            <span key={tech} className="profile-tech-tag">{tech}</span>
                          ))
                        ) : (
                          <>
                            <span className="profile-tech-tag">Expert</span>
                            <span className="profile-tech-tag">{skill.category || 'Tech'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learner Feedback Section */}
            {mentor.reviews && mentor.reviews.length > 0 && (
              <div className="profile-reviews-section">
                <div className="profile-section-heading">
                  <div className="profile-section-heading-indicator" />
                  <h3 className="profile-section-title">Learner Feedback</h3>
                </div>
                <div className="profile-reviews-list">
                  {mentor.reviews.map((review) => (
                    <div key={review.id} className="profile-review-card">
                      <div className="profile-review-card-header">
                        <div className="profile-review-card-avatar">
                          {review.learnerAvatar ? (
                            <img src={review.learnerAvatar} alt={review.learnerName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-white">{review.learnerName?.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className="profile-review-card-info">
                          <p className="profile-review-card-name">{review.learnerName}</p>
                          <p className="profile-review-card-topic">{review.sessionTopic}</p>
                        </div>
                        <div className="profile-review-card-rating">
                          {Array.from({ length: Math.round(review.rating || 5) }).map((_, i) => (
                            <span key={i} className="profile-star-filled">★</span>
                          ))}
                          {Array.from({ length: 5 - Math.round(review.rating || 5) }).map((_, i) => (
                            <span key={`empty-${i}`} className="profile-star-empty">☆</span>
                          ))}
                        </div>
                      </div>
                      <p className="profile-review-card-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking & Availability */}
          <div className="profile-sidebar-column">
            {/* Availability Selection Card */}
            <div className="profile-availability-card">
              <div className="profile-availability-header">
                <div className="profile-availability-header-icon-container">
                  <FiCalendar size={18} className="text-[#10B77F]" />
                </div>
                <h3 className="profile-availability-header-title">Select Availability</h3>
              </div>
              
              <div className="profile-availability-slots-list">
                {availabilitySlots.map((slot, idx) => {
                  const isDateSelected = selectedDate === slot.date;
                  return (
                    <div 
                      key={idx} 
                      className={`profile-availability-slot-item ${isDateSelected ? 'selected' : ''}`}
                    >
                      <p className="profile-availability-slot-date">{slot.dateLabel}</p>
                      <div className="profile-availability-time-grid">
                        {slot.times.length > 0 ? (
                          slot.times.map((time) => {
                            const isTimeSelected = selectedDate === slot.date && selectedTime === time.value;
                            return (
                              <button
                                key={time.value}
                                className={`profile-availability-time-btn ${isTimeSelected ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedDate(slot.date);
                                  setSelectedTime(time.value);
                                }}
                              >
                                {time.label}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-400 py-1">No slots available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Action Card */}
            <div className="profile-booking-action-card">
              <div className="profile-booking-info-list">
                <div className="profile-booking-info-item">
                  <div className="profile-booking-info-check">✓</div>
                  <span className="profile-booking-info-text">60-minute focused session</span>
                </div>
                <div className="profile-booking-info-item">
                  <div className="profile-booking-info-check">✓</div>
                  <span className="profile-booking-info-text">Project review & feedback</span>
                </div>
                <div className="profile-booking-info-item">
                  <div className="profile-booking-info-check">✓</div>
                  <span className="profile-booking-info-text">Follow-up resource list</span>
                </div>
              </div>

              <button 
                className="profile-booking-btn-primary" 
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
                className="profile-booking-btn-secondary"
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
                Message {mentor.name?.split(' ')[0]}
              </button>

              <div className="profile-booking-guarantee-container">
                <span className="profile-booking-guarantee-text">100% SATISFACTION GUARANTEED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}