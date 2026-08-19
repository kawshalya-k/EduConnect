import React from 'react';
import {
  Database,
  Cpu,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Sparkles,
  Lock,
  UserMinus,
  Shield,
  CheckCircle2,
  Mail,
  MapPin
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnboarding = new URLSearchParams(location.search).get('onboarding') === 'true' || location.state?.onboarding;



  const lastUpdatedDate = "May 10, 2026";

  return (
    <div className="bg-[#F1F5F9] min-h-screen font-sans text-slate-900 relative">
      {/* Header - Top Navigation Bar */}
      <DashboardNavbar logoOnlyIfLoggedOut={true} logoOnly={isOnboarding} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-10 py-12 flex flex-col lg:flex-row gap-16 relative">

        {/* Aside - Sticky Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-28 bg-white border border-slate-200 shadow-sm rounded-2xl p-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 pb-3 pt-1">Contents</h3>
            <nav className="flex flex-col gap-1">
              <a href="#data-collection" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                <Database className="w-4 h-4 text-slate-500" />
                1. Data Collection
              </a>
              <a href="#ai-usage" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                <Cpu className="w-4 h-4 text-slate-500" />
                2. AI Usage & Processing
              </a>
              <a href="#data-sharing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                3. Data Sharing & Security
              </a>
              <a href="#user-rights" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                <UserCheck className="w-4 h-4 text-slate-500" />
                4. User Rights
              </a>
              <a href="#contact" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                5. Contact & Support
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[732px] space-y-20 pb-32">

          {/* Hero Header */}
          <div className="border-b border-slate-200 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-5xl font-black tracking-tight text-[#0F172A]">Privacy Policy</h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                At EduConnect, we bridge the gap between academic excellence and technological innovation. This policy outlines how we protect your academic data and personal information in our AI-driven ecosystem.
              </p>
            </div>
            <div className="text-sm font-medium text-[#10B981]">
              Last Updated: {lastUpdatedDate}
            </div>
          </div>

          {/* Section 1: Data Collection */}
          <section id="data-collection" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-[#10B981]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A]">1. Data Collection</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              EduConnect collects various forms of data to ensure the most personalized and effective academic experience. This includes:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Academic Credentials", desc: "Institutional emails, student IDs, and verification from partner universities." },
                { title: "Course Material", desc: "Syllabus data, lecture notes, and research papers uploaded for semantic analysis." },
                { title: "Interaction Data", desc: "Search queries, prompt history, and AI response ratings to improve accuracy." },
                { title: "Device Information", desc: "IP addresses, browser types, and operating system data for security monitoring." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-base text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: AI Usage & Processing */}
          <section id="ai-usage" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#10B981]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A]">2. AI Usage & Processing</h2>
            </div>

            <div className="bg-[#065F46] rounded-3xl p-8 shadow-xl relative overflow-hidden isolate border border-white/5">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 text-[#10B981]" />
                  <h3 className="text-xl font-bold">Nature-Tech Semantic Processing</h3>
                </div>
                <p className="text-emerald-100/80 leading-relaxed text-base mb-6">
                  Our platform utilizes a hybrid architecture featuring Google's Gemini Pro for generative insights and Pinecone for vector-based semantic retrieval.
                </p>

                <div className="space-y-6 pt-2">
                  <div className="flex gap-4">
                    <div className="font-bold text-[#10B981] mt-0.5">01.</div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Gemini Integration</h4>
                      <p className="text-sm text-emerald-100/60 leading-relaxed">Data is processed in real-time to generate summaries and answer complex queries. No data is used to train Google's foundational models.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-bold text-[#10B981] mt-0.5">02.</div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Pinecone Vector Storage</h4>
                      <p className="text-sm text-emerald-100/60 leading-relaxed">Academic content is converted into multi-dimensional embeddings and stored in secure Pinecone indexes for lightning-fast semantic search.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Data Sharing & Security */}
          <section id="data-sharing" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A]">3. Data Sharing & Security</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Lock className="w-5 h-5 text-[#10B981] mb-4" />, title: "End-to-End Encryption", desc: "All data in transit is encrypted using TLS 1.3 and stored with AES-256 encryption at rest." },
                { icon: <UserMinus className="w-5 h-5 text-[#10B981] mb-4" />, title: "Anonymized Processing", desc: "Personal identifiers are stripped before academic content is indexed for peer-to-peer discovery features." },
                { icon: <Shield className="w-5 h-5 text-[#10B981] mb-4" />, title: "Third-Party Audits", desc: "Regular penetration testing and compliance audits ensure our Pinecone and cloud infrastructure remains resilient." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                  {item.icon}
                  <h4 className="font-bold text-base text-[#0F172A] mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: User Rights */}
          <section id="user-rights" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A]">4. User Rights</h2>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 space-y-6">
              <p className="text-slate-600 leading-relaxed text-base">
                As a user of EduConnect, you retain full control over your data. In accordance with GDPR and CCPA guidelines, you have the right to:
              </p>

              <div className="space-y-4">
                {[
                  "Request a full export of all personal and academic data associated with your account.",
                  "Request immediate deletion of your profile, search history, and uploaded vector embeddings.",
                  "Opt-out of data collection for specific AI training or feature enhancement programs."
                ].map((text, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl items-start">
                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5: Contact & Support */}
          <section id="contact" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#10B981]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A]">5. Contact & Support</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Need Clarification Card */}
              <div className="bg-[#064E3B] rounded-3xl p-8 relative overflow-hidden isolate shadow-lg">
                <div className="absolute inset-0 bg-emerald-500/5 blur-xl -z-10"></div>
                <h3 className="text-2xl font-black text-white mb-4">Need Clarification?</h3>
                <p className="text-emerald-50/90 leading-relaxed mb-8">
                  Our legal and data privacy teams are available 24/7 to answer your concerns regarding university data compliance.
                </p>
                <button className="flex items-center justify-center gap-2 w-full bg-[#10B77F] hover:bg-[#0ea5e9] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                  <Mail className="w-4 h-4" />
                  privacy@educonnect.com
                </button>
              </div>

              {/* Mailing Address Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-5 h-5 text-[#10B981]" />
                </div>
                <h4 className="font-bold text-lg text-[#0F172A] mb-4">Official Mailing Address</h4>
                <address className="not-italic text-slate-600 leading-loose">
                  EduConnect Team<br />
                  Faculty of Computing<br />
                  Sabaragamuwa University of Sri Lanka<br />
                  Belihuloya<br />
                  70140
                </address>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Bottom Action Bar */}
      {isOnboarding && (
        <div className="border-t border-slate-200 bg-[#F1F5F9] pb-24 pt-10">
          <div className="max-w-[1040px] mx-auto px-6">
            <div className="bg-[#064E3B] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden isolate shadow-xl border border-white/5">
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Ready to grow your skills?</h3>
                <p className="text-emerald-100/70 text-sm">
                  By clicking 'I Accept the Terms', you acknowledge that you have read and understood our Terms of Service.
                </p>
              </div>
              <button
                onClick={() => navigate(`/terms-of-service${isOnboarding ? '?onboarding=true' : ''}`, { state: { onboarding: isOnboarding } })}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-emerald-900/50 transition-all shrink-0 cursor-pointer"
              >
                I Accept the Terms
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
