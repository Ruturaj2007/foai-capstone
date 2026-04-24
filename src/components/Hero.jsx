import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Award, TrendingUp } from 'lucide-react';

// Simple counter hook for the counting up animation
const useCounter = (end, duration) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const StatItem = ({ end, prefix = '', suffix = '', label, icon: Icon, delay }) => {
  const count = useCounter(end, 2000);
  
  return (
    <div className={`p-6 bg-dark-lighter rounded-xl border border-white/5 flex flex-col items-center justify-center text-center animate-fade-in`} style={{ animationDelay: delay }}>
      <div className="mb-4 bg-white/5 p-3 rounded-full hidden sm:block">
        <Icon className="w-6 h-6 text-scaler-red" />
      </div>
      <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-zinc-400 font-medium">
        {label}
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col justify-center max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight animate-fade-in">
          Build the Future.<br className="hidden md:block"/>
          <span className="text-scaler-red"> One Line at a Time.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-sans max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          India's most outcome-driven tech college. Industry-first curriculum, world-class mentors, and guaranteed career outcomes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <a href="https://www.scaler.com/school-of-technology/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-scaler-red hover:bg-red-600 text-white px-8 py-4 rounded-md font-semibold transition-all text-lg text-center">
            Apply for 2025 Batch
          </a>
          <button onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-md font-semibold transition-all text-lg">
            Explore Programs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatItem end={2000} suffix="+" label="Students" icon={Users} delay="0.6s" />
        <StatItem end={95} suffix="%" label="Placement Rate" icon={TrendingUp} delay="0.7s" />
        <StatItem end={200} suffix="+" label="Hiring Partners" icon={Briefcase} delay="0.8s" />
        <StatItem end={18} prefix="₹" suffix="L" label="Avg Package" icon={Award} delay="0.9s" />
      </div>
    </section>
  );
};

export default Hero;
