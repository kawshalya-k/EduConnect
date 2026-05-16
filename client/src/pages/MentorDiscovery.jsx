import { useState, useEffect } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import PageLayout from '../components/Layout/PageLayout';
import MentorCard from '../components/Mentorship/MentorCard';
import { LoadingState } from '../components/Layout/LoadingState';
import { searchMentors, aiMentorSearch } from '../services/mentorApi';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('Web Development');
  const [selectedLevels, setSelectedLevels] = useState(['GOLD', 'SILVER']);
  const [sessionType, setSessionType] = useState('Any Type');

  useEffect(() => {
    loadMentors();
  }, [selectedCategory, selectedLevels, sessionType, sortBy]);

  const loadMentors = async () => {
    setLoading(true);
    try {
      const res = await searchMentors({
        category: selectedCategory,
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
              🤖 Ask AI
            </button>
          </div>

          {/* Quick Search */}
          <div className="quick-search-tags">
            <p className="quick-label">QUICK SEARCH:</p>
            <button className="quick-tag" onClick={() => setSearchQuery('Data Structures 101')}>
              Data Structures 101
            </button>
            <button className="quick-tag" onClick={() => setSearchQuery('Public Speaking')}>
              Public Speaking
            </button>
            <button className="quick-tag" onClick={() => setSearchQuery('Python for Finance')}>
              Python for Finance
            </button>
          </div>
        </div>

        <div className="discovery-content">
          {/* Sidebar Filters */}
          <aside className="discovery-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">CATEGORY</h3>
              <div className="filter-checkboxes">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
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
                    key={mentor.id}
                    mentor={mentor}
                    onBooking={(m) => {
                      // Handle booking logic
                      console.log('Booking mentor:', m);
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