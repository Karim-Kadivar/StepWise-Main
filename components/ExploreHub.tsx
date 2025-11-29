import React, { useState } from 'react';
import { exploreCareersWithSearch } from '../services/geminiService';

export const ExploreHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{text: string, chunks?: any} | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Simple geolocation fetch if needed for Maps
      if (query.toLowerCase().includes("near me") || query.toLowerCase().includes("university")) {
        if ("geolocation" in navigator) {
             try {
                 const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                     navigator.geolocation.getCurrentPosition(resolve, reject);
                 });
                 setLocation({lat: pos.coords.latitude, lng: pos.coords.longitude});
             } catch(e) {
                 console.log("Loc denied");
             }
        }
      }

      const data = await exploreCareersWithSearch(query, location);
      setResults({ text: data.text || "No text returned", chunks: data.groundingChunks });
    } catch (e) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
       <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-slate-800">ExploreHub 🌍</h2>
           <p className="text-slate-500">Real-time global insights powered by Google Search & Maps</p>
       </div>

       <div className="flex gap-2 mb-8 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities, top jobs in 2025, or colleges near me..."
              className="flex-1 pl-10 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
           />
           <button 
             onClick={handleSearch}
             disabled={loading}
             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all"
           >
             {loading ? 'Searching...' : 'Explore'}
           </button>
       </div>

       {results && (
           <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
               <div className="prose max-w-none text-gray-700 mb-6">
                   <p className="whitespace-pre-line">{results.text}</p>
               </div>
               
               {results.chunks && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t pt-6">
                       {results.chunks.map((chunk: any, i: number) => {
                           const web = chunk.web;
                           const map = chunk.maps; // Verify structure based on SDK output
                           if (web) {
                               return (
                                   <a key={i} href={web.uri} target="_blank" rel="noreferrer" className="block p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100">
                                       <h4 className="font-bold text-blue-800 text-sm truncate">{web.title}</h4>
                                       <p className="text-xs text-blue-600 mt-1 truncate">{web.uri}</p>
                                   </a>
                               )
                           }
                           return null;
                       })}
                   </div>
               )}
           </div>
       )}
    </div>
  );
};
