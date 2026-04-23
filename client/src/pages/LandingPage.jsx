import React from 'react';
import Hero from '../components/Hero'; // Double-check this path!
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Pillars from '../components/Pillars';
import Leaderboard from '../components/Leaderboard';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Pillars />
      <Leaderboard />
      <Footer />

      
      
      
    </div>
  );
};

export default LandingPage;