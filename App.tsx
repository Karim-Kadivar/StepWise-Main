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

const stages = [
  { id: UserStage.StreamSprint, title: 'StreamSprint', subtitle: '11th-12th Grade', icon: 'ri-rocket-2-line', color: 'from-indigo to-royal' },
  { id: UserStage.CourseCompass, title: 'CourseCompass', subtitle: 'College Students', icon: 'ri-compass-3-line', color: 'from-blue-500 to-blue-700' },
  { id: UserStage.SkillBridge, title: 'SkillBridge', subtitle: 'Post Graduates', icon: 'ri-building-4-line', color: 'from-orange-500 to-orange-700' },
  { id: UserStage.RoleRadar, title: 'RoleRadar', subtitle: 'Job Seekers', icon: 'ri-focus-3-line', color: 'from-cyan to-sky' },
  { id: UserStage.CareerPivot, title: 'CareerPivot', subtitle: 'Career Switchers', icon: 'ri-loop-right-line', color: 'from-red-500 to-red-700' },
];

const tools = [
  { id: ToolType.ResuCraft, title: 'ResuCraft', icon: 'ri-file-text-line', desc: 'AI-powered resume builder tailored to your target roles', bg: 'resucraft-bg', shadow: 'resucraft-shadow' },
  { id: ToolType.PlayLab, title: 'PlayLab', icon: 'ri-gamepad-line', desc: 'Interactive games to practice skills and explore scenarios', bg: 'playlab-bg', shadow: 'playlab-shadow' },
  { id: ToolType.QuizWise, title: 'QuizWise', icon: 'ri-question-line', desc: 'Adaptive interest-based quizzes for true passion discovery', bg: 'quizwise-bg', shadow: 'quizwise-shadow' },
  { id: ToolType.WiseBot, title: 'WiseBot', icon: 'ri-robot-line', desc: 'Your personal AI career guide available 24/7', bg: 'wisebot-bg', shadow: 'wisebot-shadow' },
  { id: ToolType.MentorMate, title: 'MentorMate', icon: 'ri-team-line', desc: 'Connect with industry professionals for guidance', bg: 'mentormate-bg', shadow: 'mentormate-shadow' },
  { id: ToolType.WiseVault, title: 'WiseVault', icon: 'ri-safe-line', desc: 'Personal career journal to track progress and goals', bg: 'wisevault-bg', shadow: 'wisevault-shadow' },
  { id: ToolType.InterViewer, title: 'InterViewer', icon: 'ri-camera-lens-line', desc: 'AI Interview Practice with camera analysis', bg: 'bg-gradient-to-br from-teal-400 to-teal-600', shadow: 'hover:shadow-teal-500/30' },
  { id: ToolType.Visualizer, title: 'Visualizer', icon: 'ri-image-edit-line', desc: 'Visualize and animate your future workspace', bg: 'bg-gradient-to-br from-pink-500 to-rose-500', shadow: 'hover:shadow-pink-500/30' },
  { id: ToolType.LiveConversation, title: 'Live Coach', icon: 'ri-mic-line', desc: 'Real-time voice conversation with Gemini Live', bg: 'bg-gradient-to-br from-violet-500 to-purple-600', shadow: 'hover:shadow-violet-500/30' },
  { id: ToolType.ExploreHub, title: 'ExploreHub', icon: 'ri-earth-line', desc: 'Global career and stream discovery', bg: 'bg-gradient-to-br from-sky-400 to-blue-500', shadow: 'hover:shadow-sky-500/30' },
  { id: ToolType.CompareWise, title: 'CompareWise', icon: 'ri-scales-3-line', desc: 'Compare careers side-by-side', bg: 'bg-gradient-to-br from-amber-400 to-orange-500', shadow: 'hover:shadow-amber-500/30' },
];

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.None);
  const [showBot, setShowBot] = useState(false);
  const chartRefs = useRef<{[key: string]: HTMLCanvasElement | null}>({});

  // Scroll Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTool]); // Re-run when view changes

  // Chart initialization
  useEffect(() => {
    if (activeTool !== ToolType.None) return;

    const initCharts = () => {
      if (typeof (window as any).Chart === 'undefined') return;

      const chartConfig = {
        plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
        scales: {
            y: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            x: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
      };

      if (chartRefs.current['regret'] && !(chartRefs.current['regret'] as any).chart) {
        new (window as any).Chart(chartRefs.current['regret'], {
            type: 'doughnut',
            data: {
                labels: ['Happy', 'Unhappy'],
                datasets: [{ data: [27, 73], backgroundColor: ['#10B981', '#EF4444'], borderWidth: 0 }]
            },
            options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
        });
      }

      if (chartRefs.current['success'] && !(chartRefs.current['success'] as any).chart) {
        new (window as any).Chart(chartRefs.current['success'], {
            type: 'bar',
            data: {
                labels: ['Others', 'StepWise'],
                datasets: [{ label: 'Satisfaction %', data: [35, 87], backgroundColor: ['#94a3b8', '#10B981'], borderRadius: 4 }]
            },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: chartConfig.scales }
        });
      }

      if (chartRefs.current['cost'] && !(chartRefs.current['cost'] as any).chart) {
        new (window as any).Chart(chartRefs.current['cost'], {
            type: 'line',
            data: {
                labels: ['Traditional', 'StepWise'],
                datasets: [{ label: 'Avg Cost (K)', data: [47, 12], borderColor: '#3B82F6', tension: 0.4, fill: true, backgroundColor: 'rgba(59, 130, 246, 0.2)' }]
            },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: chartConfig.scales }
        });
      }
    };

    // Small delay to ensure canvas is rendered
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTool(ToolType.None)}>
                    <img src="https://huggingface.co/spaces/Akshansh115/logo/resolve/main/images/StepWiseLogo.jpg" alt="Logo" className="h-10 rounded-lg group-hover:scale-105 transition-transform" />
                    <span className="text-2xl font-pacifico text-white group-hover:text-indigo-400 transition-colors">StepWise</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <button onClick={() => { setActiveTool(ToolType.None); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</button>
                    <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Features</button>
                    <button onClick={() => scrollToSection('tools')} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Tools</button>
                    <button onClick={() => scrollToSection('reviews')} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Reviews</button>
                    <button onClick={() => scrollToSection('features')} className="gradient-bg px-6 py-2 rounded-full text-white font-bold hover:shadow-[0_0_20px_rgba(46,168,248,0.5)] hover:scale-105 transition-all btn-hover shadow-lg">
                        Get Started
                    </button>
                </div>
                {/* Mobile Menu Button - simplified */}
                <button className="md:hidden text-white text-2xl">
                    <i className="ri-menu-line"></i>
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content or Tool Overlay */}
      {activeTool === ToolType.None ? (
        <>
            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* High Quality Background Image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed scale-105 animate-[pulse-slow_15s_ease-in-out_infinite]"></div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900"></div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                    <div className="inline-block px-6 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-8 animate-slide-up backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        ✨ AI-Powered Career Intelligence
                    </div>
                    <div className="relative">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-8 animate-slide-up drop-shadow-2xl">
                            A Step Ahead, <br/><span className="gradient-text">Wisely</span>
                        </h1>
                        {/* Subtle Floating Lottie in Background/Side */}
                        <div className="absolute -top-20 -right-20 opacity-30 pointer-events-none md:block hidden animate-float">
                             <LottiePlayer url="https://assets3.lottiefiles.com/packages/lf20_sk5h1kfn.json" style={{width: 300, height: 300}} />
                        </div>
                    </div>
                    
                    <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl animate-slide-up leading-relaxed delay-100 drop-shadow-lg font-light">
                        Navigate your career with confidence using next-gen AI tools for guidance, preparation, and skill-building. Your future, simplified.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 animate-slide-up delay-200">
                        <button onClick={() => scrollToSection('features')} className="gradient-bg px-10 py-5 rounded-full text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] btn-hover flex items-center justify-center gap-3">
                            <i className="ri-rocket-fill"></i> Start Your Journey
                        </button>
                        <button onClick={() => scrollToSection('tools')} className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all btn-hover flex items-center justify-center gap-3 shadow-lg">
                            <i className="ri-tools-fill"></i> Explore WiseKit
                        </button>
                    </div>
                    
                    {/* Scroll Down Lottie */}
                    <div className="absolute bottom-10 cursor-pointer" onClick={() => scrollToSection('features')}>
                        <LottiePlayer url="https://assets3.lottiefiles.com/packages/lf20_49rdyysj.json" style={{width: 60, height: 60}} />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-4xl font-bold mb-6">Ctrl + Z Your Career: <span className="gradient-text">Undo, Rethink, Rebuild</span></h2>
                        <p className="text-slate-400 text-lg">Data-driven insights to back your next move.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 hover:border-red-500/50 transition-all hover:shadow-[0_20px_50px_rgba(239,68,68,0.15)] group reveal-on-scroll hover:-translate-y-2 duration-500">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-red-400 transition-colors"><i className="ri-arrow-go-back-line text-red-500 text-3xl"></i> Undo</h3>
                            <div className="h-64 relative mb-4">
                                <canvas ref={el => { chartRefs.current['regret'] = el; }}></canvas>
                            </div>
                            <p className="text-center text-slate-300 font-medium group-hover:text-white transition-colors">73% professionals feel stuck</p>
                        </div>
                        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 hover:border-green-500/50 transition-all hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] group reveal-on-scroll hover:-translate-y-2 duration-500 delay-100">
                             <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-green-400 transition-colors"><i className="ri-lightbulb-flash-line text-green-500 text-3xl"></i> Rethink</h3>
                             <div className="h-64 relative mb-4">
                                <canvas ref={el => { chartRefs.current['success'] = el; }}></canvas>
                            </div>
                            <p className="text-center text-slate-300 font-medium group-hover:text-white transition-colors">2.5x higher success rate</p>
                        </div>
                        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] group reveal-on-scroll hover:-translate-y-2 duration-500 delay-200">
                             <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-blue-400 transition-colors"><i className="ri-building-3-line text-blue-500 text-3xl"></i> Rebuild</h3>
                             <div className="h-64 relative mb-4">
                                <canvas ref={el => { chartRefs.current['cost'] = el; }}></canvas>
                            </div>
                            <p className="text-center text-slate-300 font-medium group-hover:text-white transition-colors">Save ~35k on wrong turns</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section id="features" className="py-24 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900/10 to-slate-900 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-center mb-20 reveal-on-scroll">Where Are You On Your <span className="gradient-text">Journey?</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stages.map((stage, i) => (
                            <div key={stage.id} className={`bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-[2rem] transition-all cursor-pointer group hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] card-hover relative overflow-hidden reveal-on-scroll delay-${i * 100} hover:border-indigo-500/30`}>
                                <div className={`absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12`}>
                                   <i className={`${stage.icon} text-[10rem]`}></i>
                                </div>
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl`}>
                                    <i className={`${stage.icon} text-4xl text-white`}></i>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">{stage.subtitle}</h3>
                                <h4 className={`text-xl font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent mb-6`}>{stage.title}</h4>
                                <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed group-hover:text-slate-300">Tailored guidance, tools, and resources designed specifically for this critical stage of your career path.</p>
                                <button className="text-sm font-bold text-white flex items-center gap-2 group-hover:gap-4 transition-all relative z-10 bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 w-fit">
                                    Explore Path <i className="ri-arrow-right-line"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WiseKit Tools Section */}
            <section id="tools" className="py-24 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-5xl font-bold mb-6">WiseKit</h2>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto">Create. Connect. Conquer. A complete suite of AI-powered tools.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tools.map((tool, i) => (
                            <div 
                                key={tool.id} 
                                onClick={() => setActiveTool(tool.id)}
                                className={`bg-slate-800/80 p-8 rounded-[2rem] border border-slate-700 cursor-pointer card-hover ${tool.shadow} group relative overflow-hidden reveal-on-scroll delay-${i * 50} hover:-translate-y-2`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg.replace('bg-', 'from-')} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                <div className={`w-16 h-16 ${tool.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg group-hover:shadow-2xl`}>
                                    <i className={`${tool.icon} text-3xl text-white`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{tool.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors mb-4">{tool.desc}</p>
                                <div className="flex items-center text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    Open Tool <i className="ri-arrow-right-line ml-2"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="py-24 relative">
                 {/* Background Elements */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none blur-3xl">
                     <div className="w-96 h-96 bg-indigo-600 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-center mb-20 reveal-on-scroll">What Our Users <span className="gradient-text">Say</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                         {[
                             { name: "Priya Sharma", role: "Student", text: "StepWise helped me realize my passion for UX Design! QuizWise was a game changer.", tool: "QuizWise", img: "https://randomuser.me/api/portraits/women/12.jpg" },
                             { name: "Arjun Patel", role: "Switcher", text: "Transitioned from Sales to Tech smoothly. SkillBridge roadmap was incredibly detailed.", tool: "SkillBridge", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                             { name: "Sneha Gupta", role: "Graduate", text: "Found an amazing mentor who guided me through my first job hunt. MentorMate is gold.", tool: "MentorMate", img: "https://randomuser.me/api/portraits/women/45.jpg" }
                         ].map((review, i) => (
                             <div key={i} className={`bg-slate-800/60 backdrop-blur-md p-10 rounded-[2rem] border border-slate-700 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-2xl reveal-on-scroll delay-${i * 100}`}>
                                 <div className="flex items-center gap-4 mb-8">
                                     <img src={review.img} className="w-14 h-14 rounded-full border-2 border-indigo-500 shadow-md" alt={review.name}/>
                                     <div>
                                         <h4 className="font-bold text-lg">{review.name}</h4>
                                         <p className="text-sm text-slate-400 font-medium">{review.role}</p>
                                     </div>
                                 </div>
                                 <div className="mb-6 text-indigo-400">
                                     <i className="ri-double-quotes-l text-4xl opacity-50"></i>
                                 </div>
                                 <p className="text-slate-200 italic mb-8 text-lg leading-relaxed">"{review.text}"</p>
                                 <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                     <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{review.tool}</span>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-10">
                        <div className="flex items-center gap-4">
                             <img src="https://huggingface.co/spaces/Akshansh115/logo/resolve/main/images/StepWiseLogo.jpg" alt="Logo" className="h-12 rounded-xl grayscale hover:grayscale-0 transition-all cursor-pointer" />
                             <span className="text-3xl font-pacifico text-white hover:text-indigo-400 transition-colors cursor-pointer">StepWise</span>
                        </div>
                        <div className="flex gap-8">
                            <i className="ri-twitter-x-line text-2xl text-slate-500 hover:text-white cursor-pointer hover:scale-110 transition-transform bg-slate-800 p-3 rounded-full"></i>
                            <i className="ri-instagram-line text-2xl text-slate-500 hover:text-white cursor-pointer hover:scale-110 transition-transform bg-slate-800 p-3 rounded-full"></i>
                            <i className="ri-linkedin-fill text-2xl text-slate-500 hover:text-white cursor-pointer hover:scale-110 transition-transform bg-slate-800 p-3 rounded-full"></i>
                            <i className="ri-youtube-fill text-2xl text-slate-500 hover:text-white cursor-pointer hover:scale-110 transition-transform bg-slate-800 p-3 rounded-full"></i>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
                        <div>© 2025 StepWise. All rights reserved.</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
      ) : (
        /* Full Screen Tool View */
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between z-50 shadow-lg">
                <button 
                    onClick={() => setActiveTool(ToolType.None)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-700 text-white hover:bg-slate-800 hover:border-indigo-500 transition-all group font-medium"
                >
                    <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i> Back to Home
                </button>
                <div className="font-bold text-xl flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {tools.find(t => t.id === activeTool)?.title}
                </div>
                <div className="w-32"></div> {/* Spacer for centering */}
            </div>
            <div className="min-h-screen">
                {renderActiveTool()}
            </div>
        </div>
      )}

      {/* WiseBot Overlay */}
      {showBot && <WiseBot currentStage={UserStage.StreamSprint} onClose={() => setShowBot(false)} />}
      
      {/* Floating Bot Button */}
      {!showBot && activeTool === ToolType.None && (
        <button
          onClick={() => setShowBot(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full gradient-bg shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center hover:scale-110 transition-transform z-50 animate-float group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity"></div>
          <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 50, height: 50}} />
        </button>
      )}
    </div>
  );
}

export default App;