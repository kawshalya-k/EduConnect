import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiSliders } from 'react-icons/fi';
import PageLayout from '../components/Layout/PageLayout';
import MentorCard from '../components/Mentorship/MentorCard';
import { LoadingState } from '../components/Layout/LoadingState';
import {
  searchMentors,
  aiMentorSearch,
  fetchCategories,
  fetchUserProfile,
  fetchSuggestedSkills
} from '../services/mentorApi';
import { useAuth } from '../context/AuthContext';
import './MentorDiscovery.css';

const CATEGORIES = [
  'Web Development',
  'UI/UX Design',
  'Data Science',
  'Mobile Dev',
];

const MENTOR_LEVELS = ['GOLD', 'SILVER', 'BRONZE'];
const SESSION_TYPES = ['Any Type', '1-on-1', 'Group', 'Project Review'];

export default function MentorDiscovery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  const [categories, setCategories] = useState([
    'Web Development',
    'UI/UX Design',
    'Data Science',
    'Mobile Development'
  ]);
  const [quickTags, setQuickTags] = useState([
    'Data Structures 101',
    'Public Speaking',
    'Python for Finance'
  ]);
  const [isAIResult, setIsAIResult] = useState(false);
  const [aiQueryText, setAiQueryText] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevels, setSelectedLevels] = useState(['GOLD', 'SILVER']);
  const [sessionType, setSessionType] = useState('Any Type');

  useEffect(() => {
    const getCats = async () => {
      try {
        const res = await fetchCategories();
        const fetchedCats = (res.data || []).filter(Boolean);
        if (fetchedCats.length > 0) {
          setCategories(fetchedCats);
        } else {
          setCategories(['Web Development', 'UI/UX Design', 'Data Science', 'Mobile Development']);
        }
      } catch (err) {
        console.error('Failed to load categories dynamically:', err);
        setCategories(['Web Development', 'UI/UX Design', 'Data Science', 'Mobile Development']);
      }
    };
    getCats();
  }, []);

  useEffect(() => {
    const loadQuickTags = async () => {
      const fallbackTags = [
        'Data Structures 101',
        'Public Speaking',
        'Python for Finance'
      ];

      try {
        if (user && user.id) {
          try {
            const res = await fetchUserProfile(user.id);
            const learnerSkills = (res.data?.skills || [])
              .filter(s => s.Skill_Role === 'Learner')
              .map(s => s.Skill_Name)
              .filter(Boolean);
            
            if (learnerSkills.length > 0) {
              setQuickTags(learnerSkills.slice(0, 5));
              return;
            }
          } catch (profileErr) {
            console.error('Failed to fetch user profile for quick tags:', profileErr);
          }
        }

        // If not logged in, or logged-in user has no learner skills, fetch suggested skills
        const skillsRes = await fetchSuggestedSkills();
        const skills = (skillsRes.data?.skills || []).filter(Boolean);
        if (skills.length > 0) {
          setQuickTags(skills.slice(0, 5));
          return;
        }
      } catch (err) {
        console.error('Failed to load quick tags:', err);
      }

      setQuickTags(fallbackTags);
    };

    loadQuickTags();
  }, [user]);

  useEffect(() => {
    setIsAIResult(false);
    loadMentors();
  }, [selectedCategory, selectedLevels, sessionType, sortBy]);

  const loadMentors = async () => {
    setLoading(true);
    try {
      const res = await searchMentors({
        category: selectedCategory || undefined,
        levels: selectedLevels.join(','),
        sessionType: sessionType === 'Any Type' ? null : sessionType,
        sortBy,
      });
      setMentors(res.data?.mentors || []);
    } catch (err) {
      console.error('Mentor search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await aiMentorSearch(searchQuery);
      setMentors(res.data?.mentors || []);
      setAiQueryText(searchQuery);
      setIsAIResult(true);
    } catch (err) {
      console.error('AI search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      handleAISearch();
    }
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  return (
    <PageLayout>
      <div className="discovery-page">
        {/* Hero Header */}
        <div className="discovery-hero">
          <h1 className="discovery-title">Master New Skills Through Peer Mentorship</h1>
          <p className="discovery-subtitle">
            Connect with top-rated student mentors using our AI-driven matching, tailored to your
            learning goals.
          </p>

          {/* AI Search Bar */}
          <div className="discovery-search-wrap">
            <div className="search-input-box">
              <FiSearch size={18} className="search-icon" />
              <input
                type="text"
                className="discovery-search-input"
                placeholder="Try 'Learn React with a Gold Mentor' or 'UI Design basics'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
              />
            </div>
            <button className="ai-search-btn" onClick={handleAISearch}>
              <svg className="ai-sparkle-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <path d="M 8 6 Q 8 12 14 12 Q 8 12 8 18 Q 8 12 2 12 Q 8 12 8 6 Z" fill="url(#sparkle-gradient)" />
                <path d="M 16 5 Q 16 8 19 8 Q 16 8 16 11 Q 16 8 13 8 Q 16 8 16 5 Z" fill="url(#sparkle-gradient)" />
                <path d="M 17 13 Q 17 16 20 16 Q 17 16 17 19 Q 17 16 14 16 Q 17 16 17 13 Z" fill="url(#sparkle-gradient)" />
              </svg>
              <span className="ai-search-btn-text">Ask AI</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="quick-search-tags">
            <p className="quick-label">QUICK SEARCH:</p>
            {quickTags.map((tag) => (
              <button key={tag} className="quick-tag" onClick={() => setSearchQuery(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="discovery-content">
          {/* Sidebar Filters */}
          <aside className="discovery-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">CATEGORY</h3>
              <div className="filter-checkboxes">
                {categories.map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">MENTOR LEVEL</h3>
              <div className="filter-checkboxes">
                {MENTOR_LEVELS.map((level) => (
                  <label key={level} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                    />
                    <span>
                      {level === 'GOLD' && '🏆'} {level === 'SILVER' && '⭐'} {level === 'BRONZE' && '🥉'} {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">SESSION TYPE</h3>
              <select
                className="filter-select"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
              >
                {SESSION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="discovery-main">
            {/* Results Header */}
            <div className="results-header">
              <h2 className="results-title">Recommended Mentors</h2>
              <div className="results-sort">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="rating">Rating</option>
                  <option value="cost">Price: Low to High</option>
                  <option value="availability">Most Available</option>
                </select>
              </div>
            </div>

            {isAIResult && (
              <div className="ai-result-tag" style={{ background: '#e0f2fe', color: '#0369a1', padding: '8px 16px', borderRadius: '8px', marginBottom: '16px', display: 'inline-block', fontSize: '14px', fontWeight: '500' }}>
                🤖 AI results for: <strong>"{aiQueryText}"</strong>
              </div>
            )}

            {/* Mentors Grid */}
            {loading ? (
              <LoadingState message="Finding mentors..." />
            ) : mentors.length === 0 ? (
              <div className="no-mentors">
                <p>No mentors found. Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="mentors-grid">
                {mentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id || mentor.userId || mentor.User_Id}
                    mentor={mentor}
                    layout="grid"
                    onBooking={(m) => {
                      if (user) {
                        navigate('/session-booking', {
                          state: {
                            mentorId: m.id || m.userId,
                            mentorName: m.name,
                            mentorAvatar: m.avatar,
                            mentorTitle: m.role || m.department,
                            mentorUniversity: m.university
                          }
                        });
                      } else {
                        navigate('/login');
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {mentors.length > 0 && (
              <div className="load-more-container">
                <button className="load-more-btn">View more mentors ↓</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}