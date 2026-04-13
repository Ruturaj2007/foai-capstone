import React from 'react';
import { BookOpen, Smile, UserIcon, MessageSquare } from 'lucide-react';

const Features = () => {
  const cards = [
    {
      title: "FAQ Classifier",
      desc: "Instantly matches your question to our knowledge base.",
      icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
      color: "group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10"
    },
    {
      title: "Sentiment Analyzer",
      desc: "Detects your mood and adjusts the response perfectly.",
      icon: <Smile className="w-8 h-8 text-cyan-400" />,
      color: "group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10"
    },
    {
      title: "Smart Reply",
      desc: "AI generates a helpful, highly personalized response.",
      icon: <MessageSquare className="w-8 h-8 text-coral-400" />,
      color: "group-hover:border-coral-500/50 group-hover:bg-coral-500/10"
    },
    {
      title: "Human Escalation",
      desc: "Complex issues get routed to real humans immediately.",
      icon: <UserIcon className="w-8 h-8 text-green-400" />,
      color: "group-hover:border-green-500/50 group-hover:bg-green-500/10"
    }
  ];

  return (
    <section id="features" className="py-24 relative z-20 bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-16">
          How It <span className="text-cyan-400">Works</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`group glass p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 cursor-default ${card.color}`}
            >
              <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
