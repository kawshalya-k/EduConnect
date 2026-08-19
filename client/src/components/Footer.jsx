import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/educonnect-logo.svg';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const columns = [
    { 
      title: "Student Center", 
      links: [
        { name: "Registration", path: "/register" }, 
        { name: "Discover Mentors", path: "/discovery" }
      ] 
    },
    { 
      title: "Mentorship", 
      links: [
        { name: "Mentor Onboarding", path: user ? "/dashboard" : "/login" }, 
        { name: "Mentor Verification Center", path: user ? "/verification" : "/login" }, 
        { name: "Mentor Guidelines", path: "/mentor-guidelines" }
      ] 
    },
    { 
      title: "Portal", 
      links: [
        { name: "About Us", path: "/about-us" }, 
        { name: "Privacy Policy", path: "/privacy-policy" }, 
        { name: "Terms of Service", path: "/terms-of-service" }, 
        { name: "Community Guidelines", path: "/community-standards" },
        { name: "Admin Portal", path: "/admin/login" },
        { name: "Contact Support", path: "/contact-support" },
        { name: "Help Center", path: "/help-center" }
      ] 
    }
  ];

  return (
    <footer className="bg-[#022C22] text-[#F8FAFC] py-20 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="EduConnect Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">EduConnect</span>
          </div>
          <p className="text-emerald-100/60 leading-relaxed text-sm">
            Empowering University students through peer-to-peer learning and community recognition.
          </p>
          <div className="flex gap-4">
            {['f', 'i', '@'].map((icon, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-[#10B981] transition-colors cursor-pointer">
                <span className="text-xs font-bold uppercase">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        {columns.map((column, i) => (
          <div key={i} className="space-y-6">
            <h4 className="text-[#10B981] font-bold uppercase tracking-wider text-xs">
              {column.title}
            </h4>
            <ul className="space-y-4">
              {column.links.map((link, j) => (
                <li key={j}>
                  <Link to={link.path} className="text-emerald-100/60 hover:text-white transition-colors cursor-pointer text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-emerald-900/50">
        <p className="text-emerald-100/40 text-xs">
          © {currentYear} EduConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;