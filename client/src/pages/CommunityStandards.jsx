import React from 'react';
import { 
  HeartHandshake, 
  GraduationCap, 
  Shield, 
  Lock,
  Gavel
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';

const CommunityStandards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnboarding = new URLSearchParams(location.search).get('onboarding') === 'true' || location.state?.onboarding;



  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 flex flex-col">
      {/* Header - Top Navigation Bar */}
      <DashboardNavbar logoOnlyIfLoggedOut={true} logoOnly={isOnboarding} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1152px] mx-auto px-6 py-10 space-y-12">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#059669] to-[#064E3B] p-16 isolate">
          {/* Subtle shield watermark */}
          <div className="absolute -right-20 -bottom-24 opacity-10 -z-10 pointer-events-none">
            <Shield className="w-[300px] h-[300px] text-white" strokeWidth={1} />
          </div>

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-[#ECFDF5] tracking-widest uppercase mb-2">
              Core Principles
            </div>
            <h1 className="text-5xl font-black text-white leading-tight">
              Our Commitment to Safety & Integrity
            </h1>
            <p className="text-lg text-[#ECFDF5]/90 leading-relaxed pt-2">
              Welcome to EduConnect. Our community thrives on mutual respect, intellectual honesty, and professional growth. We've established these guidelines to foster a safe and productive environment for learners and educators worldwide.
            </p>
          </div>
        </section>

        {/* Core Pillar Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#D1FAE5] rounded-[16px] p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center mb-6">
              <HeartHandshake className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-3">Respectful Interaction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engage constructively with peers. Zero tolerance for harassment or discriminatory language.
            </p>
          </div>

          <div className="bg-white border border-[#D1FAE5] rounded-[16px] p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-3">Academic Integrity</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No plagiarism or unauthorized distribution of educational materials and copyrighted content.
            </p>
          </div>

          <div className="bg-white border border-[#D1FAE5] rounded-[16px] p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-3">Safety First</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Report suspicious activity. We prioritize a secure learning environment for students of all ages.
            </p>
          </div>

          <div className="bg-white border border-[#D1FAE5] rounded-[16px] p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-3">Privacy & Trust</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Respect boundaries. Do not share personal contact information or private data of others.
            </p>
          </div>
        </section>

        {/* Detailed Platform Rules */}
        <section className="bg-white border border-[#D1FAE5] rounded-[24px] p-12">
          <div className="flex items-center gap-3 mb-10">
            <Gavel className="w-6 h-6 text-[#059669]" />
            <h2 className="text-2xl font-bold text-[#0F172A]">Detailed Platform Rules</h2>
          </div>

          <div className="space-y-8">
            {/* Rule 01 */}
            <div className="flex gap-6 pb-8 border-b border-slate-100">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-[#059669]">01</span>
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-lg text-[#0F172A]">Honest Identity</h4>
                <p className="text-slate-600 leading-relaxed">
                  Use your real name or a consistent professional alias. Impersonating educators, staff, or other users is strictly prohibited and will result in immediate suspension.
                </p>
                <div className="inline-flex px-3 py-1 bg-[#ECFDF5] rounded-full text-xs font-medium italic text-[#047857]">
                  Requirement
                </div>
              </div>
            </div>

            {/* Rule 02 */}
            <div className="flex gap-6 pb-8 border-b border-slate-100">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-[#059669]">02</span>
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-lg text-[#0F172A]">Collaborative Spirit</h4>
                <p className="text-slate-600 leading-relaxed">
                  When helping others, provide explanations rather than just answers. Our goal is learning, not just task completion. Encourage peers who are struggling and share resources generously.
                </p>
                <div className="inline-flex px-3 py-1 bg-[#ECFDF5] rounded-full text-xs font-medium italic text-[#047857]">
                  Culture
                </div>
              </div>
            </div>

            {/* Rule 03 */}
            <div className="flex gap-6 pb-8 border-b border-slate-100">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-[#059669]">03</span>
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-lg text-[#0F172A]">Content Standards</h4>
                <p className="text-slate-600 leading-relaxed">
                  Ensure all shared files, links, and text are relevant to education. Promotional content, spam, and irrelevant advertisements are not permitted.
                </p>
                <div className="inline-flex px-3 py-1 bg-red-50 rounded-full text-xs font-medium italic text-red-600">
                  Restrictive
                </div>
              </div>
            </div>

            {/* Rule 04 */}
            <div className="flex gap-6">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-[#059669]">04</span>
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-lg text-[#0F172A]">Reporting Violations</h4>
                <p className="text-slate-600 leading-relaxed">
                  Use the 'Report' button on any content that violates these rules. Do not engage with trolls or rule-breakers directly; let our moderation team handle the situation.
                </p>
                <div className="inline-flex px-3 py-1 bg-[#ECFDF5] rounded-full text-xs font-medium italic text-[#047857]">
                  Action Item
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#ECFDF5] border-2 border-dashed border-[#A7F3D0] rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0F172A]">Ready to contribute?</h3>
            <p className="text-slate-600">
              By clicking below, you agree to uphold these standards in every interaction.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => navigate('/account-success')}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all flex-1 md:flex-none cursor-pointer"
            >
              I Understand & Agree
            </button>
            <button className="bg-white border border-[#D1FAE5] hover:bg-slate-50 text-slate-700 font-bold py-3 px-8 rounded-xl transition-all flex-1 md:flex-none">
              Download PDF
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#022C22] py-8 mt-12 w-full">
        <div className="max-w-[1152px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-100/50">
          <p>© 2026 EduConnect. All rights reserved.</p>
          <a href="#" className="hover:text-emerald-100 transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default CommunityStandards;
