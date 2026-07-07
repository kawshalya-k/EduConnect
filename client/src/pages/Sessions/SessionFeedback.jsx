import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';
import { rateSession } from '../../services/sessionService';

const tags = [
  "Clear Communication",
  "Actionable Advice",
  "Deep Expertise",
  "Encouraging",
];

export default function SessionFeedback() {
  const [rating, setRating] = useState(4);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState(["Clear Communication", "Deep Expertise"]);
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const location = useLocation();
const sessionId = location.state?.sessionId;

const handleSubmit = async () => {
    try {
      if (sessionId) {
        await rateSession(sessionId, rating, feedback);
      }
      navigate('/my-sessions');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    }
};

  const getRatingText = () => {
    const val = hovered || rating;
    if (val === 1) return "Needs Improvement";
    if (val === 2) return "Fair session";
    if (val === 3) return "Good session";
    if (val === 4) return "Great session!";
    if (val === 5) return "Excellent session! 🎉";
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter'] relative">
      <DashboardNavbar />

      <main className="flex flex-col items-center flex-grow py-12 px-6">
        <div className="w-full max-w-[640px] bg-white border border-[#10B77F]/5 shadow-[0_20px_25px_-5px_rgba(16,183,127,0.05),0_8px_10px_-6px_rgba(16,183,127,0.05)] rounded-[24px] p-12">
          
          {/* Mentor Profile Section */}
          <div className="flex flex-col items-center mb-10">
            {/* Avatar Container */}
            <div className="relative mb-6">
              <div className="w-[128px] h-[128px] rounded-full border-4 border-[#10B77F]/20 p-1 flex items-center justify-center">
                <img 
                  src="https://i.pravatar.cc/250?img=47" 
                  alt="Dr. Sarah Mitchell" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#10B77F] border-4 border-white rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white stroke-2 stroke-current">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="text-center flex flex-col items-center gap-1">
              <h1 className="text-[#0F172A] font-extrabold text-[30px] leading-[36px] tracking-[-0.75px]">Dr. Sarah Mitchell</h1>
              <h2 className="text-[#10B77F] font-semibold text-[18px] leading-[28px]">UX Strategy Expert</h2>
              <p className="text-[#64748B] font-normal text-[14px] leading-[20px]">Mentored for 45 mins on Oct 24, 2023</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F1F5F9] mb-10"></div>

          {/* Feedback Form */}
          <div className="flex flex-col gap-8">
            
            {/* Rating Component */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-[#1E293B] font-bold text-[20px] leading-[28px] mb-1">How was your session?</h3>
                <p className="text-[#64748B] font-normal text-[14px] leading-[20px] max-w-[384px]">
                  Your feedback helps Sarah improve and helps others find the right mentor.
                </p>
              </div>

              <div className="flex justify-center items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => {
                  const isActive = star <= (hovered || rating);
                  return (
                    <button 
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill={isActive ? "transparent" : "none"} 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`w-8 h-8 ${isActive ? 'text-[#10B77F] stroke-[2.5px]' : 'text-[#E2E8F0] stroke-2'}`}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="h-5">
                {(rating > 0 || hovered > 0) && (
                  <p className="text-[#10B77F] font-medium text-[14px] leading-[20px]">
                    {getRatingText()}
                  </p>
                )}
              </div>
            </div>

            {/* Written Feedback */}
            <div className="flex flex-col gap-3">
              <label className="text-[#334155] font-semibold text-[14px] leading-[20px] ml-1">
                Would you like to share more details? (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="What did you learn? How can Sarah improve?"
                className="w-full h-[160px] resize-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-4 text-[#475569] text-[16px] placeholder:text-[#94A3B8] outline-none focus:border-[#10B77F]/50 focus:ring-1 focus:ring-[#10B77F]/50 transition-all"
              ></textarea>
            </div>

            {/* Tags Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-[#334155] font-semibold text-[14px] leading-[20px] ml-1">
                What did Sarah excel at?
              </label>
              <div className="flex flex-wrap gap-3">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full font-medium text-[14px] leading-[20px] transition-all border ${
                        isSelected 
                          ? 'bg-[#10B77F]/5 border-[#10B77F]/20 text-[#10B77F]' 
                          : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex flex-col items-center gap-4 mt-2">
              <button 
                onClick={handleSubmit}
                className="w-full h-[56px] bg-[#10B77F] text-white rounded-[16px] flex justify-center items-center gap-2 font-bold text-[16px] shadow-[0_10px_15px_-3px_rgba(16,183,127,0.2),0_4px_6px_-4px_rgba(16,183,127,0.2)] hover:bg-[#0ea873] transition-colors"
              >
                Submit Feedback
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-2 stroke-current">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <p className="text-[#94A3B8] font-normal text-[12px] leading-[16px]">
                By submitting, you agree to our <span className="underline cursor-pointer hover:text-[#10B77F] transition-colors">Community Guidelines</span>
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}