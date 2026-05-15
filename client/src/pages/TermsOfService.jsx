import React from 'react';
import { 
  Info, 
  Users, 
  Coins, 
  BookOpen, 
  Scale,
  Shield,
  UserCheck,
  AlertCircle,
  Clock,
  Lock,
  CheckSquare,
  TriangleAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#F0FDF4] min-h-screen font-sans text-slate-900 relative">
      {/* Header - Top Navigation Bar */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#0F172A]">EduConnect</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm text-[#0F172A]">Alex Rivera</span>
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=0F172A&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-10 py-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Aside - Sidebar Table of Contents */}
        <aside className="w-[292px] shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4">On this page</h3>
              <nav className="flex flex-col gap-1">
                <a href="#intro" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-colors">
                  <Info className="w-[18px] h-[18px] text-[#10B981]" />
                  1. Introduction
                </a>
                <a href="#conduct" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-colors">
                  <Users className="w-[18px] h-[18px] text-[#10B981]" />
                  2. User Conduct
                </a>
                <a href="#coins" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-colors">
                  <Coins className="w-[18px] h-[18px] text-[#10B981]" />
                  3. Skill Coins Policy
                </a>
                <a href="#mentorship" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-colors">
                  <BookOpen className="w-[18px] h-[18px] text-[#10B981]" />
                  4. Mentorship Guidelines
                </a>
                <a href="#legal" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-colors">
                  <Scale className="w-[18px] h-[18px] text-[#10B981]" />
                  5. Legal Terms
                </a>
              </nav>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
              <div className="text-xs font-medium text-[#0F172A] mb-1">Last Updated</div>
              <div className="text-sm font-bold text-[#0F172A]">October 24, 2023</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[876px] space-y-16 pb-32">
          
          {/* Hero Header */}
          <div className="space-y-4">
            <h1 className="text-[48px] font-extrabold tracking-tight text-[#0F172A] leading-none">Terms of Service</h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Please review these terms carefully. By using EduConnect, you agree to our Nature-Tech inspired community standards and operational framework.
            </p>
          </div>

          {/* Section 1: Introduction & Overview */}
          <section id="intro" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#10B981]">01</span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Introduction & Overview</h2>
            </div>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                Welcome to EduConnect, a decentralized academic growth platform. These Terms of Service ("Terms") govern your access to and use of the EduConnect website, mobile applications, and services. Our platform is built on the principle of symbiotic knowledge exchange, where technology facilitates natural human connection and intellectual flourishing.
              </p>
              <p>
                By creating an account or using any part of the service, you agree to be bound by these terms. If you do not agree, you must cease all use of the platform immediately. We reserve the right to update these terms at any time, with notice provided via the platform's primary notification system.
              </p>
            </div>
          </section>

          {/* Section 2: User Conduct & Community Standards */}
          <section id="conduct" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#10B981]">02</span>
              <h2 className="text-2xl font-bold text-[#0F172A]">User Conduct & Community Standards</h2>
            </div>
            
            <div className="space-y-6">
              {/* Academic Integrity Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 relative overflow-hidden isolate">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full -z-10"></div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">Academic Integrity</h3>
                <p className="text-slate-700 leading-relaxed">
                  EduConnect is a tool for learning, not for academic dishonesty. Users must not use the platform to complete exams for others, write graded assignments, or engage in any form of plagiarism. We maintain a zero-tolerance policy for contract cheating.
                </p>
              </div>

              {/* Grid Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="w-4 h-4 text-slate-700" />
                    <h4 className="font-bold text-slate-700">Professional Behavior</h4>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Maintain respectful, constructive, and inclusive communication. Treat all mentors and peers with dignity regardless of their background or skill level.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-slate-700" />
                    <h4 className="font-bold text-slate-700">Platform Rules</h4>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    No spamming, scraping, or unauthorized access. Users may not maintain multiple accounts to manipulate the internal economy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Skill Coin Usage Policy */}
          <section id="coins" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#10B981]">03</span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Skill Coin Usage Policy</h2>
            </div>
            
            <p className="text-slate-700 leading-relaxed">
              Skill Coins (SC) are the internal utility tokens of the EduConnect ecosystem. They are designed to quantify value exchange within the platform.
            </p>

            <ul className="space-y-2 pl-4">
              <li className="text-slate-700 leading-relaxed">
                <span className="font-bold">Earning SC:</span> Users earn coins by providing mentorship, contributing to open-source project logs, or achieving certified learning milestones.
              </li>
              <li className="text-slate-700 leading-relaxed">
                <span className="font-bold">Spending SC:</span> Coins can be redeemed for 1-on-1 mentorship sessions, premium learning resources, or platform-exclusive digital credentials.
              </li>
              <li className="text-slate-700 leading-relaxed">
                <span className="font-bold">No Cash Value:</span> Skill Coins have no external monetary value and cannot be withdrawn or traded on secondary markets. They are non-transferable between accounts except through approved platform transactions.
              </li>
              <li className="text-slate-700 leading-relaxed">
                <span className="font-bold">Refund Policy:</span> SC spent on mentorship sessions are held in escrow until the session is marked as completed by both parties. Dispute resolutions regarding SC will be handled by the EduConnect Moderator Council.
              </li>
            </ul>

            <div className="bg-[#ECFDF5] border border-emerald-500/20 rounded-xl p-5 flex gap-4 mt-6">
              <TriangleAlert className="w-[22px] h-[19px] text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                Any attempt to farm Skill Coins through bot activity or collusive "fake" sessions will result in immediate permanent suspension and forfeiture of all accumulated coins.
              </p>
            </div>
          </section>

          {/* Section 4: Mentorship Guidelines */}
          <section id="mentorship" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#10B981]">04</span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Mentorship Guidelines</h2>
            </div>
            
            <p className="text-slate-700 leading-relaxed">
              Our mentorship program is the heart of the EduConnect experience. Both Mentors and Mentees must adhere to the following quality standards:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-[18px] h-[18px] text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1">Punctuality & Cancellation</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Sessions must be cancelled at least 12 hours in advance. No-shows by mentors result in automatic SC refund and a rating penalty. No-shows by mentees result in SC forfeiture.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-[18px] h-[18px] text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1">Confidentiality</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    All personal academic materials, private research, and conversation history shared during a session must remain confidential between the parties involved.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <CheckSquare className="w-[18px] h-[18px] text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1">Session Quality</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Mentors are expected to provide clear, actionable guidance. Sessions that fail to meet reasonable quality standards (poor connectivity, lack of preparation) are subject to partial or full SC refund.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Dispute Resolution & Legal Terms */}
          <section id="legal" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#10B981]">05</span>
              <h2 className="text-2xl font-bold text-[#0F172A]">Dispute Resolution & Legal Terms</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#0F172A] mb-2">Arbitration Agreement</h4>
                <p className="text-slate-700 leading-relaxed">
                  You agree that any dispute between you and EduConnect arising out of or relating to these Terms will be settled by binding individual arbitration. You waive your right to participate in a class-action lawsuit or class-wide arbitration.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0F172A] mb-2">Limitation of Liability</h4>
                <p className="text-slate-700 leading-relaxed">
                  EduConnect is provided "as is" without any warranties of any kind. In no event shall EduConnect be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0F172A] mb-2">Governing Law</h4>
                <p className="text-slate-700 leading-relaxed">
                  These terms are governed by the laws of the jurisdiction in which EduConnect is headquartered, without regard to conflict of law principles.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-slate-200 bg-[#F0FDF4] pb-24 pt-10">
        <div className="max-w-[876px] mx-auto px-10">
          <div className="bg-[#064E3B] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden isolate shadow-xl border border-white/5">
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Ready to grow your skills?</h3>
              <p className="text-emerald-100/70 text-sm">
                By clicking 'I Accept the Terms', you acknowledge that you have read and understood our Terms of Service.
              </p>
            </div>
            <button 
              onClick={() => navigate('/community-standards')}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-emerald-900/50 transition-all shrink-0 cursor-pointer"
            >
              I Accept the Terms
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#022C22] py-8 border-t border-[#064E3B]">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/50">
          <p>© 2026 EduConnect. All rights reserved.</p>
          <a href="#" className="hover:text-emerald-100 transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
