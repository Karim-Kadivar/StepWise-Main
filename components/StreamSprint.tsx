
import React from 'react';

interface StreamSprintProps {
  onClose: () => void;
}

export const StreamSprint: React.FC<StreamSprintProps> = ({ onClose }) => {
  const features = [
    { title: "Stream Matcher", icon: "ri-mind-map", desc: "AI analysis of your strengths to find the perfect stream (Science, Commerce, Arts)." },
    { title: "Career Preview", icon: "ri-eye-2-line", desc: "Short snapshots of careers: tasks, salary, and scope." },
    { title: "Subject Fit", icon: "ri-puzzle-line", desc: "Compatibility score for Maths, Bio, Economics, etc." },
    { title: "Strength Report", icon: "ri-bar-chart-box-line", desc: "Breakdown of cognitive skills and study style." },
    { title: "Future Pathways", icon: "ri-road-map-line", desc: "Degrees and global opportunities for each stream." },
    { title: "Exam Checker", icon: "ri-checkbox-multiple-line", desc: "Eligibility check for entrance exams based on subject choice." },
    { title: "Parent Sync", icon: "ri-user-heart-line", desc: "Joint reports to align students and parents." },
    { title: "Confusion Bot", icon: "ri-question-answer-line", desc: "Instant answers to 'Math vs Bio?' type doubts." },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto transform transition-transform animate-slide-up">
      <div className="p-6">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        <div className="mt-8 mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i className="ri-rocket-2-line text-4xl text-white"></i>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">StreamSprint</h2>
          <p className="text-slate-400 text-lg">Your intelligent guide to choosing the right academic stream.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer group">
              <i className={`${feat.icon} text-3xl text-indigo-400 mb-3 block group-hover:scale-110 transition-transform`}></i>
              <h3 className="text-white font-bold mb-1">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to find your path?</h3>
            <p className="text-indigo-100 mb-6 text-sm">Take the comprehensive Stream Matcher test now.</p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                Start Assessment
            </button>
        </div>
      </div>
    </div>
  );
};
