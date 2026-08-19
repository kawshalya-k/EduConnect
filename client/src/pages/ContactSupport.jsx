import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  Send,
  HelpCircle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';

const FAQ_LINKS = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the Log In page, click "Forgot Password?", enter your email, and follow the link sent to your inbox to reset it safely.'
  },
  {
    question: 'How to get started as a mentor?',
    answer: 'Switch to Mentor Mode, navigate to the Verification Center, add your skills, and pass the corresponding quiz assessments to get verified.'
  },
  {
    question: 'Accessing certificates',
    answer: 'Certificates are automatically issued to your profile upon completing milestone sessions and verifying Expert-level skills.'
  },
  {
    question: 'How to earn badges?',
    answer: 'Badges are automatically awarded to your profile when you hit milestones, such as completing 5, 10, or 25 peer-to-peer mentoring sessions.'
  }
];

export default function ContactSupport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      console.log('Support Form Submitted:', formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    }
  };

  return (
    <div className="bg-[#F8FDFA] min-h-screen font-sans text-slate-900 flex flex-col">
      <DashboardNavbar logoOnlyIfLoggedOut={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#10B981]/10 to-transparent py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-[#064E3B] tracking-tight leading-none">
            Contact Support
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-normal max-w-2xl mx-auto">
            Need assistance with your learning journey? Our team of experts is here to help you solve any issues 24/7.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col lg:flex-row gap-12 flex-1">
        
        {/* Left Column: Contact Form */}
        <section className="flex-1 bg-white border border-[#10B981]/5 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100 flex flex-col justify-between">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-[#10B981]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-[#064E3B]">Message Sent!</h2>
                <p className="text-slate-500 text-base max-w-md">
                  Thank you for reaching out to EduConnect support. A team member will respond to your inquiry via email within 2 hours.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-xl transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700 block pl-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl px-4 py-4 text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10B981] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-slate-700 block pl-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl px-4 py-4 text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-slate-700 block pl-1">
                  Subject
                </label>
                <select 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl px-4 py-4 text-base text-slate-800 outline-none focus:border-[#10B981] transition-all cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Wallet & Coins">Wallet & Coins</option>
                  <option value="Session Feedback">Session Feedback</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-slate-700 block pl-1">
                  Message
                </label>
                <textarea 
                  id="message"
                  name="message"
                  required
                  rows="6"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl px-4 py-4 text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10B981] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all cursor-pointer text-lg"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </section>

        {/* Right Column: Sidebar Info */}
        <aside className="w-full lg:w-[389px] shrink-0 space-y-8">
          
          {/* Direct Support Card */}
          <div className="bg-[#064E3B] text-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6 relative overflow-hidden isolate">
            <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-emerald-500/10 blur-2xl rounded-full -z-10" />
            
            <h3 className="text-2xl font-bold tracking-tight text-white">Direct Support</h3>

            <div className="space-y-6">
              {/* Email Support */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-[#10B981]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[#D1FAE5]/60 text-xs font-semibold tracking-wider uppercase">Email Us</p>
                  <p className="text-white text-base font-bold">support@educonnect.com</p>
                </div>
              </div>

              {/* Live Chat Support */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-emerald-500/20 rounded-xl flex items-center justify-center text-[#10B981]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[#D1FAE5]/60 text-xs font-semibold tracking-wider uppercase">Live Chat</p>
                  <p className="text-white text-base font-bold">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links Card */}
          <div className="bg-white border border-[#10B981]/5 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#064E3B]">Quick Links</h3>
              
              <div className="divide-y divide-slate-100 flex flex-col">
                {FAQ_LINKS.map((faq, index) => (
                  <div key={index} className="py-3 flex flex-col">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full flex justify-between items-center text-slate-800 font-semibold text-sm hover:text-[#10B981] transition-colors cursor-pointer text-left py-1"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-90 text-[#10B981]' : ''}`} />
                    </button>
                    {activeFaq === index && (
                      <p className="text-xs text-slate-500 leading-relaxed pt-2 pl-1 bg-[#10B981]/5 p-2.5 rounded-lg mt-1 border border-[#10B981]/10">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/help-center')}
              className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#064E3B] font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Visit Help Center</span>
            </button>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
