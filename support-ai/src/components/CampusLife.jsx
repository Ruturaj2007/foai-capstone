import React from 'react';
import { Trophy, Users, BookOpenCheck } from 'lucide-react';

const CampusLife = () => {
  const cards = [
    {
      title: "Hackathons and Events",
      desc: "Compete, build and win in regular campus and national events.",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />
    },
    {
      title: "Industry Mentorship",
      desc: "Learn directly from the best engineering leaders in the field.",
      icon: <BookOpenCheck className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "Student Community",
      desc: "Collaborate and grow alongside 2000+ ambitious peers.",
      icon: <Users className="w-6 h-6 text-purple-500" />
    }
  ];

  return (
    <section id="campus" className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Life at Scaler</h2>
          <div className="w-16 h-1 bg-scaler-red"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item, idx) => (
            <div key={idx} className="bg-dark-lighter p-8 rounded-xl border border-white/5 flex gap-4">
              <div className="bg-white/5 p-3 rounded-lg h-fit">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusLife;
