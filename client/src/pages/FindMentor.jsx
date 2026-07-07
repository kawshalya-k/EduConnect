import React, { useState } from 'react';
import MentorNav from '../components/Mentorship/MentorNav';
import Footer from '../components/Footer';
import MentorCard from '../components/Mentorship/MentorCard';
import RecommendedMentorCard from '../components/Mentorship/RecommendedMentorCard';
import LearningGoals from '../components/Mentorship/LearningGoals';
import PromoCard from '../components/Mentorship/PromoCard';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

const FindMentor = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data based on the design
  const mentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=E2E8F0',
      level: 'GOLD MENTOR',
      role: 'UX Strategy & Design Thinking',
      rating: '5.0',
      reviews: 42,
      price: '120 SC',
      skills: ['Figma', 'UX Research', 'Product Design'],
    },
    {
      id: 2,
      name: 'David Miller',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=E2E8F0',
      level: 'SILVER MENTOR',
      role: 'Python Developer & Data Engineer',
      rating: '4.8',
      reviews: 99,
      price: '100 SC',
      skills: ['Python', 'Django', 'Backend'],
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=E2E8F0',
      level: 'BRONZE MENTOR',
      role: 'Product Management Lead',
      rating: '4.7',
      reviews: 56,
      price: '90 SC',
      skills: ['Agile', 'Roadmap', 'Strategy'],
    },
  ];

  const recommendedMentors = [
    { id: 1, name: 'Jamie Lee', role: 'Data Science Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=E2E8F0' },
    { id: 2, name: 'Marcus T.', role: 'Cloud Architecture', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=E2E8F0' },
    { id: 3, name: 'Sofia K.', role: 'Fullstack Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=E2E8F0' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
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
                placeholder="Search mentors by skills (e.g., Python, UI Design, Data Science)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-900 hover:bg-slate-50">
                Skill <ChevronDown className="w-4 h-4 text-slate-900" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-900 hover:bg-slate-50">
                Mentor Level <ChevronDown className="w-4 h-4 text-slate-900" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-900 hover:bg-slate-50">
                Rating (4+ stars) <ChevronDown className="w-4 h-4 text-slate-900" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-900 hover:bg-slate-50">
                Availability <ChevronDown className="w-4 h-4 text-slate-900" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-sm font-bold text-[#10B981] hover:bg-emerald-100 transition-colors ml-2">
                <SlidersHorizontal className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Content Layout */}
          <div className="flex justify-center gap-8 w-full max-w-[1216px] mx-auto mt-2">
            
            {/* Left Column: Mentor Cards */}
            <div className="flex flex-col gap-4 w-[800px]">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
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
                  {recommendedMentors.map((mentor) => (
                    <RecommendedMentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
                  <button className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 text-center py-1">
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
