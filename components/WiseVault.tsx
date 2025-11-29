
import React from 'react';

export const WiseVault: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-sans text-white mb-2">WiseVault – Your Career Journal</h1>
                <p className="text-lg text-slate-300">Save and track your career progress in one place</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {[
                    { title: 'Saved Careers', icon: 'ri-graduation-cap-line', count: '5 saved paths', color: 'bg-primary' },
                    { title: 'Saved Streams', icon: 'ri-compass-3-line', count: '3 saved streams', color: 'bg-secondary' },
                    { title: 'Saved Courses', icon: 'ri-book-open-line', count: '8 saved courses', color: 'bg-purple-500' },
                    { title: 'Quiz Results', icon: 'ri-question-line', count: 'Latest: 85% match', color: 'bg-yellow-500' },
                    { title: 'Saved Mentors', icon: 'ri-team-line', count: '2 saved mentors', color: 'bg-green-500' },
                    { title: 'Saved Resumes', icon: 'ri-file-text-line', count: '3 saved resumes', color: 'bg-red-500' },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 transition-all hover:-translate-y-1 cursor-pointer group">
                        <div className={`w-12 h-12 ${item.color}/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <i className={`${item.icon} text-2xl ${item.color.replace('bg-', 'text-')}`}></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-400 text-sm mb-4">{item.count}</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20">View</button>
                            <button className="px-3 py-1 bg-white/5 rounded-lg text-sm text-slate-300 hover:bg-white/10">Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Tracker */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Career Readiness</h3>
                    <span className="text-3xl font-bold gradient-text">75%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full animate-[slideUp_1s_ease-out]" style={{width: '75%'}}></div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-xl bg-slate-800">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-check-line text-green-400 text-xl"></i>
                        </div>
                        <h4 className="font-bold text-white">Education</h4>
                        <p className="text-slate-400 text-sm">Completed Bachelor's</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-slate-800">
                         <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-loader-4-line text-yellow-400 text-xl animate-spin"></i>
                        </div>
                        <h4 className="font-bold text-white">Experience</h4>
                        <p className="text-slate-400 text-sm">Internship in progress</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-slate-800">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-arrow-right-line text-blue-400 text-xl"></i>
                        </div>
                        <h4 className="font-bold text-white">Next Step</h4>
                        <p className="text-slate-400 text-sm">Get Certified</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Add Entry', icon: 'ri-add-line', color: 'text-primary' },
                    { label: 'Export Data', icon: 'ri-download-line', color: 'text-secondary' },
                    { label: 'Share Profile', icon: 'ri-share-line', color: 'text-purple-400' },
                    { label: 'Sync Calendar', icon: 'ri-calendar-line', color: 'text-green-400' },
                ].map((action, i) => (
                    <button key={i} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-700 transition-colors flex flex-col items-center justify-center gap-2 group">
                        <i className={`${action.icon} ${action.color} text-2xl group-hover:scale-110 transition-transform`}></i>
                        <span className="text-slate-300 font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
