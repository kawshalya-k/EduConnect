import React from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

const LearnerDashboard = () => {
  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />

      <main className="flex flex-col items-center pt-8 pb-[293px] px-8 w-full max-w-[1280px] mx-auto z-0">
        <div className="flex flex-row justify-center items-start gap-8 w-full max-w-[1216px]">
          
          {/* Left Column */}
          <div className="flex flex-col items-start gap-6 w-[800px]">
            
            {/* Skill Coins Balance Card */}
            <div className="box-border flex flex-row items-center p-6 gap-6 w-full h-[131px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row justify-center items-center w-16 h-16 bg-[#10B77F]/20 rounded-full">
                {/* Coin Icon */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-6 text-[#10B77F]">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col items-start h-[82px]">
                <div className="flex flex-col items-start h-[38px]">
                  <span className="font-bold text-[30px] leading-[38px] flex items-center text-[#0F172A]">
                    1,250 Coins
                  </span>
                </div>
                <div className="flex flex-col items-start h-6">
                  <span className="font-medium text-base leading-6 flex items-center text-[#64748B]">
                    Skill Coins Balance
                  </span>
                </div>
                <div className="flex flex-col items-start h-5">
                  <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8]">
                    Earn coins by learning and mentoring others
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Session Card */}
            <div className="box-border flex flex-col items-start w-full h-[178px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl overflow-hidden">
              <div className="flex flex-row items-start w-[798px] h-[176px]">
                
                {/* Video Overlay Section */}
                <div className="flex flex-row justify-center items-center relative w-[266px] h-full min-h-[160px] bg-[#10B77F]/5">
                  <div className="absolute inset-0 bg-[#10B77F]/10 opacity-50 z-0"></div>
                  
                  <div className="flex flex-col items-center p-2 absolute h-8 left-4 right-4 bottom-4 bg-white/80 backdrop-blur-sm rounded-2xl z-10">
                    <span className="font-bold text-xs leading-4 flex items-center text-center tracking-[0.6px] uppercase text-[#10B77F]">
                      Online Session
                    </span>
                  </div>
                  
                  {/* Camera Icon */}
                  <div className="flex flex-col items-start w-[50px] h-[50px] z-20 text-[#10B77F]">
                     <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                       <path d="M4 6C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V8C18 6.89543 17.1046 6 16 6H4Z" />
                       <path d="M22 8L18 11V13L22 16V8Z" />
                     </svg>
                  </div>
                </div>

                {/* Session Details */}
                <div className="flex flex-col justify-between items-start p-6 w-[532px] h-[176px]">
                  <div className="flex flex-col items-start gap-2 w-full">
                    <h3 className="font-bold text-xl leading-7 flex items-center text-[#0F172A]">
                      Next Session: Dr. Sarah Mitchell
                    </h3>
                    <div className="flex flex-row items-center gap-2 h-6">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#10B77F]">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="font-medium text-base leading-6 flex items-center text-[#64748B]">
                        Tomorrow, 10:00 AM
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mt-6">
                    <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8]">
                      Meeting link will activate 5m before
                    </span>
                    <Link to="/session-room" className="relative flex flex-col justify-center items-center py-2.5 px-6 w-[147px] h-11 bg-[#10B77F] rounded-3xl hover:bg-[#059669] transition-colors shadow-[0_4px_6px_-4px_rgba(16,183,127,0.2),0_10px_15px_-3px_rgba(16,183,127,0.2)]">
                      <span className="font-bold text-base leading-6 text-center text-white z-10">
                        Join Session
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex flex-col items-start gap-4 w-full">
              <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                Quick Actions
              </h3>
              
              <div className="flex flex-row items-start gap-4 w-full h-[134px]">
                
                {/* Find Mentor Button */}
                <Link to="/find-mentor" className="box-border flex flex-col items-center py-6 px-[80px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    Find Mentor
                  </span>
                </Link>

                {/* My Sessions Button */}
                <Link to="/my-sessions" className="box-border flex flex-col items-center py-6 px-[77px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4">
                      <path d="M4 4H16C17.1 4 18 4.9 18 6V18C18 19.1 17.1 20 16 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 8L18 11V13L22 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    My Sessions
                  </span>
                </Link>

                {/* My Badges Button */}
                <Link to="/badges" className="box-border flex flex-col items-center py-6 px-[83px] gap-3 w-[256px] h-full bg-white border border-[#10B77F]/10 rounded-3xl hover:bg-emerald-50/50 transition-colors">
                  <div className="flex flex-row justify-center items-center w-12 h-12 bg-[#10B77F]/10 rounded-full text-[#10B77F]">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[10px] h-[20px]">
                      <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-base leading-6 text-center text-[#0F172A]">
                    My Badges
                  </span>
                </Link>

              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start gap-6 w-[384px]">
            
            {/* Leaderboard Preview */}
            <div className="box-border flex flex-col items-start p-6 gap-6 w-full h-[356px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row justify-between items-center w-full h-7">
                <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                  Top Mentors
                </h3>
                <a href="#" className="font-bold text-sm leading-5 flex items-center text-[#10B77F] hover:underline">
                  View all
                </a>
              </div>

              <div className="flex flex-col items-start gap-4 w-full h-[254px]">
                
                {/* Mentor 1 */}
                <div className="box-border flex flex-row items-center p-3 gap-3 w-full h-[74px] bg-[#10B77F]/5 border border-[#10B77F]/10 rounded-2xl relative">
                  <div className="absolute flex flex-row justify-center items-center py-1 px-0 w-6 h-6 -left-[7px] -top-[7px] bg-[#FACC15] shadow-sm rounded-full z-10">
                    <span className="font-bold text-[10px] leading-[15px] text-center text-white">1st</span>
                  </div>
                  <div className="box-border w-12 h-12 border-2 border-white shadow-sm rounded-full bg-slate-300 overflow-hidden flex-shrink-0 relative z-0">
                    {/* Placeholder image */}
                    <div className="w-full h-full bg-slate-400"></div>
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-1 h-[34px] z-0">
                    <span className="font-bold text-sm leading-[14px] text-[#0F172A]">Sarah Chen</span>
                    <span className="font-normal text-xs leading-4 text-[#64748B]">UX Strategy</span>
                  </div>
                  <div className="flex flex-col items-end w-[27px] h-[31px]">
                    <span className="font-bold text-xs leading-4 text-right text-[#10B77F]">2.4k</span>
                    <span className="font-normal text-[10px] leading-[15px] text-right text-[#94A3B8]">Coins</span>
                  </div>
                </div>

                {/* Mentor 2 */}
                <div className="box-border flex flex-row items-center p-3 gap-3 w-full h-[74px] rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="box-border w-12 h-12 border border-[#E2E8F0] rounded-full overflow-hidden flex-shrink-0 bg-slate-300">
                    <div className="w-full h-full bg-slate-400"></div>
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-1 h-[34px]">
                    <span className="font-bold text-sm leading-[14px] text-[#0F172A]">David Miller</span>
                    <span className="font-normal text-xs leading-4 text-[#64748B]">Python Dev</span>
                  </div>
                  <div className="flex flex-col items-end w-[27px] h-[31px]">
                    <span className="font-bold text-xs leading-4 text-right text-[#10B77F]">1.9k</span>
                    <span className="font-normal text-[10px] leading-[15px] text-right text-[#94A3B8]">Coins</span>
                  </div>
                </div>

                {/* Mentor 3 */}
                <div className="box-border flex flex-row items-center p-3 gap-3 w-full h-[74px] rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="box-border w-12 h-12 border border-[#E2E8F0] rounded-full overflow-hidden flex-shrink-0 bg-slate-300">
                    <div className="w-full h-full bg-slate-400"></div>
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-1 h-[34px]">
                    <span className="font-bold text-sm leading-[14px] text-[#0F172A]">Elena Rodriguez</span>
                    <span className="font-normal text-xs leading-4 text-[#64748B]">Product Mgmt</span>
                  </div>
                  <div className="flex flex-col items-end w-[27px] h-[31px]">
                    <span className="font-bold text-xs leading-4 text-right text-[#10B77F]">1.7k</span>
                    <span className="font-normal text-[10px] leading-[15px] text-right text-[#94A3B8]">Coins</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Learning Progress Card */}
            <div className="box-border flex flex-col items-start p-6 gap-4 w-full h-[246px] bg-white border border-[#10B77F]/5 shadow-sm rounded-3xl">
              <div className="flex flex-row items-center gap-2 w-full h-7">
                <div className="flex flex-col items-start w-5 h-3 text-[#10B77F]">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -mt-1">
                    <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7H22V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg leading-7 flex items-center text-[#0F172A]">
                  Learning Progress
                </h3>
              </div>

              <div className="flex flex-col items-start gap-4 w-full h-[152px]">
                <div className="flex flex-row justify-between items-end w-full h-9">
                  <span className="font-bold text-[30px] leading-[36px] flex items-center text-[#0F172A]">
                    75%
                  </span>
                  <span className="font-normal text-sm leading-5 flex items-center text-[#94A3B8] pb-1">
                    3 / 4 courses
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[75%] bg-[#10B77F] rounded-full"></div>
                </div>

                <span className="font-normal text-sm leading-5 flex items-center text-[#64748B]">
                  "Keep going! You're almost at your weekly goal."
                </span>

                <button className="box-border flex flex-row justify-center items-center py-2 px-0 w-full h-[38px] bg-[#10B77F]/5 border border-[#10B77F]/10 rounded-2xl hover:bg-[#10B77F]/10 transition-colors">
                  <span className="font-bold text-sm leading-5 text-center text-[#10B77F]">
                    View Learning Path
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnerDashboard;
