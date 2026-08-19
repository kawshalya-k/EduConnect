import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Rocket, 
  Lightbulb, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

const CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    desc: 'New to EduConnect? Learn the basics of setting up your account and classroom.',
    icon: Rocket,
  },
  {
    id: 'teaching-tips',
    title: 'Teaching Tips',
    desc: 'Best practices for engaging students and optimizing lesson delivery.',
    icon: Lightbulb,
  },
  {
    id: 'skill-coins',
    title: 'Using Skill Coins',
    desc: 'Master the rewards system to incentivize student progress and achievement.',
    icon: Coins,
  }
];

const GUIDES = [
  {
    id: 'guide-1',
    category: 'Comprehensive Guide',
    title: 'The Ultimate Classroom Management Kit',
    desc: 'A step-by-step guide to organizing your digital workspace and streamlining student communication.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80',
    color: '#D1FAE5'
  },
  {
    id: 'guide-2',
    category: 'New Feature',
    title: 'Gamifying Lessons with Skill Coins',
    desc: 'Discover creative ways to use tokens to reward curiosity, teamwork, and academic growth in your classroom.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80',
    color: '#A7F3D0'
  },
  {
    id: 'guide-3',
    category: 'Best Practices',
    title: 'Engaging Peer-to-Peer Sessions',
    desc: 'Tips and frameworks from top university mentors on hosting high-impact Q&A and skill-sharing rooms.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80',
    color: '#D1FAE5'
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % GUIDES.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + GUIDES.length) % GUIDES.length);
  };

  const filteredGuides = GUIDES.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F0FDF4] min-h-screen font-sans text-slate-900 flex flex-col">
      <DashboardNavbar logoOnlyIfLoggedOut={true} />

      {/* Hero Section */}
      <section className="bg-[#064E3B] text-white relative overflow-hidden py-20 px-6 flex items-center justify-center isolate">
        {/* Decorative Radial Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none -z-10" />
        
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              How can we help you today?
            </h1>
            <p className="text-[#D1FAE5]/85 text-lg md:text-xl font-normal max-w-2xl mx-auto">
              Find guides, tutorials, and expert advice to master EduConnect and transform your classroom experience.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto bg-white p-2 rounded-2xl flex items-center shadow-2xl relative">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search for articles, features, or workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none text-base"
            />
            <button 
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-xl transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#064E3B] tracking-tight">
            Browse by Category
          </h2>
          <button 
            onClick={() => navigate('/discovery')} 
            className="text-[#10B981] hover:text-[#059669] font-bold text-sm transition-colors cursor-pointer"
          >
            View all categories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="bg-white border border-[#D1FAE5] rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
              >
                <div className="space-y-6">
                  {/* Icon Area */}
                  <div className="w-14 h-14 bg-[#ECFDF5] rounded-xl flex items-center justify-center text-[#10B981]">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0F172A]">{cat.title}</h3>
                    <p className="text-slate-500 text-base leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                {/* Explore Link */}
                <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-[#10B981] font-bold text-sm cursor-pointer hover:text-[#059669] transition-colors">
                  <span>Explore articles</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="bg-emerald-50/50 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#064E3B] tracking-tight">
              Featured Guides
            </h2>
            <p className="text-slate-500 text-base">
              Our most popular resources picked by our experts.
            </p>
          </div>

          {/* Carousel Wrapper */}
          <div className="relative flex items-center justify-between gap-4">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-md hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 z-10"
              aria-label="Previous guide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Carousel Item */}
            <div className="flex-1 w-full overflow-hidden transition-all duration-500">
              {filteredGuides.length > 0 ? (
                <div className="bg-white border border-[#D1FAE5] rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[364px] transition-all duration-300">
                  {/* Image/Decoration Area */}
                  <div className="md:w-2/5 min-h-[200px] md:min-h-full relative overflow-hidden" style={{ backgroundColor: filteredGuides[carouselIndex].color }}>
                    <img 
                      src={filteredGuides[carouselIndex].image} 
                      alt={filteredGuides[carouselIndex].title}
                      className="w-full h-full object-cover mix-blend-overlay opacity-80"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="p-8 md:p-12 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-4">
                      <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest block">
                        {filteredGuides[carouselIndex].category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] leading-tight">
                        {filteredGuides[carouselIndex].title}
                      </h3>
                      <p className="text-slate-500 text-base leading-relaxed max-w-xl">
                        {filteredGuides[carouselIndex].desc}
                      </p>
                    </div>

                    <button className="border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/5 transition-colors font-bold px-8 py-3 rounded-xl w-fit cursor-pointer">
                      Read Guide
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
                  No matching guides found.
                </div>
              )}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={nextSlide}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-md hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 z-10"
              aria-label="Next guide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Still Need Help? Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16">
        <div className="bg-[#064E3B] rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden isolate shadow-xl border border-white/5">
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -z-10" />
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Still need help?
            </h2>
            <p className="text-emerald-100/70 text-base max-w-xl">
              Our support team is available 24/7 to answer any specific questions you might have.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <button 
              onClick={() => navigate('/contact-support')}
              className="bg-white hover:bg-slate-50 text-[#064E3B] font-bold py-4 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-[#064E3B]" />
              <span>Contact Support</span>
            </button>
            <a 
              href="mailto:support@educonnect.com"
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-5 h-5 text-white" />
              <span>Send us an Email</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
