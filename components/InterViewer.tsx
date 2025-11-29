import React, { useRef, useState, useEffect } from 'react';
import { transcribeAudio, analyzeInterviewPerformance, getInterviewQuestion, getInterviewFollowUp } from '../services/geminiService';
import { LottiePlayer } from './LottiePlayer';

interface AnalysisResult {
  verbal: { score: number; advice: string[] };
  nonVerbal: { score: number; advice: string[] };
  content: { score: number; advice: string[] };
  confidence: { score: number; advice: string[] };
  strengths: string[];
  weaknesses: string[];
  pros: string[];
  cons: string[];
  overallSummary: string;
}

interface RecordingSegment {
  id: string;
  blob: Blob;
  url: string;
  question: string;
  frameBase64: string | null;
  transcription?: string;
  analysis?: AnalysisResult;
  timestamp: Date;
}

// Audio Visualizer Component
const AudioVisualizer: React.FC<{ audioStream: MediaStream | null }> = ({ audioStream }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    useEffect(() => {
        if (!audioStream || !canvasRef.current) return;

        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtxClass({ sampleRate: 44100 } as any); // Type assertion for compatibility
        
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(audioStream);
        
        source.connect(analyser);
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            if (!ctx) return;
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(15, 23, 42)'; // Background match
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 1.5;
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#37D0C0');
                gradient.addColorStop(1, '#6A73E4');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioCtx.state !== 'closed') audioCtx.close();
        };
    }, [audioStream]);

    return <canvas ref={canvasRef} className="w-full h-12 rounded-b-xl" width={300} height={50} />;
};

export const InterViewer: React.FC = () => {
  // State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mode, setMode] = useState<'setup' | 'interview' | 'analysis'>('setup');
  
  // Interview Data
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [topic, setTopic] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recordings, setRecordings] = useState<RecordingSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Tools
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Init Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setLiveTranscript(prev => prev + ' ' + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Update UI with interim for live feel
            const display = document.getElementById('live-transcript-display');
            if (display) display.innerText = interimTranscript || "...";
        };
        recognitionRef.current = recognition;
    }
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;
        setIsCameraOn(true);
      }
    } catch (err) {
      alert("Camera access required for the full experience.");
    }
  };

  const startMockInterview = async () => {
      setLoading(true);
      try {
          const q = await getInterviewQuestion(topic || "General Professional");
          setQuestion(q);
          setMode('interview');
          if (!isCameraOn) await startCamera();
      } catch(e) {
          alert("Could not start interview.");
      } finally {
          setLoading(false);
      }
  };

  const toggleRecording = () => {
      if (recording) {
          stopRecording();
      } else {
          startRecording();
      }
  };

  const startRecording = () => {
     if(!videoRef.current?.srcObject) return;
     const stream = videoRef.current.srcObject as MediaStream;
     const mediaRecorder = new MediaRecorder(stream);
     mediaRecorderRef.current = mediaRecorder;
     chunksRef.current = [];
     setLiveTranscript(""); // Reset transcript

     if (recognitionRef.current) recognitionRef.current.start();

     mediaRecorder.ondataavailable = (event) => {
         if (event.data.size > 0) chunksRef.current.push(event.data);
     };

     mediaRecorder.start();
     setRecording(true);
  };

  const stopRecording = () => {
      if (!mediaRecorderRef.current) return;
      if (recognitionRef.current) recognitionRef.current.stop();

      const frameBase64 = captureFrame();

      mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const finalTranscript = document.getElementById('live-transcript-display')?.innerText || liveTranscript;
          
          const newSegment: RecordingSegment = {
              id: Date.now().toString(),
              blob,
              url,
              question,
              frameBase64,
              transcription: finalTranscript, // Capture immediate transcript
              timestamp: new Date()
          };
          setRecordings(prev => [newSegment, ...prev]);
          analyzeSegment(newSegment); // Auto-analyze
      };

      mediaRecorderRef.current.stop();
      setRecording(false);
  };

  const nextQuestion = async () => {
      setLoading(true);
      const lastAnswer = recordings[0]?.transcription || "I am a hard worker.";
      const newQ = await getInterviewFollowUp(question, lastAnswer);
      setQuestion(newQ);
      setLoading(false);
  };

  const captureFrame = (): string | null => {
      if (!videoRef.current) return null;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg').split(',')[1];
  };

  const analyzeSegment = async (segment: RecordingSegment) => {
      setAnalyzingId(segment.id);
      try {
          // Fallback if browser speech rec failed
          let textToAnalyze = segment.transcription;
          if (!textToAnalyze || textToAnalyze.length < 5) {
               const reader = new FileReader();
               reader.readAsDataURL(segment.blob);
               await new Promise(r => reader.onloadend = r);
               const base64Video = (reader.result as string).split(',')[1];
               textToAnalyze = await transcribeAudio(base64Video);
          }

          const analysis = await analyzeInterviewPerformance(
              `Question: ${segment.question}. Answer: ${textToAnalyze}`, 
              segment.frameBase64
          );

          setRecordings(prev => prev.map(r => r.id === segment.id ? { ...r, transcription: textToAnalyze, analysis } : r));
          setSelectedSegmentId(segment.id);
          if (mode === 'interview') setMode('analysis');
      } catch (e) {
          console.error(e);
      } finally {
          setAnalyzingId(null);
      }
  };

  const selectedSegment = recordings.find(r => r.id === selectedSegmentId);

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen flex flex-col font-sans">
      
      {/* --- SETUP MODE --- */}
      {mode === 'setup' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center">
              <div className="w-40 h-40 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-float">
                   <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 120, height: 120}} />
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4">Ultimate Mock Interviewer</h1>
              <p className="text-xl text-slate-400 max-w-2xl mb-8">
                  Experience a real-time interview simulation with live feedback, audio visualization, and deep AI analysis of your verbal and non-verbal cues.
              </p>
              
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 w-full max-w-md mb-8">
                  <label className="text-sm font-bold text-slate-400 mb-2 block text-left">Target Role / Topic</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Senior React Developer, Marketing Manager" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
              </div>

              <button 
                onClick={startMockInterview}
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:scale-105 transition-all flex items-center gap-3"
              >
                  {loading ? 'Setting up Studio...' : 'Start Interview Session'} <i className="ri-arrow-right-line"></i>
              </button>
          </div>
      )}

      {/* --- INTERVIEW / ANALYSIS MODE --- */}
      {mode !== 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              
              {/* LEFT: Interviewer Persona & Question */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                       <div className="relative z-10 flex flex-col items-center text-center">
                           <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-4 shadow-inner">
                               <LottiePlayer url="https://assets5.lottiefiles.com/packages/lf20_m9zragmd.json" style={{width: 80, height: 80}} />
                           </div>
                           <h3 className="text-teal-400 font-bold uppercase tracking-widest text-xs mb-2">AI Interviewer</h3>
                           <p className="text-white text-xl font-bold leading-relaxed mb-6">"{question}"</p>
                           
                           <div className="flex gap-3">
                               <button onClick={nextQuestion} disabled={loading} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-semibold transition-colors">
                                   Skip / Next
                               </button>
                               <button onClick={() => {
                                   const msg = new SpeechSynthesisUtterance(question);
                                   window.speechSynthesis.speak(msg);
                               }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-semibold transition-colors">
                                   <i className="ri-volume-up-line"></i> Listen
                               </button>
                           </div>
                       </div>
                  </div>

                  <div className="flex-1 bg-slate-800/50 rounded-3xl border border-slate-700 p-4 overflow-y-auto custom-scrollbar">
                      <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider">Session History</h4>
                      {recordings.map(seg => (
                          <div key={seg.id} onClick={() => { setSelectedSegmentId(seg.id); setMode('analysis'); }} className={`p-3 rounded-xl mb-2 cursor-pointer border transition-all ${selectedSegmentId === seg.id ? 'bg-teal-900/30 border-teal-500' : 'bg-slate-900 border-transparent hover:border-slate-600'}`}>
                              <p className="text-white text-sm font-medium line-clamp-1">{seg.question}</p>
                              <div className="flex justify-between mt-1">
                                  <span className="text-xs text-slate-500">{seg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  {seg.analysis && <span className="text-xs text-green-400">Analyzed</span>}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* CENTER/RIGHT: User Camera & Dashboard */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* Camera Stage */}
                  <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video group">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-white/5 transition-all rounded-3xl"></div>
                      
                      {/* Live Transcription Overlay */}
                      {recording && (
                          <div className="absolute bottom-20 left-4 right-4 flex justify-center">
                              <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg max-w-lg">
                                  <LottiePlayer url="https://assets10.lottiefiles.com/packages/lf20_jpp4ne6x.json" style={{width: 30, height: 30}} />
                                  <span id="live-transcript-display" className="text-white text-lg font-medium truncate">
                                      Listening...
                                  </span>
                              </div>
                          </div>
                      )}

                      {/* Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${recording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                              <span className="text-white font-mono text-sm">{recording ? 'REC 00:00' : 'STANDBY'}</span>
                          </div>
                          
                          <button 
                            onClick={toggleRecording}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 ${recording ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}
                          >
                              {recording ? <div className="w-6 h-6 bg-red-600 rounded-sm"></div> : <div className="w-6 h-6 bg-white rounded-full"></div>}
                          </button>

                          <div className="w-32">
                              {/* Audio Viz Placeholder if needed, main viz is below */}
                          </div>
                      </div>
                  </div>

                  {/* Audio Viz Bar */}
                  {isCameraOn && <AudioVisualizer audioStream={stream} />}

                  {/* ANALYSIS DASHBOARD */}
                  {mode === 'analysis' && selectedSegment?.analysis ? (
                      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 animate-slide-up">
                          <div className="flex justify-between items-end mb-8">
                              <div>
                                  <h2 className="text-3xl font-bold text-white mb-2">Performance Report</h2>
                                  <p className="text-slate-400">AI Analysis of your answer</p>
                              </div>
                              <button onClick={() => setMode('interview')} className="text-teal-400 font-bold hover:underline flex items-center gap-2">
                                  <i className="ri-arrow-left-line"></i> Back to Interview
                              </button>
                          </div>

                          {/* Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                              <StatCard label="Verbal" score={selectedSegment.analysis.verbal.score} color="blue" />
                              <StatCard label="Non-Verbal" score={selectedSegment.analysis.nonVerbal.score} color="purple" />
                              <StatCard label="Content" score={selectedSegment.analysis.content.score} color="emerald" />
                              <StatCard label="Confidence" score={selectedSegment.analysis.confidence.score} color="amber" />
                          </div>

                          {/* Detailed Lists */}
                          <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                  <FeedbackSection icon="ri-thumb-up-line" title="Strengths" items={selectedSegment.analysis.strengths} color="text-green-400" />
                                  <FeedbackSection icon="ri-add-circle-line" title="Pros" items={selectedSegment.analysis.pros} color="text-blue-400" />
                              </div>
                              <div className="space-y-6">
                                  <FeedbackSection icon="ri-thumb-down-line" title="Weaknesses" items={selectedSegment.analysis.weaknesses} color="text-red-400" />
                                  <FeedbackSection icon="ri-indeterminate-circle-line" title="Cons & Gaps" items={selectedSegment.analysis.cons} color="text-orange-400" />
                              </div>
                          </div>

                          <div className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                              <h4 className="text-white font-bold mb-2 flex items-center gap-2"><i className="ri-lightbulb-flash-line text-yellow-400"></i> Overall Summary</h4>
                              <p className="text-slate-300 leading-relaxed">{selectedSegment.analysis.overallSummary}</p>
                          </div>
                      </div>
                  ) : (
                      <div className="flex-1 bg-slate-800/30 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center text-slate-500 p-8 text-center min-h-[300px]">
                          {analyzingId ? (
                              <>
                                  <LottiePlayer url="https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json" style={{width: 150, height: 150}} />
                                  <p className="mt-4 text-white font-medium animate-pulse">Analyzing Verbal & Non-Verbal Cues...</p>
                              </>
                          ) : (
                              <>
                                  <i className="ri-bar-chart-grouped-line text-5xl mb-4 opacity-50"></i>
                                  <p>Record an answer to generate a detailed AI report card.</p>
                              </>
                          )}
                      </div>
                  )}

              </div>
          </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ label, score, color }: { label: string, score: number, color: string }) => {
    const colorClasses: {[key: string]: string} = {
        blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    };
    
    return (
        <div className={`rounded-2xl p-4 border ${colorClasses[color]} flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300`}>
            <span className="text-3xl font-bold mb-1">{score}</span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">{label}</span>
        </div>
    );
};

const FeedbackSection = ({ icon, title, items, color }: { icon: string, title: string, items: string[], color: string }) => (
    <div>
        <h4 className={`font-bold mb-3 flex items-center gap-2 ${color}`}>
            <i className={icon}></i> {title}
        </h4>
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <span className="mt-0.5">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);