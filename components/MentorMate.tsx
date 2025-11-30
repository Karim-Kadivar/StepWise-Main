

import React, { useState } from 'react';

const mentors = [
    {
        id: 1,
        name: "Alice Johnson",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        expertise: "Data Science",
        experience: 7,
        rating: 4.8,
        tags: [{text: "AI Specialist", color: "from-blue-500 to-blue-700"}, {text: "Career Switch Coach", color: "from-green-500 to-green-700"}],
        bio: "Alice has 7 years of experience in data science and AI, helping professionals transition careers.",
        achievements: "Published 10+ research papers, Speaker at DataCon 2023",
        careerJourney: "Started as a data analyst, moved to AI research, now mentoring full-time.",
        availability: "Instant Chat, Schedule",
        languages: ["English", "Spanish"],
        pricing: "Paid"
    },
    {
        id: 2,
        name: "Bob Smith",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        expertise: "UI/UX Design",
        experience: 5,
        rating: 4.0,
        tags: [{text: "Design Mentor", color: "from-pink-500 to-pink-700"}, {text: "Portfolio Reviewer", color: "from-purple-500 to-purple-700"}],
        bio: "Bob specializes in UI/UX design with a focus on user-centered design principles.",
        achievements: "Led design teams at top startups, Mentor at DesignHub",
        careerJourney: "Graphic designer turned UI/UX expert, passionate about mentoring.",
        availability: "Schedule",
        languages: ["English"],
        pricing: "Free"
    },
    {
        id: 3,
        name: "Carol Lee",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        expertise: "Marketing",
        experience: 10,
        rating: 3.5,
        tags: [{text: "Marketing Strategist", color: "from-green-500 to-green-700"}, {text: "Branding Expert", color: "from-orange-500 to-orange-700"}],
        bio: "Carol has a decade of experience in marketing strategy and brand development.",
        achievements: "Managed campaigns for Fortune 500 companies, Author of Marketing 101",
        careerJourney: "Started in sales, transitioned to marketing leadership, now mentoring.",
        availability: "Instant Chat",
        languages: ["English", "French"],
        pricing: "Paid"
    },
    // Adding more diverse mentors for grid population
    {
        id: 4,
        name: "David Kim",
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
        expertise: "Software Engineering",
        experience: 8,
        rating: 4.7,
        tags: [{text: "Full-Stack", color: "from-indigo-500 to-indigo-700"}, {text: "Tech Lead", color: "from-red-500 to-red-700"}],
        bio: "Expert in full-stack dev and team leadership.",
        achievements: "Built scalable apps for tech giants",
        careerJourney: "Started coding in college, now tech lead.",
        availability: "Schedule",
        languages: ["English", "Korean"],
        pricing: "Paid"
    },
    {
        id: 5,
        name: "Eva Martinez",
        photo: "https://randomuser.me/api/portraits/women/55.jpg",
        expertise: "Finance",
        experience: 12,
        rating: 4.9,
        tags: [{text: "Investment Banker", color: "from-yellow-500 to-yellow-700"}, {text: "Advisor", color: "from-teal-500 to-teal-700"}],
        bio: "Specializing in investment banking and financial planning.",
        achievements: "Managed billion-dollar portfolios",
        careerJourney: "Finance graduate to investment banker.",
        availability: "Instant Chat",
        languages: ["English", "Spanish"],
        pricing: "Paid"
    },
    {
        id: 6,
        name: "Frank Wilson",
        photo: "https://randomuser.me/api/portraits/men/60.jpg",
        expertise: "Data Science",
        experience: 6,
        rating: 4.5,
        tags: [{text: "ML Expert", color: "from-cyan-500 to-cyan-700"}, {text: "Data Analyst", color: "from-blue-500 to-blue-700"}],
        bio: "Focus on ML and data analysis.",
        achievements: "Developed ML models for Fortune 500",
        careerJourney: "Data analyst to ML engineer.",
        availability: "Schedule",
        languages: ["English"],
        pricing: "Free"
    },
    {
        id: 7,
        name: "Sarah Chen",
        photo: "https://randomuser.me/api/portraits/women/75.jpg",
        expertise: "Product Management",
        experience: 9,
        rating: 4.9,
        tags: [{text: "Agile Expert", color: "from-rose-500 to-rose-700"}, {text: "Roadmap Strategy", color: "from-violet-500 to-violet-700"}],
        bio: "Seasoned Product Manager with a track record of launching successful B2B SaaS products from ideation to scale.",
        achievements: "Grew user base by 300% for a major tech product, Certified Scrum Master.",
        careerJourney: "Started in marketing, discovered a passion for user-centric products and pivoted to product management.",
        availability: "Schedule",
        languages: ["English", "Mandarin"],
        pricing: "Paid"
    },
    {
        id: 8,
        name: "Omar Ahmed",
        photo: "https://randomuser.me/api/portraits/men/78.jpg",
        expertise: "Cybersecurity",
        experience: 11,
        rating: 4.7,
        tags: [{text: "Ethical Hacker", color: "from-slate-500 to-slate-700"}, {text: "Cloud Security", color: "from-sky-500 to-sky-700"}],
        bio: "Cybersecurity expert specializing in threat intelligence and securing cloud infrastructure on AWS and Azure.",
        achievements: "CISSP Certified, discovered critical vulnerabilities in major financial systems.",
        careerJourney: "From IT support to a lead security architect, passionate about protecting digital assets.",
        availability: "Instant Chat",
        languages: ["English", "Arabic"],
        pricing: "Paid"
    },
    {
        id: 9,
        name: "Isabella Rossi",
        photo: "https://randomuser.me/api/portraits/women/85.jpg",
        expertise: "Creative Writing",
        experience: 6,
        rating: 4.6,
        tags: [{text: "Novelist", color: "from-amber-500 to-amber-700"}, {text: "Editing Pro", color: "from-lime-500 to-lime-700"}],
        bio: "Published author and editor helping aspiring writers find their voice and navigate the publishing industry.",
        achievements: "Award-winning debut novel, regular contributor to a literary magazine.",
        careerJourney: "Began as a freelance writer, now a published author and dedicated mentor.",
        availability: "Schedule",
        languages: ["English", "Italian"],
        pricing: "Free"
    }
];

export const MentorMate: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedMentor, setSelectedMentor] = useState<any>(null);

    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesFilter = true;
        if (activeFilter === 'data-science') matchesFilter = mentor.expertise === 'Data Science';
        if (activeFilter === 'ui-ux') matchesFilter = mentor.expertise === 'UI/UX Design';
        if (activeFilter === 'marketing') matchesFilter = mentor.expertise === 'Marketing';
        if (activeFilter === 'experience') matchesFilter = mentor.experience >= 5;
        if (activeFilter === 'free') matchesFilter = mentor.pricing === 'Free';

        return matchesSearch && matchesFilter;
    });

    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                    <i key={i} className={`ri-star-${i < Math.floor(rating) ? 'fill' : (i < rating ? 'half-line' : 'line')}`}></i>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-sans text-white mb-2">MentorMate – Connect with Experts</h1>
                <p className="text-lg text-slate-300">Find mentors who guide your career path</p>
            </div>

            <div className="mb-8">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Find mentors by role or skill (e.g., Data Analyst)" 
                        className="w-full p-4 pl-12 rounded-2xl bg-[#1e293b] text-white placeholder-slate-400 border-2 border-transparent focus:border-cyan focus:outline-none transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl"></i>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                    {['all', 'data-science', 'ui-ux', 'marketing', 'experience', 'free'].map(filter => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 capitalize ${
                                activeFilter === filter 
                                ? 'border-cyan text-white bg-gradient-to-r from-primary to-secondary' 
                                : 'border-slate-600 text-slate-300 hover:border-cyan hover:text-white'
                            }`}
                        >
                            {filter.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                    <div 
                        key={mentor.id} 
                        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
                        onClick={() => setSelectedMentor(mentor)}
                    >
                        <img src={mentor.photo} alt={mentor.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-transparent group-hover:border-cyan transition-all" />
                        <h3 className="text-xl font-bold text-white mb-1">{mentor.name}</h3>
                        <p className="text-cyan mb-1 font-medium">{mentor.expertise}</p>
                        <p className="text-slate-400 text-sm mb-2">{mentor.experience} years experience</p>
                        <div className="mb-2">{renderStars(mentor.rating)}</div>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {mentor.tags.map((tag: any, idx: number) => (
                                <span key={idx} className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${tag.color} text-white`}>{tag.text}</span>
                            ))}
                        </div>
                        <button className="mt-auto w-full py-2 rounded-lg bg-white/5 hover:bg-cyan hover:text-slate-900 text-white font-semibold transition-colors">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {selectedMentor && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMentor(null)}>
                    <div className="bg-[#1e293b] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-white">Mentor Profile</h2>
                            <button onClick={() => setSelectedMentor(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <img src={selectedMentor.photo} alt={selectedMentor.name} className="w-32 h-32 rounded-full object-cover border-4 border-cyan" />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl font-bold text-white mb-2">{selectedMentor.name}</h3>
                                <p className="text-cyan text-lg mb-4">{selectedMentor.expertise} • {selectedMentor.experience} years exp</p>
                                <p className="text-slate-300 mb-4">{selectedMentor.bio}</p>
                                
                                <div className="space-y-2 text-sm text-slate-400 mb-6">
                                    <p><strong className="text-white">Achievements:</strong> {selectedMentor.achievements}</p>
                                    <p><strong className="text-white">Journey:</strong> {selectedMentor.careerJourney}</p>
                                    <p><strong className="text-white">Languages:</strong> {selectedMentor.languages.join(', ')}</p>
                                    <p><strong className="text-white">Pricing:</strong> {selectedMentor.pricing}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:scale-105 transition-all">
                                        Book 1:1 Session
                                    </button>
                                    <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                                        Chat Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};