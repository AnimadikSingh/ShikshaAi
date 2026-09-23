import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, CheckCircle2, Award, ArrowLeft, Loader2, Sparkles, Send, BookOpen } from 'lucide-react';
import { evaluateVivaAnswer } from '../services/geminiService';
import { useStudent } from '../context/StudentContext';
import { sounds } from '../services/audioService';

interface VivaExaminerProps {
  onBack: () => void;
}

const TOPICS = [
  "Chemical Reactions & Indicators",
  "Life Processes (Enzymes & Digestion)",
  "Ohm's Law & Circuit Components",
  "Acids, Bases & Neutralization Titration",
  "Reflection & Spherical Mirrors"
];

const QUESTIONS_DB: Record<string, string[]> = {
  "Chemical Reactions & Indicators": [
    "What happens when magnesium ribbon is burned in air, and what type of reaction is it?",
    "Why do we balance chemical equations according to the Law of Conservation of Mass?",
    "What is the color change observed when lead nitrate is heated in a dry boiling tube?"
  ],
  "Life Processes (Enzymes & Digestion)": [
    "What is the specific role of hydrochloric acid (HCl) and pepsin in gastric digestion?",
    "How does the structure of villi in the small intestine optimize nutrient absorption?",
    "Why is bile essential for digestion even though it does not contain digestive enzymes?"
  ],
  "Ohm's Law & Circuit Components": [
    "State Ohm's Law and explain what the physical slope of a V vs I graph represents.",
    "Why is a voltmeter always connected in parallel while an ammeter is connected in series?",
    "How does the electrical resistance of a conductor change when its length is doubled?"
  ],
  "Acids, Bases & Neutralization Titration": [
    "Why does phenolphthalein turn pink in a basic solution and colorless in an acidic solution?",
    "Explain why dry HCl gas fails to change the color of dry blue litmus paper.",
    "What is the role of sodium hydrogen carbonate (baking soda) in antacids?"
  ],
  "Reflection & Spherical Mirrors": [
    "Why do drivers prefer convex mirrors over plane mirrors for rear-view navigation?",
    "Where must an object be placed in front of a concave mirror to produce a virtual, magnified image?"
  ]
};

export const VivaExaminer: React.FC<VivaExaminerProps> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [sessionState, setSessionState] = useState<'SETUP' | 'ASKING' | 'LISTENING' | 'EVALUATING' | 'FEEDBACK'>('SETUP');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [manualText, setManualText] = useState("");
  const [feedback, setFeedback] = useState<{score: number, feedback: string, confidence: number} | null>(null);
  
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interim += event.results[i][0].transcript;
          }
          setTranscript(interim);
        };

        recognitionRef.current.onend = () => {
          // Handled manually
        };
      } catch (e) {
        console.error("Speech recognition initialization error:", e);
      }
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const handleStartSession = () => {
    sounds.playClick();
    const qs = QUESTIONS_DB[selectedTopic] || QUESTIONS_DB["Chemical Reactions & Indicators"];
    const q = qs[Math.floor(Math.random() * qs.length)];
    setCurrentQuestion(q);
    setTranscript("");
    setManualText("");
    setSessionState('ASKING');
    speak(q);
    
    setTimeout(() => {
      setSessionState('LISTENING');
      startListening();
    }, 2500); 
  };

  const startListening = () => {
    try {
      recognitionRef.current?.start();
    } catch(e) { 
      // Mic not allowed or supported; user can still type
    }
  };

  const handleStopListening = async () => {
    sounds.playClick();
    setSessionState('EVALUATING');
    try { recognitionRef.current?.stop(); } catch(e) {}
    
    const finalAnswer = transcript.trim() || manualText.trim() || "The candidate provided no verbal answer.";
    const result = await evaluateVivaAnswer(currentQuestion, finalAnswer);
    setFeedback(result);
    setSessionState('FEEDBACK');
    
    if (result.score >= 70) {
      sounds.playVictory();
      addXP(50);
    } else {
      sounds.playCorrect();
      addXP(20);
    }
    speak(`You scored ${result.score} percent. ${result.feedback}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 font-sans animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Mic size={20} /> AI Viva Voce Examiner
            </h2>
            <p className="text-xs text-teal-100 opacity-80">CBSE Practical Exam Oral Assessment</p>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Live AI Evaluator
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 min-h-[420px] flex flex-col items-center justify-center">
        
        {sessionState === 'SETUP' && (
          <div className="w-full space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
                <Award size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">CBSE Science Oral Exam</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                The AI Board Examiner will pose an authentic NCERT practical question. Answer via voice or live text input to receive instant marks and keyword analysis.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Practical Domain</label>
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button 
              onClick={handleStartSession} 
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
            >
              <Play size={18} fill="currentColor" /> Enter Examination Room
            </button>
          </div>
        )}

        {sessionState === 'ASKING' && (
          <div className="text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-teal-600">
              <Volume2 size={44} />
            </div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Examiner is asking:</h3>
            <p className="text-xl font-bold text-teal-900 max-w-lg leading-relaxed">
              "{currentQuestion}"
            </p>
          </div>
        )}

        {sessionState === 'LISTENING' && (
          <div className="text-center w-full space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 animate-pulse">
                <Mic size={36} />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping"></div>
            </div>
            
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-2">Speak now or type your answer below:</p>
              
              {/* Spoken voice feedback */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 min-h-[70px] text-sm text-slate-800 font-medium">
                {transcript || <span className="text-slate-400 italic">Listening to microphone...</span>}
              </div>

              {/* Text input fallback */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Or type oral answer here..."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleStopListening(); }}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button 
              onClick={handleStopListening} 
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Finish & Submit Answer
            </button>
          </div>
        )}

        {sessionState === 'EVALUATING' && (
          <div className="text-center space-y-3">
            <Loader2 size={44} className="text-teal-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Evaluating Viva Voce Response...</h3>
            <p className="text-xs text-slate-400">Comparing with CBSE NCERT rubrics & scientific terminology.</p>
          </div>
        )}

        {sessionState === 'FEEDBACK' && feedback && (
          <div className="w-full space-y-6 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl font-black border-4 shadow-lg ${
              feedback.score >= 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-amber-100 text-amber-700 border-amber-300'
            }`}>
              {feedback.score}%
            </div>
            
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {feedback.score >= 70 ? 'Outstanding Oral Defense!' : 'Competent Attempt'}
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl text-left border-l-4 border-teal-500">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{feedback.feedback}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-500 font-bold">
                Confidence Rating: <span className="text-slate-900">{feedback.confidence}%</span>
              </div>
              <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 text-teal-700 font-bold">
                XP Earned: <span>+{feedback.score >= 70 ? 50 : 20} XP</span>
              </div>
            </div>

            <button 
              onClick={() => {
                sounds.playClick();
                setSessionState('SETUP');
              }} 
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Next Question
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
