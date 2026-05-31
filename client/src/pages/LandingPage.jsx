import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Pillars from '../components/Pillars';
import Leaderboard from '../components/Leaderboard';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <Leaderboard />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;