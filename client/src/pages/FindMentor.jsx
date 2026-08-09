import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNav from '../components/Mentorship/MentorNav';
import Footer from '../components/Footer';
import MentorCard from '../components/Mentorship/MentorCard';
import RecommendedMentorCard from '../components/Mentorship/RecommendedMentorCard';
import LearningGoals from '../components/Mentorship/LearningGoals';
import PromoCard from '../components/Mentorship/PromoCard';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { searchMentors, fetchRecommendedMentors } from '../services/mentorApi';

const FindMentor = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch mentors (filtered by search query keyword)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadMentorsList();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const loadMentorsList = async () => {
    setLoading(true);
    try {
      const res = await searchMentors({
        keyword: searchQuery || undefined
      });
      setMentors(res.data?.mentors || []);
    } catch (err) {
      console.error('Failed to load mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const res = await fetchRecommendedMentors();
        setRecommendedMentors(res.data?.mentors || []);
      } catch (err) {
        console.error('Failed to load recommended mentors:', err);
      }
    };
    loadRecommendations();
  }, []);

  const handleReset = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      {/* Top Navigation */}
      <MentorNav />

      {/* Main Content Area */}
      <main className="flex flex-col items-center pt-24 pb-16">
        <div className="w-[1280px] max-w-full px-8 flex flex-col gap-8">
          
          {/* Hero Header */}
          <div className="flex flex-col gap-1 w-full max-w-[1216px] mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">Find a Mentor</h2>
            <p className="text-base text-slate-500">Discover mentors that match your learning goals</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-4 w-full max-w-[1216px] mx-auto">
            {/* Search Input */}
            <div className="relative w-full h-14">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full h-full pl-12 pr-4 bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="Search mentors by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => navigate('/discovery')}
                className="flex items-center gap-2 px-4 py-2 bg-[#10B981] rounded-full shadow-sm text-sm font-bold text-white hover:bg-[#059669]"
              >
                Go to Advanced Discovery Filter Page
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-sm font-bold text-[#10B981] hover:bg-emerald-100 transition-colors ml-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Content Layout */}
          <div className="flex justify-center gap-8 w-full max-w-[1216px] mx-auto mt-2">
            
            {/* Left Column: Mentor Cards */}
            <div className="flex flex-col gap-4 w-[800px]">
              {loading ? (
                <div className="flex flex-col gap-4 w-full">
                  <div className="h-48 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse"></div>
                  <div className="h-48 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse"></div>
                </div>
              ) : mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <MentorCard 
                    key={mentor.id || mentor.userId || mentor.User_Id} 
                    mentor={mentor} 
                    onBooking={(m) => {
                      navigate('/session-booking', {
                        state: {
                          mentorId: m.id || m.userId || m.User_Id,
                          mentorName: m.name || `${m.First_Name || ''} ${m.Last_Name || ''}`.trim(),
                          mentorAvatar: m.avatar || m.Avatar,
                          mentorTitle: m.role || m.title || m.Bio,
                          mentorUniversity: m.university || m.University
                        }
                      });
                    }}
                  />
                ))
              ) : (
                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-12 text-center text-slate-400">
                  No verified active mentors found.
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="flex flex-col gap-6 w-[384px]">
              
              {/* Recommended Mentors */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-3xl w-full">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#10B981] flex items-center justify-center">
                     {/* decorative square */}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Recommended for You</h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {recommendedMentors.length > 0 ? (
                    recommendedMentors.slice(0, 3).map((mentor) => (
                      <RecommendedMentorCard key={mentor.id || mentor.userId || mentor.User_Id} mentor={mentor} />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">No recommendations found.</p>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
                  <button 
                    onClick={() => navigate('/discovery')}
                    className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 text-center py-1 cursor-pointer"
                  >
                    View All Suggestions
                  </button>
                </div>
              </div>

              {/* Learning Goals */}
              <LearningGoals />

              {/* Promo Card */}
              <PromoCard />

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default FindMentor;
