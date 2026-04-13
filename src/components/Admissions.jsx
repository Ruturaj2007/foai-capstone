import React from 'react';

const Admissions = () => {
  const steps = [
    { step: 1, title: "Apply Online", desc: "Fill the application form" },
    { step: 2, title: "Take NSAT", desc: "Appear for our aptitude test" },
    { step: 3, title: "Interview", desc: "Technical and HR round" },
    { step: 4, title: "Enroll", desc: "Join the next batch" }
  ];

  return (
    <section id="admissions" className="py-24 bg-dark-lighter border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl font-heading font-bold mb-4">How to Join Scaler</h2>
          <div className="w-20 h-1 bg-scaler-red"></div>
        </div>

        <div className="relative">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-dark border-2 border-scaler-red text-scaler-red font-heading font-bold text-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(231,76,60,0.2)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admissions;
