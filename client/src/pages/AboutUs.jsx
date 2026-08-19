import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Handshake, 
  Award, 
  Target, 
  Eye, 
  TrendingUp, 
  UserCheck, 
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0FDF4] min-h-screen font-sans text-slate-900 flex flex-col">
      <DashboardNavbar logoOnlyIfLoggedOut={true} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Text */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#059669]/10 border border-[#059669]/20 rounded-full text-xs font-bold text-[#059669] tracking-wider uppercase">
            Our Story
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-[#064E3B] tracking-tight leading-[1.1]">
            Rooted in Sabaragamuwa, <br className="hidden md:inline" />
            Branching Globally.
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed">
            EduConnect was born within the lush valleys of Belihuloya to empower the students of Sabaragamuwa University with world-class digital learning resources.
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#059669]/10 rounded-xl shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              <span className="font-bold text-slate-800 text-sm">Student-Led Initiative</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="w-full lg:w-[568px] shrink-0 relative isolate">
          {/* Background Glow */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full -z-10" />
          
          <div className="bg-emerald-500/10 border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-[4/3] w-full max-w-[568px] mx-auto">
            <img 
              src="/images/SUSL_Image.jpg" 
              alt="Sabaragamuwa University Student Discussion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="bg-[#064E3B] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '5,000+', label: 'Active Students', icon: Users },
            { stat: '120+', label: 'Skill Courses', icon: BookOpen },
            { stat: '15+', label: 'Industry Partners', icon: Handshake },
            { stat: '98%', label: 'Success Rate', icon: Award }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-2 group">
                <div className="flex justify-center text-[#10B981]/60 group-hover:text-[#10B981] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white">{item.stat}</h3>
                <p className="text-emerald-100/50 text-xs font-bold tracking-wider uppercase">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Mission Card */}
          <div className="space-y-6 p-6 rounded-2xl hover:bg-slate-50/50 transition-colors">
            <div className="w-16 h-16 bg-[#059669]/10 rounded-2xl flex items-center justify-center text-[#059669]">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-[#064E3B] tracking-tight">Our Mission</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              To democratize access to high-quality educational resources and mentorship for every student in the Sabaragamuwa region, blending traditional academic values with cutting-edge technology. We believe geographic location should never be a barrier to excellence.
            </p>
          </div>

          {/* Vision Card */}
          <div className="space-y-6 p-6 rounded-2xl hover:bg-slate-50/50 transition-colors">
            <div className="w-16 h-16 bg-[#059669]/10 rounded-2xl flex items-center justify-center text-[#059669]">
              <Eye className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-[#064E3B] tracking-tight">Our Vision</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              To be Sri Lanka's top digital education platform that nurtures innovative, globally capable leaders grounded in local and sustainable values.
            </p>
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16">
        <div className="bg-[#064E3B] rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden isolate shadow-xl text-white">
          {/* Subtle bg watermark */}
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 -z-10" style={{ backgroundImage: "url('/images/SUSL_Image2.jpg')" }} />
          
          {/* Left Column: Timeline text */}
          <div className="flex-1 space-y-8 z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">The EduConnect Journey</h2>
            
            <div className="space-y-8 border-l border-emerald-500/30 pl-6 relative">
              {/* Year 2025 */}
              <div className="space-y-2 relative">
                <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#059669] border-4 border-[#064E3B]" />
                <h4 className="font-extrabold text-[#10B981] text-lg">2025</h4>
                <p className="text-[#CBD5E1] text-base leading-relaxed">
                  Founded by a group of passionate undergraduates at the Faculty of Computing who saw the need for localized digital resources.
                </p>
              </div>

              {/* Today */}
              <div className="space-y-2 relative">
                <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#10B981] border-4 border-[#064E3B]" />
                <h4 className="font-extrabold text-[#10B981] text-lg">Today</h4>
                <p className="text-[#CBD5E1] text-base leading-relaxed">
                  Evolving into a comprehensive LMS supporting students across all universities in Sri Lanka.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full lg:w-[488px] shrink-0 z-10">
            <div className="border-4 border-[#059669]/20 shadow-2xl rounded-2xl overflow-hidden aspect-[16/9] w-full max-w-[488px] mx-auto bg-emerald-950">
              <img 
                src="/images/SUSL_Image2.jpg" 
                alt="EduConnect Team Timeline"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Values We Live By */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#064E3B] tracking-tight">
            The Values We Live By
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Our culture is built on the principles that drive both academic excellence and community growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Sustainable Growth',
              desc: 'Developing solutions that are as enduring as the mountains that surround us.',
              icon: TrendingUp
            },
            {
              title: 'Radical Inclusion',
              desc: 'Ensuring every student, regardless of background, has a seat at the digital table.',
              icon: UserCheck
            },
            {
              title: 'Relentless Innovation',
              desc: 'Pushing the boundaries of what is possible in the EdTech landscape of Sri Lanka.',
              icon: Lightbulb
            }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#059669]/5 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-14 h-14 bg-[#16A34A]/10 rounded-full flex items-center justify-center text-[#059669]">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-xl text-[#0F172A]">{val.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Help Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 py-16">
        <div className="bg-[#064E3B] rounded-[24px] p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden isolate border border-white/5">
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -z-10" />
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to shape your future?
          </h2>
          
          <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
            Join the Sabaragamuwa premier learning community and start your journey towards excellence today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-slate-50 text-[#064E3B] font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-base"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => navigate('/discovery')}
              className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-base"
            >
              <span>Explore Mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
