import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Zap, 
  FileText, 
  Award, 
  ShieldAlert, 
  UserCheck, 
  Lock, 
  BrainCircuit, 
  ThumbsUp, 
  Sparkles,
  ChevronRight,
  Shield,
  BookOpen
} from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

export default function MentorGuidelines() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F0FDF4] min-h-screen font-sans text-slate-900 flex flex-col">
      <DashboardNavbar logoOnlyIfLoggedOut={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#064E3B] text-white m-6 md:m-10 p-12 md:p-16 isolate shadow-xl">
        {/* Abstract Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#064E3B]/60 to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-[#6EE7B7] tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            Official Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            Mentor Excellence Guidelines
          </h1>
          <p className="text-lg text-[#D1FAE5] font-medium leading-relaxed pt-2">
            Empowering mentors to shape the future of learning through integrity, passion, and pedagogical excellence.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="text-[#059669] hover:text-[#047857] font-semibold transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500">Mentors</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#10B981] font-bold">Guidelines</span>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-12 flex flex-col lg:flex-row gap-12 flex-1">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-28 bg-white border border-[#D1FAE5] shadow-lg shadow-slate-100/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-black text-[#065F46] uppercase tracking-widest">
              In This Guide
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Rules & Expectations', target: 'rules' },
                { label: 'Code of Conduct', target: 'conduct' },
                { label: 'Teaching Practices', target: 'practices' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(item.target)}
                  className="flex items-center gap-3 text-left w-full text-slate-600 hover:text-[#10B981] transition-all font-semibold text-sm cursor-pointer group"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#10B981] transition-colors" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 space-y-16">
          
          {/* Rules & Expectations Section */}
          <div id="rules" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center text-[#10B981]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Rules and Expectations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Consistency */}
              <div className="bg-white border border-[#ECFDF5] hover:shadow-lg transition-all p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-[#10B981]">
                  <Clock className="w-5 h-5" />
                  <h4 className="font-extrabold text-lg text-[#0F172A]">Consistency</h4>
                </div>
                <p className="text-slate-500 text-base leading-relaxed">
                  Mentors are expected to maintain a consistent schedule and provide at least 24 hours notice for any session changes.
                </p>
              </div>

              {/* Card 2: Responsiveness */}
              <div className="bg-white border border-[#ECFDF5] hover:shadow-lg transition-all p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-[#10B981]">
                  <Zap className="w-5 h-5" />
                  <h4 className="font-extrabold text-lg text-[#0F172A]">Responsiveness</h4>
                </div>
                <p className="text-slate-500 text-base leading-relaxed">
                  Aim to respond to student queries within 12 business hours to ensure learning momentum remains high.
                </p>
              </div>

              {/* Card 3: Progress Tracking */}
              <div className="bg-white border border-[#ECFDF5] hover:shadow-lg transition-all p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-[#10B981]">
                  <FileText className="w-5 h-5" />
                  <h4 className="font-extrabold text-lg text-[#0F172A]">Progress Tracking</h4>
                </div>
                <p className="text-slate-500 text-base leading-relaxed">
                  Update student progress logs after every milestone to provide transparent feedback for both the student and EduConnect.
                </p>
              </div>

              {/* Card 4: Subject Mastery */}
              <div className="bg-white border border-[#ECFDF5] hover:shadow-lg transition-all p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-[#10B981]">
                  <Award className="w-5 h-5" />
                  <h4 className="font-extrabold text-lg text-[#0F172A]">Subject Mastery</h4>
                </div>
                <p className="text-slate-500 text-base leading-relaxed">
                  Only mentor in subjects where you have verified expertise and up-to-date industry knowledge.
                </p>
              </div>
            </div>
          </div>

          {/* Code of Conduct Section */}
          <div id="conduct" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center text-[#10B981]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Code of Conduct
              </h2>
            </div>

            <div className="border-l-4 border-[#10B981] bg-[#10B981]/5 rounded-r-2xl p-8 space-y-6 shadow-sm">
              <p className="text-[#0F172A] text-lg font-medium italic leading-relaxed">
                "Integrity is the foundation of every educational relationship. Our code ensures a safe, respectful, and professional environment for all."
              </p>
              
              <div className="space-y-6 border-t border-[#10B981]/15 pt-6">
                {[
                  {
                    title: 'Zero Tolerance Policy',
                    desc: 'Harassment, discrimination, or any form of unprofessional behavior will result in immediate dismissal.',
                    icon: ShieldAlert
                  },
                  {
                    title: 'Professional Boundaries',
                    desc: 'Maintain formal communication channels provided by EduConnect. Avoid sharing personal contact information.',
                    icon: UserCheck
                  },
                  {
                    title: 'Confidentiality',
                    desc: 'Respect student privacy and keep all academic records and personal details strictly confidential.',
                    icon: Lock
                  }
                ].map((rule, idx) => {
                  const Icon = rule.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="text-[#10B981] shrink-0 mt-1">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-[#0F172A]">{rule.title}</h5>
                        <p className="text-slate-600 text-sm leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Teaching Best Practices Section */}
          <div id="practices" className="scroll-mt-28 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center text-[#10B981]">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Teaching Best Practices
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Active Learning',
                  desc: 'Encourage students to solve problems themselves rather than providing direct answers. Use the Socratic method to lead them to solutions.',
                  icon: BrainCircuit
                },
                {
                  title: 'Constructive Feedback',
                  desc: "Focus on the 'sandwich method'—positive reinforcement, constructive critique, followed by encouragement for future steps.",
                  icon: ThumbsUp
                },
                {
                  title: 'Personalized Approach',
                  desc: "Adapt your teaching style to match the student's learning pace and existing knowledge level. No two students are the same.",
                  icon: Sparkles
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white border border-[#ECFDF5] rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-20 h-20 bg-[#D1FAE5] rounded-2xl flex items-center justify-center shrink-0 text-[#10B981]">
                      <Icon className="w-10 h-10" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-xl text-[#0F172A]">{item.title}</h4>
                      <p className="text-slate-500 text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
