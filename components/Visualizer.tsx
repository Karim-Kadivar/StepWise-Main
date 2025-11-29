import React, { useState } from 'react';
import { generateCareerImage, generateVeoVideo, editCareerImage } from '../services/geminiService';
import { LottiePlayer } from './LottiePlayer';

export const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'video'>('create');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      if (mode === 'create') {
        const base64 = await generateCareerImage(prompt, aspectRatio, imageSize);
        setGeneratedImage(base64);
        setGeneratedVideo(null);
      } else if (mode === 'edit' && generatedImage) {
        const base64Raw = generatedImage.split(',')[1];
        const newImage = await editCareerImage(base64Raw, prompt);
        setGeneratedImage(newImage);
      } else if (mode === 'video' && generatedImage) {
        // Extract base64 raw string
        const base64Raw = generatedImage.split(',')[1];
        const videoUrl = await generateVeoVideo(base64Raw, prompt, aspectRatio);
        setGeneratedVideo(videoUrl);
      }
    } catch (e) {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold mb-2 brand-text-gradient animate-slide-up flex items-center justify-center gap-3">
          <LottiePlayer url="https://assets10.lottiefiles.com/packages/lf20_w51pcehl.json" style={{width: 50, height: 50}} />
          {mode === 'create' ? 'Career Visualizer' : mode === 'edit' ? 'Magic Editor' : 'Motion Animator'}
        </h2>
        <p className="text-gray-500 animate-slide-up delay-100">
          Visualize, edit, and animate your future workspace with Gemini.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up transition-all hover:shadow-2xl">
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button 
            onClick={() => setMode('create')}
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${mode === 'create' ? 'bg-[#6A73E4] text-white scale-105 ring-4 ring-[#6A73E4]/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            1. Create (Gemini Pro)
          </button>
          <button 
            onClick={() => setMode('edit')}
            disabled={!generatedImage}
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${mode === 'edit' ? 'bg-[#37D0C0] text-white scale-105 ring-4 ring-[#37D0C0]/20' : 'bg-gray-100 text-gray-400'}`}
          >
            2. Edit (Nano Banana)
          </button>
          <button 
            onClick={() => setMode('video')}
            disabled={!generatedImage}
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${mode === 'video' ? 'bg-pink-500 text-white scale-105 ring-4 ring-pink-500/20' : 'bg-gray-100 text-gray-400'}`}
          >
            3. Animate (Veo)
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
              mode === 'create' ? "Describe your dream office (e.g., A sleek glass office overlooking NYC...)" :
              mode === 'edit' ? "What to change? (e.g., Add a coffee machine, make it sunset...)" :
              "How should it move? (e.g., Camera pans right, lights flicker...)"
          }
          className="w-full p-6 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#6A73E4] focus:outline-none mb-6 min-h-[120px] shadow-inner bg-gray-50 text-lg resize-none transition-shadow"
        />

        {mode === 'create' && (
          <div className="flex gap-6 mb-6">
            <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 block mb-2">Aspect Ratio</label>
                <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer focus:ring-2 focus:ring-[#6A73E4]"
                >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
                </select>
            </div>
            <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 block mb-2">Image Size</label>
                <select 
                value={imageSize} 
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer focus:ring-2 focus:ring-[#6A73E4]"
                >
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
                </select>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || (!generatedImage && mode !== 'create')}
          className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex justify-center items-center gap-2 brand-gradient"
        >
          {loading ? (
            <span className="flex items-center gap-2">Creating...</span>
          ) : (
            <span>
              {mode === 'create' ? 'Generate Image' : mode === 'edit' ? 'Apply Edits' : 'Generate Video'}
            </span>
          )}
        </button>

        <div className="mt-8 min-h-[400px] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-gray-300 relative group transition-all">
           {generatedVideo ? (
             <video src={generatedVideo} controls autoPlay loop className="max-w-full max-h-[600px] rounded-lg shadow-lg animate-fade-in" />
           ) : generatedImage ? (
             <img src={generatedImage} alt="Generated result" className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg animate-fade-in" />
           ) : (
             <div className="text-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
               <span className="text-6xl block mb-4">🎨</span>
               <p className="text-lg">Your masterpiece will appear here</p>
             </div>
           )}
           
           {loading && (
             <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm rounded-2xl">
                <LottiePlayer url="https://assets3.lottiefiles.com/packages/lf20_96bovdur.json" style={{width: 200, height: 200}} />
                <p className="text-[#6A73E4] font-semibold animate-pulse mt-4">Bringing your vision to life...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};