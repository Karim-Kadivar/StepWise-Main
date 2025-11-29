import React, { useState, useRef, useEffect } from 'react';
import { getQuickChatResponse, getThinkingCareerAdvice, generateSpeech } from '../services/geminiService';
import { Message, UserStage } from '../types';
import { LottiePlayer } from './LottiePlayer';

interface WiseBotProps {
  currentStage: UserStage;
  onClose: () => void;
}

export const WiseBot: React.FC<WiseBotProps> = ({ currentStage, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: `Hi! I'm WiseBot. I see you're exploring ${currentStage}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      let text = '';
      if (useThinkingMode) {
        text = await getThinkingCareerAdvice(userMsg.text, currentStage);
      } else {
        const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        text = await getQuickChatResponse(history, userMsg.text);
      }
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const playTTS = async (text: string) => {
      try {
          setIsPlayingAudio(true);
          const base64 = await generateSpeech(text);
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const buffer = await audioContext.decodeAudioData(bytes.buffer);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          source.onended = () => setIsPlayingAudio(false);
      } catch (e) {
          console.error(e);
          setIsPlayingAudio(false);
      }
  }

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[650px] bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-200 z-50 overflow-hidden font-sans ring-1 ring-black/5 animate-slide-up">
      {/* Header */}
      <div className="brand-gradient p-5 flex justify-between items-center text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner overflow-hidden">
                 <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 60, height: 60}} />
            </div>
            <div>
                <h3 className="font-bold text-lg">WiseBot</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-white/90">Online</span>
                </div>
            </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20 z-10">&times;</button>
      </div>

      {/* Toggles */}
      <div className="bg-slate-50 p-3 flex justify-between items-center border-b border-slate-100">
        <span className="text-xs text-slate-500 font-semibold ml-2 uppercase tracking-wide">Mode</span>
        <button 
           onClick={() => setUseThinkingMode(!useThinkingMode)}
           className={`text-xs px-4 py-1.5 rounded-full transition-all font-medium border flex items-center gap-2 ${useThinkingMode ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
        >
            {useThinkingMode ? <><i className="ri-brain-line"></i> Deep Thinking</> : <><i className="ri-flashlight-line"></i> Fast Chat</>}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative group transition-all hover:shadow-md ${
              m.role === 'user' 
                ? 'bg-[#6A73E4] text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {m.text}
              {m.role === 'model' && (
                  <button 
                    onClick={() => playTTS(m.text)}
                    className={`absolute -bottom-8 left-0 text-gray-400 hover:text-[#6A73E4] p-1 transition-opacity ${isPlayingAudio ? 'text-[#6A73E4] animate-pulse' : 'opacity-0 group-hover:opacity-100'}`}
                    title="Read Aloud"
                  >
                      <i className="ri-volume-up-line text-lg"></i>
                  </button>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex justify-start animate-fade-in">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-3">
               <LottiePlayer url="https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json" style={{width: 40, height: 40}} />
               <span className="text-xs text-gray-400 font-medium">Thinking...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full pl-5 pr-12 py-3.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6A73E4] focus:bg-white transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-2 p-2 bg-[#6A73E4] text-white rounded-full hover:bg-[#5a62c4] disabled:opacity-50 transition-all shadow-md hover:scale-110 active:scale-95"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};