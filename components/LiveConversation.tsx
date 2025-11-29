import React, { useState, useRef, useEffect } from 'react';
import { connectToLiveAPI } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

export const LiveConversation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Initialize Audio Contexts
  const initAudio = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  };

  const startSession = async () => {
    initAudio();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        const audioInputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = audioInputContext.createMediaStreamSource(stream);
        const scriptProcessor = audioInputContext.createScriptProcessor(4096, 1, 1);
        
        inputSourceRef.current = source;
        processorRef.current = scriptProcessor;

        scriptProcessor.onaudioprocess = (e) => {
            if (!sessionRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionRef.current.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };

        source.connect(scriptProcessor);
        scriptProcessor.connect(audioInputContext.destination);

        const sessionPromise = connectToLiveAPI({
            onopen: () => {
                setConnected(true);
            },
            onmessage: async (message: LiveServerMessage) => {
                const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                if (base64Audio) {
                    await playAudioChunk(base64Audio);
                }
            },
            onclose: () => {
                setConnected(false);
                stopSession();
            },
            onerror: (e: any) => {
                console.error(e);
                setConnected(false);
            }
        });

        sessionRef.current = sessionPromise;

    } catch (e) {
        console.error("Failed to start live session", e);
        alert("Microphone access required.");
    }
  };

  const stopSession = () => {
      // Cleanup logic would go here (close contexts, tracks, etc)
      setConnected(false);
      sessionRef.current = null;
      if (processorRef.current) processorRef.current.disconnect();
      if (inputSourceRef.current) inputSourceRef.current.disconnect();
      // Simple reload for cleanup in this demo scope
      window.location.reload(); 
  };

  const createPcmBlob = (data: Float32Array) => {
      const l = data.length;
      const int16 = new Int16Array(l);
      for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
      }
      // Simplified encoding, usually you'd need a proper base64 encoder here
      // For this demo, we assume the helper exists or we implement a basic one
      let binary = '';
      const len = int16.buffer.byteLength;
      const bytes = new Uint8Array(int16.buffer);
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return {
        data: btoa(binary),
        mimeType: 'audio/pcm;rate=16000',
      };
  };

  const playAudioChunk = async (base64: string) => {
      if (!audioContextRef.current) return;
      
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await decodeAudioData(bytes, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      const currentTime = audioContextRef.current.currentTime;
      const startTime = Math.max(nextStartTimeRef.current, currentTime);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
      
      sourcesRef.current.add(source);
      source.onended = () => {
          sourcesRef.current.delete(source);
          if (sourcesRef.current.size === 0) setIsSpeaking(false);
      };
      setIsSpeaking(true);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold mb-2 brand-text-gradient">Live Voice Coach</h2>
            <p className="text-gray-500">Have a real-time conversation with Gemini 2.5 Live API.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100 aspect-video flex flex-col items-center justify-center">
             <video 
               ref={videoRef} 
               autoPlay 
               muted 
               playsInline 
               className={`absolute inset-0 w-full h-full object-cover opacity-50 ${connected ? 'block' : 'hidden'}`}
             />
             
             <div className="relative z-10 flex flex-col items-center gap-6">
                 <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${connected ? 'bg-white/20 backdrop-blur-md shadow-[0_0_50px_rgba(106,115,228,0.5)]' : 'bg-gray-100'}`}>
                     {connected ? (
                         <div className={`w-20 h-20 rounded-full bg-gradient-to-r from-[#6A73E4] to-[#37D0C0] ${isSpeaking ? 'animate-ping' : 'animate-pulse'}`}></div>
                     ) : (
                         <span className="text-4xl">🎙️</span>
                     )}
                 </div>

                 {!connected ? (
                     <button 
                       onClick={startSession}
                       className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                     >
                         Start Conversation
                     </button>
                 ) : (
                     <button 
                       onClick={stopSession}
                       className="px-10 py-4 bg-red-500 text-white rounded-full font-bold text-lg hover:bg-red-600 transition-colors shadow-xl"
                     >
                         End Call
                     </button>
                 )}
                 
                 {connected && (
                     <p className="text-slate-800 font-semibold bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                         {isSpeaking ? "Gemini is speaking..." : "Listening..."}
                     </p>
                 )}
             </div>
        </div>
    </div>
  );
};