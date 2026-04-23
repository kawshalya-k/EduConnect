import React from 'react';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-16">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#10B981] rounded" />
          <span className="text-white font-bold text-lg">EduConnect</span>
        </div>
        <p className="max-w-xs leading-relaxed">
          Building the future of peer-to-peer education at Sabaragamuwa University of Sri Lanka.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Platform</h4>
        <ul className="space-y-4 text-sm">
          <li><a href="#" className="hover:text-white transition">About Us</a></li>
          <li><a href="#" className="hover:text-white transition">Gemini AI Integration</a></li>
          <li><a href="#" className="hover:text-white transition">Skill Economy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Support</h4>
        <ul className="space-y-4 text-sm">
          <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          <li><a href="#" className="hover:text-white transition">Contact Faculty</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-xs">
      © 2026 EduConnect Project Team (22FIS0527). All Rights Reserved.
    </div>
  </footer>
);

export default Footer;