import React from 'react';
import { Code2, Database, Cloud } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      title: "BS in Technology",
      desc: "4 year full-time program covering DSA, Web Dev, AI/ML and System Design.",
      icon: <Code2 className="w-8 h-8 text-scaler-red" />
    },
    {
      title: "Scaler DSML",
      desc: "Master Data Science and Machine Learning with live classes and mentorship.",
      icon: <Database className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Scaler DevOps",
      desc: "Learn cloud, DevOps and infrastructure engineering from industry experts.",
      icon: <Cloud className="w-8 h-8 text-green-500" />
    }
  ];

  return (
    <section id="programs" className="py-24 border-t border-white/5 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Our Programs</h2>
          <div className="w-20 h-1 bg-scaler-red mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <div key={idx} className="bg-dark-card p-8 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 group">
              <div className="bg-dark-lighter w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {prog.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">{prog.title}</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                {prog.desc}
              </p>
              <a href="#" className="font-semibold flex items-center text-scaler-red hover:underline group-hover:gap-2 transition-all">
                Learn More <span className="ml-1">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
