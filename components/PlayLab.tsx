
import React, { useState } from 'react';

export const PlayLab: React.FC = () => {
    const [started, setStarted] = useState(false);

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-[80vh]">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-sans text-white mb-2">PlayLab – Gamify Your Career</h1>
                <p className="text-lg text-slate-300">Boost your skills through fun, interactive challenges.</p>
            </div>

            {!started ? (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-48 h-48 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full blur-[60px] absolute opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <i className="ri-gamepad-line text-8xl text-white mb-6 block animate-bounce"></i>
                        <button 
                            onClick={() => setStarted(true)}
                            className="px-12 py-5 bg-white text-slate-900 text-xl font-bold rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all"
                        >
                            Start Playing
                        </button>
                        <p className="mt-4 text-slate-400">Earn XP, Badges, and Career Clarity</p>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="font-bold text-white">LVL 1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Rookie Explorer</h3>
                                <div className="w-32 bg-slate-700 h-2 rounded-full mt-1">
                                    <div className="bg-green-400 h-2 rounded-full w-1/3"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-yellow-400 font-bold text-xl block">💎 250 XP</span>
                            <span className="text-slate-400 text-xs">Next Reward: Resume Template</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Career Quests', desc: 'Story-based progression', color: 'from-blue-500 to-indigo-600', icon: 'ri-map-2-line' },
                            { title: 'Skill Missions', desc: 'Targeted challenges', color: 'from-green-500 to-teal-500', icon: 'ri-target-line' },
                            { title: 'Aptitude Puzzles', desc: 'Logic & reasoning', color: 'from-orange-500 to-red-500', icon: 'ri-puzzle-line' },
                            { title: 'Roleplay Sim', desc: 'Real-world scenarios', color: 'from-purple-500 to-pink-500', icon: 'ri-user-voice-line' },
                        ].map((game, i) => (
                            <div key={i} className={`bg-gradient-to-br ${game.color} p-1 rounded-2xl hover:scale-105 transition-transform cursor-pointer group`}>
                                <div className="bg-slate-900 h-full w-full rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                    <i className={`${game.icon} text-4xl text-white mb-4`}></i>
                                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                    <p className="text-slate-400 text-sm">{game.desc}</p>
                                    <button className="mt-6 px-6 py-2 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">Daily Challenges</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <i className="ri-checkbox-circle-line text-slate-600 text-xl"></i>
                                    <span className="text-slate-300">Complete 1 Quiz</span>
                                </div>
                                <span className="text-yellow-400 font-bold">+50 XP</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                                    <span className="text-white line-through opacity-50">Explore 3 Careers</span>
                                </div>
                                <span className="text-green-500 font-bold">Claimed</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
