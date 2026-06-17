import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-8 text-left">
        <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          Master New Skills with Your <span className="text-[#10B981]">Peers.</span>
        </h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-lg">
          The AI-powered skill-sharing ecosystem for University students. Turn your knowledge into recognition and rewards.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all cursor-pointer text-sm inline-block text-center">
            Get Started with Your Student Email
          </Link>
          <Link to="/register" className="bg-white border-2 border-slate-200 hover:border-slate-300 font-bold py-4 px-8 rounded-xl transition-all cursor-pointer text-sm text-slate-700 inline-block text-center">
            Explore Mentors
          </Link>
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          <div className="flex -space-x-3">
            <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://ui-avatars.com/api/?name=Sara+D&background=0D8ABC&color=fff" alt="Student" />
            <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://ui-avatars.com/api/?name=John+M&background=F59E0B&color=fff" alt="Student" />
            <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://ui-avatars.com/api/?name=Alex+K&background=10B981&color=fff" alt="Student" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Join 1,200+ students already learning
          </p>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-end">
        <img 
          src="/images/hero_forest_desk.png" 
          alt="AI-powered skill sharing in a magical forest" 
          className="w-full max-w-lg rounded-[2rem] shadow-2xl object-cover aspect-square"
        />
      </div>
    </section>
  );
};

export default Hero;