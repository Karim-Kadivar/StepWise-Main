

import React, { useState, useEffect, useRef } from 'react';
import { UserStage, ToolType } from './types';
import { WiseBot } from './components/WiseBot';
import { InterViewer } from './components/InterViewer';
import { ExploreHub } from './components/ExploreHub';
import { Visualizer } from './components/Visualizer';
import { CompareWise } from './components/CompareWise';
import { LiveConversation } from './components/LiveConversation';
import { MentorMate } from './components/MentorMate';
import { WiseVault } from './components/WiseVault';
import { ResuCraft } from './components/ResuCraft';
import { PlayLab } from './components/PlayLab';
import { LottiePlayer } from './components/LottiePlayer';
import { StreamSprint } from './components/StreamSprint';

const stages = [
  { id: UserStage.StreamSprint, title: 'StreamSprint', subtitle: '11th-12th Grade', icon: 'ri-rocket-2-line', color: 'from-indigo-500 to-purple-600', borderColor: 'hover:border-indigo-500/50' },
  { id: UserStage.CourseCompass, title: 'CourseCompass', subtitle: 'College Students', icon: 'ri-compass-3-line', color: 'from-blue-500 to-cyan-500', borderColor: 'hover:border-blue-500/50' },
  { id: UserStage.SkillBridge, title: 'SkillBridge', subtitle: 'Post Graduates', icon: 'ri-building-4-line', color: 'from-orange-500 to-amber-500', borderColor: 'hover:border-orange-500/50' },
  { id: UserStage.RoleRadar, title: 'RoleRadar', subtitle: 'Job Seekers', icon: 'ri-focus-3-line', color: 'from-emerald-400 to-teal-500', borderColor: 'hover:border-emerald-500/50' },
  { id: UserStage.CareerPivot, title: 'CareerPivot', subtitle: 'Career Switchers', icon: 'ri-loop-right-line', color: 'from-rose-500 to-pink-600', borderColor: 'hover:border-rose-500/50' },
];

const tools = [
  { id: ToolType.ResuCraft, title: 'ResuCraft', icon: 'ri-file-text-line', desc: 'AI-powered resume builder', bg: 'resucraft-bg', shadow: 'resucraft-shadow' },
  { id: ToolType.PlayLab, title: 'PlayLab', icon: 'ri-gamepad-line', desc: 'Gamified career learning', bg: 'playlab-bg', shadow: 'playlab-shadow' },
  { id: ToolType.QuizWise, title: 'QuizWise', icon: 'ri-question-line', desc: 'Adaptive passion quizzes', bg: 'quizwise-bg', shadow: 'quizwise-shadow' },
  { id: ToolType.WiseBot, title: 'WiseBot', icon: 'ri-robot-line', desc: '24/7 AI Career Mentor', bg: 'wisebot-bg', shadow: 'wisebot-shadow' },
  { id: ToolType.MentorMate, title: 'MentorMate', icon: 'ri-team-line', desc: 'Connect with experts', bg: 'mentormate-bg', shadow: 'mentormate-shadow' },
  { id: ToolType.WiseVault, title: 'WiseVault', icon: 'ri-safe-line', desc: 'Track your progress', bg: 'wisevault-bg', shadow: 'wisevault-shadow' },
  { id: ToolType.InterViewer, title: 'InterViewer', icon: 'ri-camera-lens-line', desc: 'AI Mock Interviews', bg: 'bg-gradient-to-br from-teal-400 to-teal-600', shadow: 'hover:shadow-teal-500/30' },
  { id: ToolType.Visualizer, title: 'Visualizer', icon: 'ri-image-edit-line', desc: 'Dream workspace gen', bg: 'bg-gradient-to-br from-pink-500 to-rose-500', shadow: 'hover:shadow-pink-500/30' },
  { id: ToolType.LiveConversation, title: 'Live Coach', icon: 'ri-mic-line', desc: 'Real-time voice chat', bg: 'bg-gradient-to-br from-violet-500 to-purple-600', shadow: 'hover:shadow-violet-500/30' },
  { id: ToolType.ExploreHub, title: 'ExploreHub', icon: 'ri-earth-line', desc: 'Global discovery', bg: 'bg-gradient-to-br from-sky-400 to-blue-500', shadow: 'hover:shadow-sky-500/30' },
  { id: ToolType.CompareWise, title: 'CompareWise', icon: 'ri-scales-3-line', desc: 'Compare paths', bg: 'bg-gradient-to-br from-amber-400 to-orange-500', shadow: 'hover:shadow-amber-500/30' },
];

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.None);
  const [activeStage, setActiveStage] = useState<UserStage | null>(null);
  const [showBot, setShowBot] = useState(false);
  const chartRefs = useRef<{[key: string]: HTMLCanvasElement | null}>({});

  // Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTool]);

  // Chart Logic
  useEffect(() => {
    if (activeTool !== ToolType.None) return;
    const initCharts = () => {
      if (typeof (window as any).Chart === 'undefined') return;
      const config = { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      };

      if (chartRefs.current['regret'] && !(chartRefs.current['regret'] as any).chart) {
        new (window as any).Chart(chartRefs.current['regret'], {
            type: 'doughnut',
            data: { labels: ['Happy', 'Unhappy'], datasets: [{ data: [27, 73], backgroundColor: ['#10B981', '#EF4444'], borderWidth: 0 }] },
            options: { ...config, cutout: '75%' }
        });
      }
      if (chartRefs.current['success'] && !(chartRefs.current['success'] as any).chart) {
        new (window as any).Chart(chartRefs.current['success'], {
            type: 'bar',
            data: { labels: ['A', 'B'], datasets: [{ data: [35, 87], backgroundColor: ['#94a3b8', '#10B981'], borderRadius: 4 }] },
            options: config
        });
      }
      if (chartRefs.current['cost'] && !(chartRefs.current['cost'] as any).chart) {
        new (window as any).Chart(chartRefs.current['cost'], {
            type: 'line',
            data: { labels: ['A', 'B'], datasets: [{ data: [47, 12], borderColor: '#3B82F6', tension: 0.4, fill: true, backgroundColor: 'rgba(59, 130, 246, 0.2)' }] },
            options: config
        });
      }
    };
    setTimeout(initCharts, 500);
  }, [activeTool]);

  const renderActiveTool = () => {
    switch (activeTool) {
        case ToolType.MentorMate: return <MentorMate />;
        case ToolType.WiseVault: return <WiseVault />;
        case ToolType.ResuCraft: return <ResuCraft />;
        case ToolType.PlayLab: return <PlayLab />;
        case ToolType.InterViewer: return <InterViewer />;
        case ToolType.Visualizer: return <Visualizer />;
        case ToolType.ExploreHub: return <ExploreHub />;
        case ToolType.CompareWise: return <CompareWise />;
        case ToolType.LiveConversation: return <LiveConversation />;
        case ToolType.QuizWise: return <div className="text-white text-center p-20 flex flex-col items-center"><LottiePlayer url="https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json" style={{width: 200, height: 200}} /><h2 className="text-3xl font-bold mt-4">QuizWise Loading...</h2></div>;
        default: return null;
    }
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTool(ToolType.None)}>
                <img src="https://huggingface.co/spaces/Akshansh115/logo/resolve/main/images/StepWiseLogo.jpg" alt="Logo" className="h-10 rounded-lg group-hover:scale-105 transition-transform" />
                <span className="text-2xl font-pacifico text-white group-hover:text-indigo-400 transition-colors">StepWise</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
                {['Home', 'Features', 'Tools', 'Reviews'].map((item) => (
                    <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">{item}</button>
                ))}
                <button onClick={() => scrollToSection('features')} className="gradient-bg px-6 py-2 rounded-full text-white font-bold hover:shadow-[0_0_20px_rgba(46,168,248,0.5)] hover:scale-105 transition-all btn-hover shadow-lg">Get Started</button>
            </div>
        </div>
      </nav>

      {activeTool === ToolType.None ? (
        <>
            {/* Hero */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed scale-105 animate-[pulse-slow_15s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900"></div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                    <div className="inline-block px-6 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-8 animate-slide-up backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]">✨ AI-Powered Career Intelligence</div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-8 animate-slide-up drop-shadow-2xl">A Step Ahead, <br/><span className="gradient-text">Wisely</span></h1>
                    <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl animate-slide-up leading-relaxed delay-100 drop-shadow-lg font-light">Navigate your career with confidence using next-gen AI tools.</p>
                    <div className="flex flex-col sm:flex-row gap-6 animate-slide-up delay-200">
                        <button onClick={() => scrollToSection('features')} className="gradient-bg px-10 py-5 rounded-full text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.6)] btn-hover flex items-center justify-center gap-3"><i className="ri-rocket-fill"></i> Start Your Journey</button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal-on-scroll">
                        <h2 className="text-4xl font-bold mb-4">Ctrl + Z Your Career</h2>
                        <p className="text-slate-400">Data-driven insights to back your next move.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Undo', icon: 'ri-arrow-go-back-line', color: 'text-red-500', stat: '73% Stuck', refKey: 'regret' },
                            { title: 'Rethink', icon: 'ri-lightbulb-flash-line', color: 'text-green-500', stat: '2.5x Success', refKey: 'success' },
                            { title: 'Rebuild', icon: 'ri-building-3-line', color: 'text-blue-500', stat: 'Save ~35k', refKey: 'cost' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-all hover:shadow-lg group reveal-on-scroll">
                                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 group-hover:${stat.color.replace('500','400')} transition-colors`}><i className={`${stat.icon} ${stat.color} text-3xl`}></i> {stat.title}</h3>
                                <div className="h-48 relative mb-4"><canvas ref={el => { chartRefs.current[stat.refKey] = el; }}></canvas></div>
                                <p className="text-center text-slate-300 font-medium">{stat.stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Section (Horizontal Scroll) */}
            <section id="features" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900/10 to-slate-900 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 reveal-on-scroll">
                        <h2 className="text-5xl font-bold mb-4">Where Are You On Your <span className="gradient-text">Journey?</span></h2>
                        <p className="text-slate-400">Tailored guidance for every stage.</p>
                    </div>
                    
                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto gap-8 pb-16 snap-x hide-scrollbar px-4 sm:px-6 lg:px-8 lg:justify-center">
                        {stages.map((stage, i) => (
                            <div 
                                key={stage.id} 
                                onClick={() => setActiveStage(stage.id)}
                                className={`reveal-on-scroll min-w-[340px] md:min-w-[400px] bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-[2rem] transition-all duration-500 cursor-pointer group hover:shadow-2xl ${stage.borderColor} hover:-translate-y-2 relative overflow-hidden snap-center flex flex-col`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12"><i className={`${stage.icon} text-[10rem]`}></i></div>
                                
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl`}>
                                    <i className={`${stage.icon} text-4xl text-white`}></i>
                                </div>
                                
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold mb-2 text-white">{stage.subtitle}</h3>
                                    <h4 className={`text-xl font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent mb-6`}>{stage.title}</h4>
                                    <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed group-hover:text-slate-300">Tailored guidance specifically for this stage.</p>
                                </div>
                                
                                <button className="text-sm font-bold text-white flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 w-fit transition-all group-hover:gap-3 mt-4">
                                    Explore Path <i className="ri-arrow-right-line"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WiseKit Tools Section (Grid) */}
            <section id="tools" className="py-24 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-5xl font-bold mb-6">WiseKit</h2>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto">Create. Connect. Conquer.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tools.map((tool, i) => (
                            <div 
                                key={tool.id} 
                                onClick={() => setActiveTool(tool.id)}
                                className={`bg-slate-800/80 p-6 rounded-[2rem] border border-slate-700 cursor-pointer card-hover ${tool.shadow} group relative overflow-hidden reveal-on-scroll`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg.startsWith('bg-') ? '' : tool.bg.replace('bg-', 'from-')} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                <div className={`w-14 h-14 ${tool.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
                                    <i className={`${tool.icon} text-2xl text-white`}></i>
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{tool.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-200 transition-colors mb-4">{tool.desc}</p>
                                <div className="flex items-center text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    Open <i className="ri-arrow-right-line ml-1"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews & Footer */}
            <section id="reviews" className="py-24 relative">
                 <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-center mb-20 reveal-on-scroll">User <span className="gradient-text">Stories</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                         {[
                             { name: "Priya", text: "QuizWise was a game changer.", tool: "QuizWise" },
                             { name: "Arjun", text: "SkillBridge roadmap was detailed.", tool: "SkillBridge" },
                             { name: "Sneha", text: "MentorMate is gold.", tool: "MentorMate" }
                         ].map((r, i) => (
                             <div key={i} className="bg-slate-800/60 p-8 rounded-[2rem] border border-slate-700 reveal-on-scroll">
                                 <p className="text-slate-200 italic mb-6">"{r.text}"</p>
                                 <div className="font-bold">{r.name}</div>
                                 <div className="text-xs text-indigo-400">{r.tool}</div>
                             </div>
                         ))}
                    </div>
                </div>
            </section>
            
            <footer className="bg-slate-900 border-t border-slate-800 py-10 text-center text-slate-500 text-sm">
                © 2025 StepWise. All rights reserved.
            </footer>
        </>
      ) : (
        /* Full Screen Tool View */
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between z-50 shadow-lg">
                <button onClick={() => setActiveTool(ToolType.None)} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition-all font-medium"><i className="ri-arrow-left-line"></i> Back</button>
                <div className="font-bold text-xl">{tools.find(t => t.id === activeTool)?.title}</div>
                <div className="w-20"></div>
            </div>
            <div className="min-h-screen">{renderActiveTool()}</div>
        </div>
      )}

      {/* Overlays */}
      {showBot && <WiseBot currentStage={UserStage.StreamSprint} onClose={() => setShowBot(false)} />}
      {activeStage === UserStage.StreamSprint && <StreamSprint onClose={() => setActiveStage(null)} />}
      
      {!showBot && activeTool === ToolType.None && (
        <button onClick={() => setShowBot(true)} className="fixed bottom-8 right-8 w-16 h-16 rounded-full gradient-bg shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center hover:scale-110 transition-transform z-50 animate-float">
          <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 50, height: 50}} />
        </button>
      )}
    </div>
  );
}

export default App;