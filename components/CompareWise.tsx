import React, { useState } from 'react';
import { compareCareers } from '../services/geminiService';

export const CompareWise: React.FC = () => {
  const [topicA, setTopicA] = useState('');
  const [topicB, setTopicB] = useState('');
  const [comparison, setComparison] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!topicA || !topicB) return;
    setLoading(true);
    try {
      const result = await compareCareers(topicA, topicB);
      setComparison(result);
    } catch (e) {
      alert("Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-3 brand-text-gradient">CompareWise</h2>
        <p className="text-gray-500 text-lg">Make informed decisions by comparing any two paths side-by-side.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
          <div className="flex-1 w-full">
             <label className="block text-sm font-bold text-gray-700 mb-2">Option A</label>
             <input 
               type="text" 
               value={topicA}
               onChange={(e) => setTopicA(e.target.value)}
               placeholder="e.g. Computer Science"
               className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#6A73E4] focus:outline-none"
             />
          </div>
          <div className="text-2xl font-bold text-gray-300">VS</div>
          <div className="flex-1 w-full">
             <label className="block text-sm font-bold text-gray-700 mb-2">Option B</label>
             <input 
               type="text" 
               value={topicB}
               onChange={(e) => setTopicB(e.target.value)}
               placeholder="e.g. Data Science"
               className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#37D0C0] focus:outline-none"
             />
          </div>
        </div>

        <button 
          onClick={handleCompare}
          disabled={loading || !topicA || !topicB}
          className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all brand-gradient mb-8"
        >
          {loading ? 'Analyzing Differences...' : 'Compare Now'}
        </button>

        {comparison && (
          <div className="prose max-w-none bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 animate-fade-in-up">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {comparison}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};