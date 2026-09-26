import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { ConceptMap } from '../components/ConceptMap';
import { SmartNotesLibrary } from '../components/SmartNotesLibrary';
import { KnowledgeGraphView } from '../components/KnowledgeGraphView';
import { PersonalizedTextbook } from '../components/PersonalizedTextbook';
import { GameArcade } from '../components/GameArcade';
import { FlashcardsView } from '../components/FlashcardsView';
import { VirtualLab } from '../components/VirtualLab';
import { VivaExaminer } from '../components/VivaExaminer';
import { SocraticDebate } from '../components/SocraticDebate';
import { YouVsAIQuiz } from '../components/YouVsAIQuiz';
import { 
  Home, Compass, Network, FlaskConical, Gamepad2, Layers, Trophy, 
  StickyNote, BookOpen, Flame, Star, Search, Bell, Calendar, 
  X, Sparkles, Loader2, Mic, History, AlertTriangle, ChevronRight, 
  CheckCircle2, LogOut, Check, ArrowRight, ArrowLeft,
  ChevronDown, Menu, Bot, Target, BookMarked, Atom, Zap, Dna
} from 'lucide-react';
import { generateWeeklyPlan } from '../services/geminiService';
import { Quiz } from '../types';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { sounds } from '../services/audioService';

interface DashboardProps {
  onStartSession: (conceptId: string) => void;
  onStartQuiz: (quiz: Quiz) => void; 
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartSession, onStartQuiz, onBack }) => {
  const { digitalTwin, getRecommendedConcept, updateDifficulty, markAsStarted, generateAdaptiveQuiz } = useStudent();
  const nextUp = getRecommendedConcept();
  
  // Navigation Tabs state matching mockup
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'graph' | 'lab' | 'arcade' | 'flashcards' | 'arena' | 'notes' | 'book'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Weekly Plan Modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  
  // Quiz generation modal state
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  // Challenge Arena Sub-mode
  const [arenaMode, setArenaMode] = useState<'MENU' | 'VIVA' | 'DEBATE' | 'QUIZ_BATTLE'>('MENU');
  
  // Explore Courses filter state
  const [courseSubject, setCourseSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('Chemistry');

  // Goals checklist interactive state
  const [todayGoals, setTodayGoals] = useState([
    { id: 1, title: 'Complete 1 concept', progress: '0/1', bar: 15, completed: false },
    { id: 2, title: 'Attempt 10 questions', progress: '3/10', bar: 30, completed: false },
    { id: 3, title: 'Run a lab simulation', progress: '0/1', bar: 10, completed: false },
    { id: 4, title: 'Review flashcards', progress: '8/15', bar: 53, completed: false }
  ]);

  const handleGeneratePlan = async () => {
    setShowPlanModal(true);
    if (!studyPlan) {
      setLoadingPlan(true);
      const plan = await generateWeeklyPlan(digitalTwin);
      setStudyPlan(plan);
      setLoadingPlan(false);
    }
  };

  const handleConceptClick = (id: string) => {
    markAsStarted(id); 
    onStartSession(id);
  };

  const handleQuizStart = async (chapterId: string) => {
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateAdaptiveQuiz(chapterId);
      onStartQuiz(quiz);
    } catch (e) {
      console.error("Quiz generation failed", e);
      alert("Could not generate quiz. Please check connection.");
    }
    setIsGeneratingQuiz(false);
  };

  // Nav Items matching exact left sidebar in media_1790433716001.jpg
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Explore Courses', icon: Compass },
    { id: 'graph', label: 'Brain Web', icon: Network },
    { id: 'lab', label: 'Virtual Lab', icon: FlaskConical },
    { id: 'arcade', label: 'Knowledge Arcade', icon: Gamepad2 },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'arena', label: 'Challenge Arena', icon: Trophy },
    { id: 'notes', label: 'My Notebook', icon: StickyNote },
    { id: 'book', label: 'My Book', icon: BookOpen }
  ] as const;

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col md:flex-row text-slate-800 antialiased">
      
      {/* Quiz Loading Overlay */}
      {isGeneratingQuiz && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold">Constructing Adaptive Quiz...</h3>
          <p className="text-sm text-slate-300 mt-1">Personalizing questions based on your performance.</p>
        </div>
      )}

      {/* ============================================================== */}
      {/* PERSISTENT LEFT SIDEBAR NAVIGATION (Spacious, Clean)           */}
      {/* ============================================================== */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/90 z-40
        flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header: Square SA logo + ShikshaAI + CBSE 10 STEM */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/15">
              SA
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">ShikshaAI</div>
              <div className="text-[11px] font-semibold text-slate-400 tracking-tight leading-none mt-1">
                CBSE 10 STEM
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items with Generous Padding */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(item.id as any);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                  isActive 
                    ? 'bg-indigo-50/90 text-indigo-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={17} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: 7-Day Streak & Account Switch */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          
          {/* 7 Day Streak capsule card */}
          <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Flame size={20} fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-slate-900 leading-tight">7 Day Streak</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Keep going! 🔥</div>
            </div>
          </div>

          {/* User Role Logout Button */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut size={14} /> Exit Portal
            </span>
            <span className="text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-bold">Role</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* ============================================================== */}
      {/* MAIN CONTENT AREA WITH PERSISTENT HEADER                        */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar with Proper Height and Alignment */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16 px-6 lg:px-8 flex items-center justify-between gap-5 shadow-2xs">
          
          {/* Left: Mobile Toggle & Global Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              <Menu size={20} />
            </button>

            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search concepts, chapters, experiments..."
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 pl-9 pr-14 py-2 rounded-xl border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 font-bold">
                Ctrl K
              </div>
            </div>
          </div>

          {/* Right: Telemetry Badges & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Streak Counter: Fire + 1d */}
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Flame size={14} fill="currentColor" />
              <span>1d</span>
            </div>

            {/* XP Counter: Star + 9 XP */}
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Star size={14} fill="currentColor" />
              <span>9 XP</span>
            </div>

            {/* Role Badge: Lab Assistant */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Bot size={14} className="text-indigo-600" />
              <span>Lab Assistant</span>
            </div>

            {/* Notification Bell */}
            <button 
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Amit Sharma</div>
                <div className="text-[10px] text-slate-400 font-medium">Class 10 Scholar</div>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Main Body Content with Generous Padding */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto animate-[fadeIn_0.2s_ease-out]">
          
          {/* ========================================================== */}
          {/* TAB 1: HOME VIEW (Screen 1 in media_1790433716001.jpg)      */}
          {/* ========================================================== */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              
              {/* Hero Banner with Comfortable Proportions & High Visual Polish */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 md:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Left Column: Greeting & Action Buttons */}
                <div className="w-full lg:w-1/2 space-y-5">
                  <div className="text-sm font-bold text-slate-400 tracking-wide uppercase">
                    Hey Amit,
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Let's Make <span className="text-blue-600">Science Click</span>
                  </h1>

                  <div className="text-xs md:text-sm font-semibold text-slate-400 tracking-wider">
                    Learn • Visualize • Experiment • Practice • Master
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (nextUp) handleConceptClick(nextUp.id);
                        else setActiveTab('courses');
                      }}
                      className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs md:text-sm px-7 py-3.5 rounded-full shadow-sm flex items-center gap-2.5 transition-all hover:scale-105"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      onClick={handleGeneratePlan}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs md:text-sm px-6 py-3.5 rounded-full shadow-2xs flex items-center gap-2.5 transition-all"
                    >
                      <Calendar size={16} className="text-indigo-600" />
                      <span>My Weekly Plan</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Authentic Study Desk scene with floating AI Robot Mentor */}
                <div className="w-full lg:w-1/2 relative flex justify-center">
                  <div className="relative w-full max-w-lg h-60 md:h-68 rounded-3xl overflow-hidden shadow-md border border-slate-200/80 group">
                    <img 
                      src="/images/desk_mentor.jpg" 
                      alt="Student Study Desk with AI Robot Mentor" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Speech Bubble Quote matching mockup */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg max-w-[240px]">
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        "Small concepts build big possibilities."
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                        <Bot size={13} className="text-indigo-600" /> — Your AI Mentor
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* 6 Quick Access Cards Row - Spacious & Substantial */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                
                {/* 1: Explore Courses */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('courses'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Compass size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Explore Courses
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Complete Chapters</p>
                  </div>
                </div>

                {/* 2: Brain Web */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('graph'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Network size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      Brain Web
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Visualize Concepts</p>
                  </div>
                </div>

                {/* 3: Virtual Lab */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('lab'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <FlaskConical size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Virtual Lab
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Interactive Experiments</p>
                  </div>
                </div>

                {/* 4: Knowledge Arcade */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('arcade'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Gamepad2 size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Knowledge Arcade
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Practice & Play</p>
                  </div>
                </div>

                {/* 5: Flashcards */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('flashcards'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                      Flashcards
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Quick Revision</p>
                  </div>
                </div>

                {/* 6: Challenge Arena */}
                <div 
                  onClick={() => { sounds.playClick(); setActiveTab('arena'); }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-yellow-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center min-h-[160px] justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">
                      Challenge Arena
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Compete & Grow</p>
                  </div>
                </div>

              </div>

              {/* Bottom Row: Today's Goals (col-span-8) and Learning Streak (col-span-4) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Today's Goals with Comfortable Cards */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 text-sm font-extrabold">
                      <Target size={17} className="text-blue-600" />
                      <span>Today's Goals</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">Daily Target: 4 Modules</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
                    {todayGoals.map((g) => (
                      <div key={g.id} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between min-h-[105px]">
                        <div>
                          <div className="text-xs font-bold text-slate-700 leading-snug">{g.title}</div>
                          <div className="text-sm font-black text-slate-900 mt-1.5">{g.progress}</div>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${g.bar}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Streak with Generous Spacing */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame size={15} className="text-orange-500" /> Learning Streak
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-1.5 flex items-center gap-2">
                      <span className="text-orange-500">🔥</span> 7 days
                    </div>
                  </div>

                  {/* 7-day circular dots with improved size & labels */}
                  <div className="flex items-center justify-between pt-3">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">{day}</span>
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          ✓
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: EXPLORE COURSES (Screen 2 in media_1790433716001.jpg) */}
          {/* ========================================================== */}
          {activeTab === 'courses' && (
            <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
              
              {/* Header Title with Back button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Explore Courses</h2>
                    <p className="text-xs md:text-sm text-slate-400">Dive into structured, visual and interactive learning experiences.</p>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search chapters, topics..."
                    className="w-full bg-white text-xs font-medium text-slate-800 placeholder-slate-400 pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-400 shadow-2xs"
                  />
                </div>
              </div>

              {/* Filters Bar: Subject Pills & Class 10 (CBSE) Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {(['All Subjects', 'Chemistry', 'Physics', 'Biology'] as const).map((sub) => {
                    const isSelected = (sub === 'All Subjects' && courseSubject === 'All') || (courseSubject === sub);
                    return (
                      <button
                        key={sub}
                        onClick={() => setCourseSubject(sub === 'All Subjects' ? 'All' : sub)}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#0f172a] text-white shadow-xs' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                  <span>Class 10 (CBSE)</span>
                  <ChevronDown size={15} className="text-slate-400" />
                </div>
              </div>

              {/* 3 Rich Visual Course Cards matching Screen 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Chemistry Course Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Course Banner Image */}
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <img 
                        src="/images/chem_lab.jpg" 
                        alt="Chemistry Laboratory" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-purple-600/90 backdrop-blur-xs flex items-center justify-center text-white shadow-sm">
                        <FlaskConical size={18} />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-black text-slate-900 text-lg">Chemistry</h3>
                      <p className="text-xs text-slate-400 mt-1">16 Chapters • 240 Lessons</p>

                      <div className="mt-5 space-y-2">
                        <div className="text-xs font-bold text-slate-500">32% Complete</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full w-[32%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex justify-end">
                    <button 
                      onClick={() => handleConceptClick('chem_rxn_types')}
                      className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Physics Course Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Course Banner Image */}
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <img 
                        src="/images/physics_prism.jpg" 
                        alt="Physics Prism Dispersion" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-blue-600/90 backdrop-blur-xs flex items-center justify-center text-white shadow-sm">
                        <Zap size={18} />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-black text-slate-900 text-lg">Physics</h3>
                      <p className="text-xs text-slate-400 mt-1">15 Chapters • 220 Lessons</p>

                      <div className="mt-5 space-y-2">
                        <div className="text-xs font-bold text-slate-500">20% Complete</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full w-[20%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex justify-end">
                    <button 
                      onClick={() => handleConceptClick('light_reflection')}
                      className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Biology Course Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Course Banner Image */}
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <img 
                        src="/images/bio_dna.jpg" 
                        alt="Biology DNA and Living Systems" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-emerald-600/90 backdrop-blur-xs flex items-center justify-center text-white shadow-sm">
                        <Dna size={18} />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-black text-slate-900 text-lg">Biology</h3>
                      <p className="text-xs text-slate-400 mt-1">16 Chapters • 210 Lessons</p>

                      <div className="mt-5 space-y-2">
                        <div className="text-xs font-bold text-slate-500">12% Complete</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full w-[12%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex justify-end">
                    <button 
                      onClick={() => handleConceptClick('bio_photosynthesis')}
                      className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Popular Topics Section matching Screen 2 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-800">Popular Topics</div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View All &gt;</button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    'Chemical Reactions', 
                    'Acids, Bases & Salts', 
                    'Metals & Non-metals', 
                    'Carbon Compounds', 
                    'Electricity', 
                    'Life Processes'
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setActiveTab('graph')}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-2xs"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curriculum Concept Map underneath for complete exploration */}
              <div className="mt-8 pt-8 border-t border-slate-200/80">
                <ConceptMap onSelectConcept={handleConceptClick} onStartQuiz={handleQuizStart} />
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: REALISTIC VIRTUAL LAB (Screen 4)                    */}
          {/* ========================================================== */}
          {activeTab === 'lab' && <VirtualLab onBack={() => setActiveTab('home')} />}

          {/* ========================================================== */}
          {/* TAB 4: BRAIN WEB (Screen 3)                                */}
          {/* ========================================================== */}
          {activeTab === 'graph' && <KnowledgeGraphView onBack={() => setActiveTab('home')} />}

          {/* ========================================================== */}
          {/* TAB 5: KNOWLEDGE ARCADE (Screen 5)                         */}
          {/* ========================================================== */}
          {activeTab === 'arcade' && <GameArcade onBack={() => setActiveTab('home')} />}

          {/* ========================================================== */}
          {/* TAB 6: SCIENTIFIC FLASHCARDS (Screen 6)                    */}
          {/* ========================================================== */}
          {activeTab === 'flashcards' && <FlashcardsView onBack={() => setActiveTab('home')} />}

          {/* ========================================================== */}
          {/* TAB 7: CHALLENGE ARENA (Screen 7)                          */}
          {/* ========================================================== */}
          {activeTab === 'arena' && (
            <div className="w-full space-y-6 animate-[fadeIn_0.2s_ease-out]">
              {arenaMode === 'MENU' && (
                <div className="space-y-6">
                  
                  {/* Top Bar matching Screen 7 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <button 
                        onClick={() => setActiveTab('home')}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">Challenge Arena</h2>
                        <p className="text-xs md:text-sm text-slate-400">Compete, practice and test your knowledge with AI.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                        <span>Live Now</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                        ⏱ 00:12:35
                      </div>
                    </div>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setArenaMode('VIVA')}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs"
                    >
                      AI Viva Examiner
                    </button>
                    <button 
                      className="px-5 py-2 rounded-full text-xs font-bold bg-[#0f172a] text-white shadow-xs"
                    >
                      You vs AI Battle
                    </button>
                    <button 
                      onClick={() => setArenaMode('DEBATE')}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs"
                    >
                      Debate Arena
                    </button>
                  </div>

                  {/* Student vs AI Battle Card matching Screen 7 */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Visual Banner */}
                    <div className="lg:col-span-8 rounded-2xl overflow-hidden relative shadow-md border border-slate-200">
                      <img 
                        src="/images/arena_battle.jpg" 
                        alt="Student vs AI Robot Battle Showdown" 
                        className="w-full h-80 md:h-96 object-cover"
                      />
                    </div>

                    {/* Right Info Box */}
                    <div className="lg:col-span-4 space-y-5">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Topic</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">Chemical Reactions</h3>
                      </div>

                      <div className="space-y-2.5 border-y border-slate-100 py-4 text-xs md:text-sm text-slate-600">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>5 Adaptive Questions</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Zap size={16} className="text-amber-500" />
                          <span>2x Speed Scoring Multiplier</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Star size={16} className="text-indigo-500" />
                          <span>+50 XP on Victory</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setArenaMode('QUIZ_BATTLE')}
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs md:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Start Battle</span>
                        <ArrowRight size={16} />
                      </button>

                      <div className="text-center">
                        <button className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                          How it works?
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Sub-modes with Back Button */}
              {arenaMode === 'VIVA' && <VivaExaminer onBack={() => setArenaMode('MENU')} />}
              {arenaMode === 'DEBATE' && <SocraticDebate onBack={() => setArenaMode('MENU')} />}
              {arenaMode === 'QUIZ_BATTLE' && <YouVsAIQuiz onBack={() => setArenaMode('MENU')} />}
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 8: SMART NOTES LIBRARY                                 */}
          {/* ========================================================== */}
          {activeTab === 'notes' && <SmartNotesLibrary />}

          {/* ========================================================== */}
          {/* TAB 9: PERSONALIZED TEXTBOOK                               */}
          {/* ========================================================== */}
          {activeTab === 'book' && <PersonalizedTextbook />}

        </main>

      </div>

      {/* ============================================================== */}
      {/* POWER WEEK PLAN MODAL                                          */}
      {/* ============================================================== */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Calendar size={20} className="text-indigo-600" /> My 5-Day Power Week Plan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customized for {digitalTwin.name} • {digitalTwin.learningStyle.toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => setShowPlanModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {loadingPlan ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <Loader2 size={36} className="animate-spin text-indigo-600 mb-3" />
                  <p className="font-bold text-slate-700">Generating study plan...</p>
                </div>
              ) : studyPlan ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  {studyPlan}
                </div>
              ) : (
                <p className="text-center text-slate-400">Failed to load plan.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
