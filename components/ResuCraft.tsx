
import React, { useState } from 'react';

export const ResuCraft: React.FC = () => {
    const [mode, setMode] = useState<'manual' | 'ai' | 'template' | null>(null);

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-[80vh]">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-sans text-white mb-2">ResuCraft – Build Your Perfect Resume</h1>
                <p className="text-lg text-slate-300">Create manually, customize with AI, or choose a template.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { id: 'manual', title: 'Manual Builder', icon: 'ri-edit-line', desc: 'Step-by-step forms' },
                    { id: 'ai', title: 'AI Generation', icon: 'ri-magic-line', desc: 'Generate from basic info' },
                    { id: 'template', title: 'Template Library', icon: 'ri-layout-masonry-line', desc: 'ATS-friendly layouts' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setMode(item.id as any)}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col items-center text-center gap-4 ${
                            mode === item.id 
                            ? 'bg-gradient-to-br from-indigo to-royal border-transparent shadow-lg scale-105 ring-2 ring-white/20' 
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-indigo'
                        }`}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl text-white">
                            <i className={item.icon}></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 min-h-[400px]">
                {mode === 'manual' && (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-white mb-6">Manual Builder</h3>
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Personal Info</span>
                                <span>Step 1 of 4</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mb-6">
                                <div className="bg-primary h-2 rounded-full w-1/4"></div>
                            </div>
                            <div className="grid gap-4">
                                <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-primary focus:outline-none" />
                                <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-primary focus:outline-none" />
                                <input type="text" placeholder="Phone Number" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-primary focus:outline-none" />
                                <div className="flex justify-end pt-4">
                                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">Next Step</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'ai' && (
                    <div className="animate-fade-in text-center max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-6">AI Resume Generator</h3>
                        <p className="text-slate-400 mb-8">Enter your target role and key skills, and let AI craft your resume.</p>
                        <div className="space-y-4 text-left">
                             <input type="text" placeholder="Target Job Title (e.g., Software Engineer)" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-purple-500 focus:outline-none" />
                             <textarea placeholder="Paste your raw experience or LinkedIn summary here..." rows={6} className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-purple-500 focus:outline-none"></textarea>
                             <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                                 ✨ Generate Magic Resume
                             </button>
                        </div>
                    </div>
                )}

                {mode === 'template' && (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-white mb-6">Select a Template</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="group cursor-pointer relative aspect-[1/1.4] bg-white rounded-xl overflow-hidden hover:ring-4 ring-primary transition-all">
                                    <div className="absolute inset-0 bg-slate-200"></div> {/* Placeholder for resume preview */}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="px-6 py-2 bg-white text-slate-900 rounded-lg font-bold">Use This</button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90">
                                        <h4 className="font-bold text-slate-900">Modern Template {i}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!mode && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500">
                        <i className="ri-layout-top-line text-6xl mb-4 opacity-50"></i>
                        <p>Select a mode above to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};
