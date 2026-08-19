import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  BookOpen, 
  Coins, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

const FAQ_SECTIONS = [
  {
    id: 'account',
    title: 'Account & Profile',
    icon: User,
    questions: [
      {
        q: 'How do I create an account?',
        a: "You can sign up by clicking the 'Sign In' button at the top right, then select 'Create Account'. We only need your email and a password to get you started with a personalized learning journey."
      },
      {
        q: 'Can I change my email address?',
        a: 'Currently, email addresses are locked to your university portal account for verification and security reasons. Please contact support if you need to manually update it.'
      }
    ]
  },
  {
    id: 'mentoring',
    title: 'Mentoring & Sessions',
    icon: BookOpen,
    questions: [
      {
        q: 'How do I book a session with a mentor?',
        a: 'Navigate to Search Mentors or Mentor Discovery, choose a mentor, check their availability on their profile page, select a time slot, and confirm the booking using your Skill Coins.'
      },
      {
        q: 'What happens if I need to cancel a session?',
        a: 'You can cancel up to 24 hours before the session start time to get a full refund of your Skill Coins. Cancelations within 24 hours are non-refundable unless verified as an emergency by support.'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    icon: Coins,
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We exclusively use Skill Coins for all session bookings, quizzes, and mentor rewards. You can earn Skill Coins by completing sessions, passing verifications, or receiving badges/bonuses.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Cpu,
    questions: [
      {
        q: 'Which browsers are supported?',
        a: 'EduConnect is optimized for all modern web browsers including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.'
      }
    ]
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null); // stores 'sectionIndex-questionIndex'

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggle = (key) => {
    setActiveFaq(activeFaq === key ? null : key);
  };

  // Filter based on search query
  const filteredSections = FAQ_SECTIONS.map((section) => {
    const matchedQuestions = section.questions.filter(
      (qObj) =>
        qObj.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qObj.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, questions: matchedQuestions };
  }).filter((section) => section.questions.length > 0);

  return (
    <div className="bg-[#F0FDF4] min-h-screen font-sans text-slate-900 flex flex-col">
      <DashboardNavbar logoOnlyIfLoggedOut={true} />

      {/* Main Header / Hero Section */}
      <section className="max-w-4xl mx-auto w-full px-6 py-16 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-none">
            How can we help you today?
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our mentoring platform. Can't find what you're looking for? Chat with our support team.
          </p>
        </div>

        {/* Large Search Bar */}
        <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl flex items-center shadow-xl border border-emerald-500/10 relative">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search for questions, keywords, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-4 text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none text-lg"
          />
          <button 
            className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-4 rounded-xl transition-all cursor-pointer text-base"
          >
            Search
          </button>
        </div>
      </section>

      {/* Category selector tags */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FAQ_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="bg-white hover:bg-slate-50 border border-emerald-500/10 hover:border-emerald-500/25 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center text-[#059669]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-[#0F172A] text-sm text-center">
                  {sec.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accordions Content List */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 space-y-12 flex-1">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, sIdx) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.id} id={section.id} className="scroll-mt-28 space-y-6">
                
                {/* Section Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#059669]/10 rounded-xl flex items-center justify-center text-[#059669]">
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    {section.title}
                  </h2>
                </div>

                {/* Section Questions Accordion */}
                <div className="space-y-4">
                  {section.questions.map((item, qIdx) => {
                    const toggleKey = `${sIdx}-${qIdx}`;
                    const isOpen = activeFaq === toggleKey;
                    return (
                      <div 
                        key={toggleKey} 
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                      >
                        <button 
                          onClick={() => handleToggle(toggleKey)}
                          className="w-full px-6 py-5 flex justify-between items-center text-[#0F172A] hover:text-[#059669] font-semibold text-base transition-colors cursor-pointer text-left"
                        >
                          <span>{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#059669]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#059669]" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            No matching questions found. Try a different search term.
          </div>
        )}

        {/* Still Have Questions? Section */}
        <section className="bg-[#064E3B] text-white rounded-[24px] p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden isolate border border-white/5">
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -z-10" />
          
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Still have questions?
          </h2>
          <p className="text-emerald-100/80 text-base max-w-xl mx-auto leading-relaxed">
            If you couldn't find your answer in our FAQ, our friendly support team is ready to help you with any issues.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/contact-support')}
              className="bg-white hover:bg-slate-50 text-[#064E3B] font-bold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <MessageSquare className="w-5 h-5 text-[#064E3B]" />
              <span>Contact Support</span>
            </button>
            <button 
              onClick={() => navigate('/help-center')}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <HelpCircle className="w-5 h-5 text-white" />
              <span>View Help Center</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
