import React, { useState } from 'react';
import { 
  GraduationCap, Users, BarChart3, ArrowRight, Play, 
  X, BookOpen, FlaskConical, Sprout, FileText, ChevronDown,
  ArrowLeft, Sparkles, Code2, Cpu, Share2
} from 'lucide-react';
import { UserRole } from '../types';
import { sounds } from '../services/audioService';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onOpenLogin: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onOpenLogin }) => {
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [activePortalIndex, setActivePortalIndex] = useState(0);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const portals = [
    {
      id: 'student' as UserRole,
      title: 'Student Portal',
      description: 'Access NCERT lessons, 3D virtual labs, adaptive quizzes and your personalized learning path.',
      tags: ['Learn', 'Practice', 'Explore', 'Track'],
      icon: GraduationCap,
      accentBg: 'bg-[#e8f1fd]',
      iconColor: 'text-blue-600',
      cardBg: 'bg-gradient-to-br from-white via-white to-blue-50/70',
      cardBorder: 'border-blue-100/80',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      id: 'teacher' as UserRole,
      title: 'Teacher Co-Pilot',
      description: 'Real-time classroom insights, concept heatmaps, automated worksheets and AI-powered lesson planning.',
      tags: ['Analytics', 'Lesson Plans', 'Worksheets', 'AI Tools'],
      icon: Users,
      accentBg: 'bg-[#e6f8ee]',
      iconColor: 'text-emerald-600',
      cardBg: 'bg-gradient-to-br from-white via-white to-emerald-50/70',
      cardBorder: 'border-emerald-100/80',
      buttonBg: 'bg-[#22c55e] hover:bg-[#16a34a] text-white',
    },
    {
      id: 'official' as UserRole,
      title: 'District Official',
      description: 'NITI Aayog aligned education benchmarks, learning gap heatmaps and resource audit telemetry.',
      tags: ['Reports', 'Equity Metrics', 'Gap Analysis', 'Planning'],
      icon: BarChart3,
      accentBg: 'bg-[#fef6e5]',
      iconColor: 'text-amber-600',
      cardBg: 'bg-gradient-to-br from-white via-white to-amber-50/70',
      cardBorder: 'border-amber-100/80',
      buttonBg: 'bg-[#f59e0b] hover:bg-[#d97706] text-white',
    },
  ];

  const handleNextPortal = () => {
    sounds.playClick();
    setActivePortalIndex((prev) => (prev + 1) % portals.length);
  };

  const handlePrevPortal = () => {
    sounds.playClick();
    setActivePortalIndex((prev) => (prev - 1 + portals.length) % portals.length);
  };

  const handleTopicClick = (topicName: string) => {
    sounds.playClick();
    setActiveTopic(topicName);
    setTimeout(() => setActiveTopic(null), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#ccff00] selection:text-black relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION HEADER                                       */}
      {/* ============================================================== */}
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left Brand Logo */}
          <div 
            onClick={() => {
              sounds.playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center font-black text-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              SA
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              ShikshaAI
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Curriculum', href: '#features' },
              { label: 'Virtual Lab', href: '#features' },
              { label: 'Brain Web', href: '#features' },
              { label: 'NEP 2020', href: '#features' },
              { label: 'Contact', href: '#footer' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => sounds.playClick()}
                className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Auth Controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLogin('student');
              }}
              className="text-sm font-semibold text-slate-800 hover:text-black transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                const el = document.getElementById('portals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onOpenLogin('student');
              }}
              className="bg-black hover:bg-slate-800 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95 group"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-pointer hover:text-black select-none">
              <span>EN</span>
              <ChevronDown size={14} />
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. FULL-BLEED MULTI-LAYER HERO SECTION                         */}
      {/* Built with real CSS typography, cloud depth, and crisp assets  */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden bg-white min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
        
        {/* ------------------------------------------------------------ */}
        {/* LAYER 1: BASE MOUNTAIN LANDSCAPE BACKGROUND                  */}
        {/* With natural left-side pure white gradient fade              */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <img
            src="/images/mountain-landscape.jpg"
            alt="Himalayan mountain background"
            className="w-full h-full object-cover object-center"
          />

          {/* Left Side Seamless Pure White Fade (eliminates any harsh image cut) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #ffffff 0%, #ffffff 24%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.3) 50%, transparent 65%)',
            }}
          />

          {/* Top subtle sky fade */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 2: GIANT "SHIKSHA" VECTOR TYPOGRAPHY                   */}
        {/* Real CSS text behind the mountain clouds with focus glow    */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute top-[8%] sm:top-[6%] left-0 right-0 w-full text-center select-none pointer-events-none z-10 overflow-hidden">
          <h1 className="text-[14vw] sm:text-[13vw] lg:text-[160px] 2xl:text-[185px] font-[900] leading-none tracking-tight uppercase shiksha-gradient-text animate-shiksha-focus">
            SHIKSHA
          </h1>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 3: FOREGROUND MOUNTAIN CLOUDS IN FRONT OF "SHIKSHA"    */}
        {/* Gives real physical depth: clouds roll over lower letters    */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-15 overflow-hidden flex items-end">
          <img
            src="/images/clouds-depth-layer.png"
            alt="Foreground Clouds Overlapping SHIKSHA"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 4: CENTER MIND BRAIN WITH GREEN SPROUT & 6 PILLS       */}
        {/* Crisp 918x566 resolution with bioluminescent aura & pills   */}
        {/* ------------------------------------------------------------ */}
        <div className="hidden lg:flex absolute left-[51%] -translate-x-1/2 top-[47%] -translate-y-1/2 z-20 pointer-events-auto">
          <div className="relative w-[480px] h-[360px] flex items-center justify-center select-none">
            
            {/* Ambient Bioluminescent Glow Halo */}
            <div 
              className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-70 animate-orb-glow"
              style={{
                background: 'radial-gradient(circle, rgba(163, 230, 53, 0.5) 0%, rgba(34, 197, 94, 0.4) 35%, rgba(6, 182, 212, 0.3) 65%, transparent 80%)',
              }}
            />

            {/* High-Resolution Mind Sprout Centerpiece */}
            <img
              src="/images/mind-sprout-clean.png"
              alt="Neural Mind with Knowledge Sprout"
              className="w-[380px] h-auto object-contain drop-shadow-[0_12px_30px_rgba(34,197,94,0.4)] animate-float-gentle"
            />

            {/* 6 Real Interactive Floating Subject Pills */}
            
            {/* 1. Science Pill (Top) */}
            <div
              onClick={() => handleTopicClick('Science (Chemistry & Physics)')}
              className="absolute top-2 left-[28%] -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-emerald-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FlaskConical size={12} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Science
              </span>
            </div>

            {/* 2. Mathematics Pill (Top Right) */}
            <div
              onClick={() => handleTopicClick('Mathematics & Geometry')}
              className="absolute top-8 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-blue-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                √x
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                Mathematics
              </span>
            </div>

            {/* 3. Coding Pill (Center Left) */}
            <div
              onClick={() => handleTopicClick('Coding & Computational Thinking')}
              className="absolute top-[48%] -left-3 -translate-y-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-indigo-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Code2 size={12} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                Coding
              </span>
            </div>

            {/* 4. AI Pill (Center Right) */}
            <div
              onClick={() => handleTopicClick('AI & Adaptive Socratic Coaching')}
              className="absolute top-[48%] -right-2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-cyan-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Cpu size={12} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">
                AI
              </span>
            </div>

            {/* 5. English Pill (Bottom Left) */}
            <div
              onClick={() => handleTopicClick('English & Literature')}
              className="absolute bottom-6 left-8 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-amber-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <BookOpen size={12} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                English
              </span>
            </div>

            {/* 6. Social Science Pill (Bottom Right) */}
            <div
              onClick={() => handleTopicClick('Social Science & History')}
              className="absolute bottom-5 right-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-lime-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer z-30 group"
            >
              <span className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
                <Share2 size={12} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-lime-700 transition-colors">
                Social Science
              </span>
            </div>

          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 5: THE BOY ON THE ROCK (CUTOUT ON RIGHT)               */}
        {/* Crisp transparent PNG looking across the mountain vista     */}
        {/* ------------------------------------------------------------ */}
        <div className="hidden md:flex absolute right-0 bottom-0 w-[42%] max-w-[560px] h-[82%] lg:h-[88%] pointer-events-none select-none z-25 overflow-hidden items-end justify-end">
          <img
            src="/images/boy-cutout.png"
            alt="Student with ShikshaAI backpack on mountain"
            className="w-full h-full object-contain object-right-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 6: TOP RIGHT SCRIPT LABEL                              */}
        {/* ------------------------------------------------------------ */}
        <div className="hidden sm:block absolute top-6 right-8 lg:right-12 z-30 font-editorial italic text-sm lg:text-base text-slate-700 -rotate-3 select-none pointer-events-none drop-shadow-2xs">
          Adaptive Learning for a Brighter Tomorrow
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 7: LEFT EDITORIAL HEADLINE & REAL ACTION BUTTONS       */}
        {/* Crisp HTML text and real interactive buttons                 */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-30 max-w-[1280px] w-full mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <div className="max-w-lg space-y-5 text-left">
            
            {/* Top Micro-Tag */}
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-slate-500 font-bold uppercase">
              <span>INDIA'S ADAPTIVE LEARNING PLATFORM</span>
              <span className="w-12 h-[2px] bg-[#a3e635] inline-block rounded-full" />
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.05] tracking-tight font-editorial">
              Learning <br />
              for <span className="text-[#84cc16] italic font-editorial drop-shadow-2xs">what's next.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md font-medium">
              NCERT-aligned learning, interactive 3D labs and personalized guidance for Classes 9–10.
            </p>

            {/* Real Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* Lime Green Explore Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  const el = document.getElementById('portals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenLogin('student');
                }}
                className="bg-[#ccff00] hover:bg-[#bbf000] text-black px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-[0_6px_18px_rgba(204,255,0,0.35)] hover:shadow-[0_10px_25px_rgba(204,255,0,0.5)] transition-all active:scale-95 group cursor-pointer"
              >
                <span>Explore Platform</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* White Translucent Watch Overview Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowOverviewModal(true);
                }}
                className="bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-2xs hover:shadow-md transition-all active:scale-95 backdrop-blur-md cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play size={8} fill="currentColor" className="ml-0.5" />
                </div>
                <span>Watch Overview</span>
              </button>
            </div>

          </div>
        </div>

        {/* Active Topic Banner */}
        {activeTopic && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl border border-emerald-400/80 animate-bounce z-50 flex items-center gap-2">
            <Sparkles size={14} className="text-[#ccff00]" />
            <span>Opening {activeTopic} Modules...</span>
          </div>
        )}

      </section>

      {/* ============================================================== */}
      {/* 3. FEATURE RIBBON / TRUST BAR (EXACT FLOATING WHITE PILL)      */}
      {/* ============================================================== */}
      <div id="features" className="max-w-[1180px] mx-auto px-4 -mt-6 sm:-mt-7 relative z-35">
        <div className="bg-white rounded-full shadow-[0_6px_25px_rgba(0,0,0,0.06)] border border-slate-200/90 py-3.5 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 gap-y-3 lg:gap-y-0 items-center">
          
          {/* 1. NCERT Aligned */}
          <div className="flex items-center gap-3 px-3 py-1">
            <BookOpen className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">NCERT Aligned</div>
              <div className="text-[11px] text-slate-500 font-medium">Class 9–10 Curriculum</div>
            </div>
          </div>

          {/* 2. Interactive 3D Labs */}
          <div className="flex items-center gap-3 px-3 py-1">
            <FlaskConical className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Interactive 3D Labs</div>
              <div className="text-[11px] text-slate-500 font-medium">Learn by Doing</div>
            </div>
          </div>

          {/* 3. Personalized Learning */}
          <div className="flex items-center gap-3 px-3 py-1">
            <Sprout className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Personalized Learning</div>
              <div className="text-[11px] text-slate-500 font-medium">Your Pace, Your Path</div>
            </div>
          </div>

          {/* 4. Classroom Insights */}
          <div className="flex items-center gap-3 px-3 py-1">
            <BarChart3 className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Classroom Insights</div>
              <div className="text-[11px] text-slate-500 font-medium">For Teachers</div>
            </div>
          </div>

          {/* 5. Ministry of Education */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-slate-800">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C10.9 2 10 2.9 10 4c0 .3.1.5.2.8C9.5 5.2 8.5 6 7.5 7.2 6.8 8.1 6.5 9 6.5 10c0 1.2.6 2.3 1.5 3.1-.3.5-.5 1.1-.5 1.7v1.2c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-1.2c0-.6-.2-1.2-.5-1.7.9-.8 1.5-1.9 1.5-3.1 0-1-.3-1.9-1-2.8C15.5 6 14.5 5.2 13.8 4.8c.1-.3.2-.5.2-.8 0-1.1-.9-2-2-2zm-3 17h6v2H9v-2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Ministry of Education</div>
              <div className="text-[11px] text-slate-500 font-medium">Government of India</div>
            </div>
          </div>

          {/* 6. NEP 2020 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <FileText className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">NEP 2020</div>
              <div className="text-[11px] text-slate-500 font-medium">Aligned</div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. CHOOSE YOUR PORTAL SECTION (MATCHING REFERENCE IMAGE 3)     */}
      {/* ============================================================== */}
      <section id="portals" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 pt-12 sm:pt-14 pb-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          
          {/* Left Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold">
              <span>03</span>
              <span className="w-8 h-[1px] bg-slate-300 inline-block" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-slate-900 tracking-tight">
              Choose Your Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Different roles. A shared mission for better learning.
            </p>
          </div>

          {/* Right Subtitle & Carousel Controls */}
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPortal}
                className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 shadow-2xs transition-colors"
                title="Previous"
              >
                <ArrowLeft size={13} />
              </button>
              <button
                onClick={handleNextPortal}
                className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 shadow-2xs transition-colors"
                title="Next"
              >
                <ArrowRight size={13} />
              </button>
              <span className="w-10 h-[1px] bg-slate-300 inline-block" />
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-slate-400 font-semibold">
              SAME CURIOSITY. DIFFERENT PERSPECTIVES.
            </div>
          </div>

        </div>

        {/* Three Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => {
                  sounds.playClick();
                  onOpenLogin(portal.id);
                }}
                className={`rounded-[28px] p-6 sm:p-7 border ${portal.cardBorder} ${portal.cardBg} shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  {/* Top Row: Icon Container and Action Arrow Button */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${portal.accentBg} flex items-center justify-center ${portal.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon size={22} />
                    </div>

                    <div className={`w-8 h-8 rounded-full ${portal.buttonBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-all`}>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-black transition-colors">
                    {portal.title}
                  </h4>

                  {/* Card Description */}
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                {/* Bottom Tags Row */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {portal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200/80 text-[10px] font-medium text-slate-600 shadow-2xs group-hover:border-slate-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust Line */}
        <div className="w-full pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-100 mt-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] border border-black/20" />
            <span className="font-semibold text-slate-700">ShikshaAI • National Adaptive STEM Platform</span>
          </div>
          <div>
            Aligned with National Education Policy (NEP 2020) & NITI Aayog Aspirational Districts
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 5. WATCH OVERVIEW MODAL                                         */}
      {/* ============================================================== */}
      {showOverviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative space-y-6">
            
            <button
              onClick={() => setShowOverviewModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center font-black">
                <Play size={18} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-editorial">ShikshaAI Platform Tour</h3>
                <p className="text-xs text-slate-500">Class 9–10 Adaptive STEM & National Curriculum Ecosystem</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-bold text-xs text-slate-900">Adaptive Neural Twin</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Diagnoses conceptual gaps across 14 NCERT chapters in real-time as you learn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-bold text-xs text-slate-900">3D Virtual Labs</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Perform acid-base titration, balance chemical equations, and test physics optics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-xs text-slate-900">National Telemetry</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  NITI Aayog aligned benchmarks empowering teachers and district administrators.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowOverviewModal(false);
                  onOpenLogin('student');
                }}
                className="px-6 py-3 bg-black hover:bg-slate-900 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Enter Student Portal</span>
                <ArrowRight size={14} className="text-[#ccff00]" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
