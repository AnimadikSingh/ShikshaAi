import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Users, BarChart3, ArrowRight, Play, 
  X, BookOpen, FlaskConical, Sprout, FileText, ChevronDown,
  ArrowLeft, CheckCircle2, Sparkles, Compass, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { MindSproutCore } from '../components/MindSproutCore';
import { sounds } from '../services/audioService';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onOpenLogin: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onOpenLogin }) => {
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [activePortalIndex, setActivePortalIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const portals = [
    {
      id: 'student' as UserRole,
      title: 'Student Portal',
      description: 'Access NCERT lessons, 3D virtual labs, adaptive quizzes and your personalized learning path.',
      tags: ['Learn', 'Practice', 'Explore', 'Track'],
      icon: GraduationCap,
      accentBg: 'bg-blue-50/90',
      accentBorder: 'border-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      badgeGradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
    },
    {
      id: 'teacher' as UserRole,
      title: 'Teacher Co-Pilot',
      description: 'Real-time classroom insights, concept heatmaps, automated worksheets and AI-powered lesson planning.',
      tags: ['Analytics', 'Lesson Plans', 'Worksheets', 'AI Tools'],
      icon: Users,
      accentBg: 'bg-emerald-50/90',
      accentBorder: 'border-emerald-100',
      iconColor: 'text-emerald-600',
      buttonBg: 'bg-[#22c55e] hover:bg-[#16a34a] text-white',
      badgeGradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    },
    {
      id: 'official' as UserRole,
      title: 'District Official',
      description: 'NITI Aayog aligned education benchmarks, learning gap heatmaps and resource audit telemetry.',
      tags: ['Reports', 'Equity Metrics', 'Gap Analysis', 'Planning'],
      icon: BarChart3,
      accentBg: 'bg-amber-50/90',
      accentBorder: 'border-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-[#f59e0b] hover:bg-[#d97706] text-white',
      badgeGradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
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

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 font-sans selection:bg-[#ccff00] selection:text-black relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION HEADER                                       */}
      {/* ============================================================== */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-3.5 flex items-center justify-between">
          
          {/* Left Brand Logo */}
          <div 
            onClick={() => {
              sounds.playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ccff00] flex items-center justify-center font-black text-black text-base shadow-xs group-hover:scale-105 transition-transform">
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
      {/* 2. CINEMATIC 3D HERO SECTION WITH PARALLAX CLOUD DEPTH        */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between pt-4 pb-10">
        
        {/* ------------------------------------------------------------ */}
        {/* LAYER 1: BASE MOUNTAIN LANDSCAPE BACKGROUND                  */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <img
            src="/images/mountain-landscape.jpg"
            alt="Himalayan mountain landscape background"
            className="w-full h-full object-cover object-center"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          />

          {/* Left Side Soft Radial / Linear Fade for Text Readability */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 28%, rgba(255,255,255,0.3) 50%, transparent 75%)',
            }}
          />

          {/* Top subtle light wash */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* TOP MICRO-LABELS (INDIA'S ADAPTIVE LEARNING PLATFORM & SCRIPT)*/}
        {/* ------------------------------------------------------------ */}
        <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-12 pt-2 flex items-start justify-between z-30 relative">
          
          {/* Left Micro-Label */}
          <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-slate-600 font-bold uppercase">
            <span>INDIA'S ADAPTIVE LEARNING PLATFORM</span>
            <span className="w-12 sm:w-16 h-[2px] bg-[#a3e635] inline-block" />
          </div>

          {/* Right Script Label */}
          <div className="text-right space-y-0.5">
            <div className="font-editorial italic text-sm sm:text-base font-semibold text-slate-800 -rotate-2 drop-shadow-xs">
              Adaptive Learning for a Brighter Tomorrow
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 2: GIANT "SHIKSHA" WITH RADIANT BLUE FOCUS ANIMATION   */}
        {/* Positioned BEHIND the clouds and mountain foreground         */}
        {/* ------------------------------------------------------------ */}
        <div 
          className="absolute top-12 sm:top-14 lg:top-16 left-0 right-0 w-full text-center select-none pointer-events-none z-10 overflow-hidden"
          style={{
            transform: `translateY(${scrollY * 0.12}px)`,
          }}
        >
          <h1 className="text-[14.5vw] font-[900] leading-[0.88] tracking-tight uppercase shiksha-gradient-text animate-shiksha-focus">
            SHIKSHA
          </h1>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 3: FOREGROUND CLOUDS & MIST IN FRONT OF "SHIKSHA"      */}
        {/* This creates the realistic depth: SHIKSHA emerges from clouds*/}
        {/* ------------------------------------------------------------ */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-20 overflow-hidden flex items-end"
          style={{
            transform: `translateY(${scrollY * 0.04}px)`,
          }}
        >
          {/* Cloud Mist Ridge image extracted from landscape */}
          <img
            src="/images/clouds-foreground.png"
            alt="Foreground mountain clouds"
            className="w-full h-full object-cover object-center mix-blend-screen opacity-90 animate-cloud-drift"
          />

          {/* Soft Organic Atmospheric Cloud Glow Overlay */}
          <div 
            className="absolute bottom-16 left-0 right-0 h-72 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 45%, transparent 75%)',
            }}
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 4: CENTER MIND BRAIN WITH GREEN SPROUT & ORBIT CAPSULES*/}
        {/* ------------------------------------------------------------ */}
        <div className="hidden md:flex absolute left-[50%] -translate-x-1/2 top-[48%] lg:top-[50%] -translate-y-1/2 z-30 pointer-events-auto">
          <MindSproutCore onSelectTopic={(t) => console.log('Selected topic:', t)} />
        </div>

        {/* Mobile Mind View */}
        <div className="md:hidden flex justify-center -mt-4 mb-2 z-30 relative pointer-events-auto">
          <MindSproutCore onSelectTopic={(t) => console.log('Selected topic:', t)} />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 5: THE BOY CUTOUT ON THE ROCK WITH "SA" BACKPACK (RIGHT)*/}
        {/* High-res isolated cutout sitting realistically in foreground */}
        {/* ------------------------------------------------------------ */}
        <div 
          className="hidden md:flex absolute right-0 bottom-0 w-[42%] lg:w-[38%] max-w-[560px] h-[78%] lg:h-[84%] pointer-events-none select-none z-30 overflow-hidden items-end justify-end"
          style={{
            transform: `translateY(${scrollY * 0.02}px)`,
          }}
        >
          <img
            src="/images/boy-cutout.png"
            alt="Student sitting on rocky mountain peak looking over Himalayas"
            className="w-full h-full object-contain object-right-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 6: LEFT EDITORIAL HEADLINE & CTA BUTTONS               */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-35 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-12 mt-auto pb-4 sm:pb-8">
          <div className="max-w-lg space-y-5 text-left">
            
            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-slate-900 leading-[1.05] tracking-tight font-editorial">
              Learning <br />
              for <span className="text-[#84cc16] italic font-editorial drop-shadow-xs">what's next.</span>
            </h2>

            {/* Paragraph Subtitle */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md font-medium">
              NCERT-aligned learning, interactive 3D labs and personalized guidance for Classes 9–10.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* Lime Green Explore Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  const el = document.getElementById('portals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenLogin('student');
                }}
                className="bg-[#ccff00] hover:bg-[#bcf000] text-black px-6 sm:px-7 py-3.5 rounded-full text-sm font-extrabold flex items-center gap-2.5 shadow-[0_8px_20px_rgba(204,255,0,0.4)] hover:shadow-[0_12px_28px_rgba(204,255,0,0.55)] transition-all active:scale-95 group"
              >
                <span>Explore Platform</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* White Translucent Watch Overview Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowOverviewModal(true);
                }}
                className="bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 px-5 sm:px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-95 backdrop-blur-md"
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play size={10} fill="currentColor" className="ml-0.5" />
                </div>
                <span>Watch Overview</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. FLOATING FEATURE RIBBON / TRUST BAR (MATCHING SCREENSHOT)    */}
      {/* ============================================================== */}
      <section id="features" className="w-full -mt-6 sm:-mt-8 z-40 relative px-4 sm:px-8 max-w-[1440px] mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-200/80 py-3.5 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/70 gap-y-3 lg:gap-y-0 items-center">
          
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
            <FlaskConical className="w-5 h-5 text-blue-600 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Interactive 3D Labs</div>
              <div className="text-[11px] text-slate-500 font-medium">Learn by Doing</div>
            </div>
          </div>

          {/* 3. Personalized Learning */}
          <div className="flex items-center gap-3 px-3 py-1">
            <Sprout className="w-5 h-5 text-emerald-600 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Personalized Learning</div>
              <div className="text-[11px] text-slate-500 font-medium">Your Pace, Your Path</div>
            </div>
          </div>

          {/* 4. Classroom Insights */}
          <div className="flex items-center gap-3 px-3 py-1">
            <BarChart3 className="w-5 h-5 text-indigo-600 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Classroom Insights</div>
              <div className="text-[11px] text-slate-500 font-medium">For Teachers</div>
            </div>
          </div>

          {/* 5. Ministry of Education / Government of India */}
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
      </section>

      {/* ============================================================== */}
      {/* 4. CHOOSE YOUR PORTAL SECTION (SECTION 03)                     */}
      {/* ============================================================== */}
      <section id="portals" className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          
          {/* Left Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold">
              <span>03</span>
              <span className="w-10 h-[1px] bg-slate-300 inline-block" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-slate-900 tracking-tight">
              Choose Your Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Different roles. A shared mission for better learning.
            </p>
          </div>

          {/* Right Subtitle & Carousel Controls */}
          <div className="flex flex-col md:items-end gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevPortal}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 shadow-2xs transition-colors"
                title="Previous"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={handleNextPortal}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 shadow-2xs transition-colors"
                title="Next"
              >
                <ArrowRight size={14} />
              </button>
              <span className="w-12 h-[1px] bg-slate-300 inline-block" />
            </div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-400 font-semibold">
              SAME CURIOSITY. DIFFERENT PERSPECTIVES.
            </div>
          </div>

        </div>

        {/* Three Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => {
                  sounds.playClick();
                  onOpenLogin(portal.id);
                }}
                className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-200/90 hover:border-slate-400 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle card aura */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl ${portal.badgeGradient} pointer-events-none rounded-full blur-2xl`} />

                <div>
                  {/* Top Row: Icon Container and Action Arrow Button */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${portal.accentBg} ${portal.accentBorder} border flex items-center justify-center ${portal.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon size={24} />
                    </div>

                    <div className={`w-10 h-10 rounded-full ${portal.buttonBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-all`}>
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-black transition-colors">
                    {portal.title}
                  </h4>

                  {/* Card Description */}
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                {/* Bottom Tags Row */}
                <div className="pt-6 mt-6 border-t border-slate-100/90 flex flex-wrap gap-2">
                  {portal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600 shadow-2xs group-hover:border-slate-300 group-hover:bg-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
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

      {/* ============================================================== */}
      {/* 6. FOOTER TRUST STRIP                                          */}
      {/* ============================================================== */}
      <footer id="footer" className="w-full border-t border-slate-200/80 bg-white/90 py-8">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] border border-black/20" />
            <span className="font-bold text-slate-700">ShikshaAI • National Adaptive STEM Platform</span>
          </div>
          <div>
            Aligned with National Education Policy (NEP 2020) & NITI Aayog Aspirational Districts
          </div>
        </div>
      </footer>

    </div>
  );
};
