import React, { useState, useRef, useEffect } from 'react';
import { getQuickChatResponse, getThinkingCareerAdvice, generateSpeech, generateCareerPrompts } from '../services/geminiService';
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
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial prompt generation
  useEffect(() => {
    generateCareerPrompts(currentStage).then(setSuggestedPrompts);
  }, [currentStage]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Speech Recognition setup
  useEffect(() => {
      if ('webkitSpeechRecognition' in window) {
          const recognition = new (window as any).webkitSpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setInput(transcript);
              // Automatically send after voice input for a smoother experience
              handleSend(transcript); 
          };
          recognitionRef.current = recognition;
      }
  }, []);

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() && !imageBase64) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend, image: imagePreview || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    const currentImageBase64 = imageBase64;
    setImageBase64(null);
    setIsThinking(true);
    setFollowUpPrompts([]);

    try {
      let text = '';
      if (useThinkingMode) {
        text = await getThinkingCareerAdvice(userMsg.text, currentStage);
      } else {
        const history = messages.map(m => {
          const parts: any[] = [{ text: m.text }];
          // Note: History with images needs careful construction based on API requirements.
          // For simplicity, we pass the image with the current message, not history.
          return { role: m.role, parts };
        });
        text = await getQuickChatResponse(history, userMsg.text, currentImageBase64);
      }
      
      const followUpRegex = /\[Follow-up: "([^"]+)"\]/g;
      const extractedFollowUps: string[] = [];
      let match;
      while ((match = followUpRegex.exec(text)) !== null) {
          extractedFollowUps.push(match[1]);
      }
      const cleanedText = text.replace(followUpRegex, '').trim();

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: cleanedText };
      setMessages(prev => [...prev, botMsg]);
      if(extractedFollowUps.length > 0) {
        setFollowUpPrompts(extractedFollowUps);
      }
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
          const audioContext = new AudioContext({ sampleRate: 24000 });
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }

          const dataInt16 = new Int16Array(bytes.buffer);
          const frameCount = dataInt16.length;
          const buffer = audioContext.createBuffer(1, frameCount, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i] / 32768.0;
          }

          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          source.onended = () => { setIsPlayingAudio(false); audioContext.close(); };
      } catch (e) {
          console.error(e);
          setIsPlayingAudio(false);
      }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    handleSend(prompt);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = (reader.result as string).split(',')[1];
              setImagePreview(reader.result as string);
              setImageBase64(base64String);
          };
          reader.readAsDataURL(file);
      }
  }

  return (
    <div className="fixed bottom-4 right-4 w-[420px] h-[700px] bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col border border-slate-700 z-50 overflow-hidden font-sans ring-1 ring-black/5 animate-slide-up">
      {/* Header */}
      <div className="bg-slate-900/70 p-4 flex justify-between items-center text-white shadow-md relative overflow-hidden border-b border-slate-700">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                 <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 60, height: 60}} />
            </div>
            <div>
                <h3 className="font-bold text-lg">WiseBot</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-300">Online</span>
                </div>
            </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-700">&times;</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 1 && suggestedPrompts.length > 0 && (
            <div className="space-y-2 animate-fade-in">
                <p className="text-xs font-bold text-slate-400 uppercase">Starter Suggestions</p>
                {suggestedPrompts.map((p, i) => (
                    <button key={i} onClick={() => handlePromptClick(p)} className="w-full text-left p-3 bg-slate-800 rounded-lg text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                        {p}
                    </button>
                ))}
            </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {m.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><i className="ri-robot-line text-white"></i></div>}
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-md relative group transition-all ${
              m.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-200 rounded-bl-none'
            }`}>
              {m.image && <img src={m.image} alt="User upload" className="rounded-lg mb-2 max-h-40" />}
              {m.text}
              {m.role === 'model' && !isThinking && (
                  <button 
                    onClick={() => playTTS(m.text)}
                    className={`absolute -bottom-3 -right-3 text-slate-400 hover:text-indigo-400 p-1 transition-opacity bg-slate-800 rounded-full shadow-md ${isPlayingAudio ? 'text-indigo-400 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                      <i className="ri-volume-up-line text-sm"></i>
                  </button>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex justify-start animate-fade-in items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><i className="ri-robot-line text-white"></i></div>
             <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
               <LottiePlayer url="https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json" style={{width: 30, height: 30}} />
             </div>
           </div>
        )}
      </div>
      
      {/* Follow-ups */}
      {followUpPrompts.length > 0 && !isThinking && (
          <div className="p-4 border-t border-slate-700 flex flex-wrap gap-2">
              {followUpPrompts.map((p, i) => (
                  <button key={i} onClick={() => handlePromptClick(p)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-full transition-colors">
                      {p}
                  </button>
              ))}
          </div>
      )}

      {/* Input */}
      <div className="p-4 bg-slate-900/70 border-t border-slate-700">
        {imagePreview && (
          <div className="relative w-24 h-24 p-1 border border-slate-600 rounded-lg mb-2">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded"/>
            <button onClick={() => {setImagePreview(null); setImageBase64(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs">&times;</button>
          </div>
        )}
        <div className="relative flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"><i className="ri-attachment-line"></i></button>
          <button onClick={() => recognitionRef.current?.start()} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}><i className="ri-mic-line"></i></button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full pl-4 pr-12 py-3 bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-700 transition-all shadow-inner text-slate-200"
          />
          <button 
            onClick={() => handleSend()}
            disabled={(!input.trim() && !imageBase64) || isThinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md hover:scale-110 active:scale-95"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};