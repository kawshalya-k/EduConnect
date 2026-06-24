import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  X, 
  Sparkles,
  Share2,
  ShieldCheck,
  Info,
  User,
  Trash2
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [learningSkills, setLearningSkills] = useState([]);
  const [learnInput, setLearnInput] = useState("");

  const [teachingSkills, setTeachingSkills] = useState([]);
  const [teachInput, setTeachInput] = useState("");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check URL for verified skills
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verifiedSkill = params.get('verified_skill');
    if (verifiedSkill) {
      setTeachingSkills(prev => 
        prev.map(skill => 
          skill.name === verifiedSkill ? { ...skill, isVerified: true } : skill
        )
      );
      // Remove query param without reloading to clean up URL
      navigate('/profile-setup', { replace: true });
    }
  }, [location.search, navigate]);

  // Handlers for Learning Skills
  const handleLearnKeyDown = (e) => {
    if (e.key === 'Enter' && learnInput.trim() !== '') {
      e.preventDefault();
      setLearningSkills([...learningSkills, learnInput.trim()]);
      setLearnInput('');
    }
  };

  const removeLearningSkill = (index) => {
    setLearningSkills(learningSkills.filter((_, i) => i !== index));
  };

  // Handlers for Teaching Skills
  const handleTeachKeyDown = (e) => {
    if (e.key === 'Enter' && teachInput.trim() !== '') {
      e.preventDefault();
      const newSkillName = teachInput.trim();
      setTeachingSkills([...teachingSkills, { name: newSkillName, confidence: 5, isVerified: false }]);
      setTeachInput('');
    }
  };

  const removeTeachingSkill = (index) => {
    setTeachingSkills(teachingSkills.filter((_, i) => i !== index));
  };

  const updateConfidence = (index, value) => {
    const updated = [...teachingSkills];
    updated[index].confidence = value;
    setTeachingSkills(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      
      {/* Background Decorative Blurs */}
      <div className="absolute w-[400px] h-[400px] -right-16 -top-24 bg-[#10B981]/5 filter blur-[50px] rounded-full pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] -left-16 -bottom-24 bg-[#10B981]/5 filter blur-[50px] rounded-full pointer-events-none" />

      <DashboardNavbar logoOnly={true} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center w-full pb-32 pt-10 z-10">
        <div className="w-full max-w-[1280px] px-6 lg:px-8">
          
          {/* Page Title */}
          <div className="mb-10 space-y-2">
            <h1 className="font-black text-4xl text-[#0F172A]">Profile Setup</h1>
            <p className="text-[#64748B] text-lg">
              Customize your learning and teaching preferences to personalize your journey.
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            
            {/* Left Card: Learner Wishlist */}
            <div className="flex-1 bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-8 flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-2xl text-[#0F172A]">What do you want to learn?</h2>
              </div>

              {/* Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search skills (press Enter to add...)" 
                  value={learnInput}
                  onChange={(e) => setLearnInput(e.target.value)}
                  onKeyDown={handleLearnKeyDown}
                  className="w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all text-slate-700"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {learningSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-2 rounded-full">
                    <span className="font-medium text-sm text-[#0F172A]">{skill}</span>
                    <button onClick={() => removeLearningSkill(idx)} className="text-[#0F172A] hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {learningSkills.length === 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested skills to learn:</span>
                    <div className="flex flex-wrap gap-2">
                      {["Data Science", "Digital Marketing", "Public Speaking", "UI/UX Design"].map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLearningSkills([...learningSkills, s])}
                          className="px-4 py-2 bg-slate-50 hover:bg-[#10B981]/10 text-slate-600 hover:text-[#10B981] rounded-full text-sm font-semibold border border-slate-200 hover:border-[#10B981]/20 transition-all cursor-pointer"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Empty State / Add more */}
              <div 
                className="mt-2 border-2 border-dashed border-slate-200 rounded-xl py-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => {
                  const inputEl = document.querySelector('input[placeholder*="Search skills"]');
                  if(inputEl) inputEl.focus();
                }}
              >
                <span className="text-sm text-slate-400 font-medium">
                  {learningSkills.length === 0 ? "Add skills to build your learning profile" : "Add more skills to build your learning profile"}
                </span>
              </div>

              {/* Hint Box */}
              <div className="mt-auto bg-[#F8FAFC] rounded-lg p-4 flex gap-3 items-start border border-slate-100">
                <Sparkles className="w-5 h-5 text-[#10B981] mt-0.5 shrink-0" />
                <p className="text-sm text-slate-500 leading-relaxed">
                  This helps our AI find the best mentors for you based on your specific goals and skill gaps.
                </p>
              </div>

            </div>

            {/* Right Card: Mentor Expertise */}
            <div className="flex-1 bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-8 flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]">
                  <Share2 className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-2xl text-[#0F172A]">What can you teach?</h2>
              </div>

              {/* Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search expertise you can share (press Enter to add...)" 
                  value={teachInput}
                  onChange={(e) => setTeachInput(e.target.value)}
                  onKeyDown={handleTeachKeyDown}
                  className="w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all text-slate-700"
                />
              </div>

              {/* Added Expertise Items */}
              <div className="flex flex-col gap-4">
                
                {teachingSkills.map((skill, idx) => (
                  <div key={idx} className="bg-[#F8FAFC]/50 border border-slate-100 rounded-xl p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-[#0F172A] truncate pr-4">{skill.name}</h3>
                      <div className="flex items-center gap-3 shrink-0">
                        {skill.isVerified ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="font-semibold text-xs uppercase tracking-wider">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-xs uppercase tracking-wider text-slate-600">Unverified</span>
                          </div>
                        )}
                        <button onClick={() => removeTeachingSkill(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove Skill">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 relative">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Confidence Level</span>
                        <span className="text-[#10B981]">{skill.confidence} / 10</span>
                      </div>
                      
                      {/* Interactive Slider */}
                      <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full relative">
                        <div className="absolute top-0 left-0 h-full bg-[#10B981] rounded-full" style={{ width: `${skill.confidence * 10}%` }}></div>
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white shadow-sm pointer-events-none" 
                          style={{ left: `calc(${skill.confidence * 10}% - 8px)` }}
                        ></div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={skill.confidence} 
                          onChange={(e) => updateConfidence(idx, parseInt(e.target.value))}
                          className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-0 cursor-pointer h-6"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {teachingSkills.length === 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested skills to teach:</span>
                    <div className="flex flex-wrap gap-2">
                      {["UI/UX Design", "Python Development", "Data Science", "Web Development"].map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setTeachingSkills([...teachingSkills, { name: s, confidence: 5, isVerified: false }])}
                          className="px-4 py-2 bg-slate-50 hover:bg-[#10B981]/10 text-slate-600 hover:text-[#10B981] rounded-full text-sm font-semibold border border-slate-200 hover:border-[#10B981]/20 transition-all cursor-pointer"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Empty State / Add more */}
              <div 
                className="mt-2 border-2 border-dashed border-slate-200 rounded-xl py-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => {
                  const inputEl = document.querySelector('input[placeholder*="Search expertise"]');
                  if(inputEl) inputEl.focus();
                }}
              >
                <span className="text-sm text-slate-400 font-medium">
                  {teachingSkills.length === 0 ? "Add skills to build your teaching profile" : "Add more skills to build your teaching profile"}
                </span>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0px_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-[1280px] mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-5 h-5 shrink-0" />
            <span className="text-sm">
              You can update these preferences at any time in your profile settings.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="font-bold text-slate-900 px-6 py-3 hover:bg-slate-100 rounded-xl transition-colors">
              Back
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('onboarding_learning_skills', JSON.stringify(learningSkills));
                localStorage.setItem('onboarding_teaching_skills', JSON.stringify(teachingSkills));
                navigate('/privacy-policy?onboarding=true', { state: { onboarding: true } });
              }}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-xl shadow-[0px_10px_15px_-3px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
            >
              Complete Onboarding
            </button>
          </div>

        </div>
      </div>

      {/* Page Footer */}
      <footer className="w-full bg-[#022C22] py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-[#064E3B] pb-32">
        <p className="text-[#D1FAE5]/50 text-sm">
          © 2026 EduConnect. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link to="/privacy-policy" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/community-standards" className="text-[#D1FAE5]/50 hover:text-white transition-colors">Community Standards</Link>
          <a href="#" className="text-[#D1FAE5]/50 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </footer>

    </div>
  );
};

export default ProfileSetup;
