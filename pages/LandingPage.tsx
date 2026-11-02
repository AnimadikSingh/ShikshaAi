import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, Users, BarChart3, ArrowRight, Play, 
  X, BookOpen, FlaskConical, Sprout, FileText, ChevronDown,
  ArrowLeft, CheckCircle2, Sparkles, Compass, ShieldCheck
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
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Handle subtle 3D mouse parallax on hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

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
      badgeGradient: 'from-blue-500/12 to-transparent',
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
      badgeGradient: 'from-emerald-500/12 to-transparent',
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
      badgeGradient: 'from-amber-500/12 to-transparent',
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
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 font-sans selection:bg-[#ccff00] selection:text-black relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION HEADER (MATCHING SCREENSHOT 1)               */}
      {/* ============================================================== */}
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/70 shadow-2xs">
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
      {/* 2. MAIN HERO SECTION (EXACT REPLICA OF 1ST REFERENCE IMAGE)    */}
      {/* With true cloud depth behind SHIKSHA, visible Mind & boy       */}
      {/* ============================================================== */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[1440px] mx-auto pt-2 pb-6 px-4 sm:px-6 lg:px-8 select-none"
        style={{ perspective: '1400px' }}
      >
        {/* Dynamic 3D Parallax Canvas Wrapper */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main Visual Composition (Pristine 2048x640 Master Scene) */}
          <img
            src="/images/hero-scene-perfect.jpg"
            alt="ShikshaAI - Learning for what's next"
            className="w-full h-auto block object-cover"
          />

          {/* ---------------------------------------------------------- */}
          {/* ANIMATED FOCUS EFFECT ON "SHIKSHA"                         */}
          {/* Pulsing radiant cyan-and-blue atmospheric light beam       */}
          {/* ---------------------------------------------------------- */}
          <div 
            className="absolute top-[8%] left-[12%] right-[2%] h-[38%] pointer-events-none rounded-full blur-2xl opacity-40 animate-shiksha-focus"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 80%)',
            }}
          />

          {/* ---------------------------------------------------------- */}
          {/* INTERACTIVE HOTSPOTS FOR THE 6 SUBJECT PILLS ON THE MIND   */}
          {/* ---------------------------------------------------------- */}
          
          {/* 1. Science Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('Science (Chemistry & Physics)')}
            className="absolute top-[23%] left-[36.5%] w-[10%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-emerald-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all group z-30"
            title="Explore Science Virtual Lab"
          />

          {/* 2. Mathematics Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('Mathematics & Geometry')}
            className="absolute top-[26%] left-[55%] w-[11%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all group z-30"
            title="Explore Mathematics Portal"
          />

          {/* 3. Coding Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('Coding & Computational Thinking')}
            className="absolute top-[47%] left-[32.5%] w-[9%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all group z-30"
            title="Explore Coding Workbench"
          />

          {/* 4. AI Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('AI & Adaptive Socratic Coaching')}
            className="absolute top-[48%] left-[58%] w-[7%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all group z-30"
            title="Explore AI Learning Agent"
          />

          {/* 5. English Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('English & Literature')}
            className="absolute top-[67%] left-[36.5%] w-[9.5%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all group z-30"
            title="Explore English Curriculum"
          />

          {/* 6. Social Science Pill Hotspot */}
          <div 
            onClick={() => handleTopicClick('Social Science & History')}
            className="absolute top-[71%] left-[54.5%] w-[12%] h-[10%] cursor-pointer rounded-full hover:ring-2 hover:ring-lime-400 hover:shadow-[0_0_20px_rgba(163,230,53,0.6)] transition-all group z-30"
            title="Explore Social Science"
          />

          {/* Topic Click Feedback Banner */}
          {activeTopic && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl border border-emerald-400/80 animate-bounce z-40 flex items-center gap-2">
              <Sparkles size={14} className="text-[#ccff00]" />
              <span>Opening {activeTopic} Modules...</span>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* FUNCTIONAL BUTTON OVERLAYS                                 */}
          {/* ---------------------------------------------------------- */}
          
          {/* 1. Explore Platform Lime Button (Coordinates: X: 4.4% - 17.4%, Y: 78.9% - 87.5%) */}
          <button
            onClick={() => {
              sounds.playClick();
              const el = document.getElementById('portals');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else onOpenLogin('student');
            }}
            className="absolute top-[78.9%] left-[4.39%] w-[13%] h-[8.8%] cursor-pointer rounded-full opacity-0 hover:opacity-100 hover:ring-2 hover:ring-black hover:bg-black/5 transition-all z-30"
            title="Explore Platform"
          />

          {/* 2. Watch Overview Button (Coordinates: X: 18.5% - 30.5%, Y: 78.9% - 87.5%) */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowOverviewModal(true);
            }}
            className="absolute top-[78.9%] left-[18.5%] w-[12%] h-[8.8%] cursor-pointer rounded-full opacity-0 hover:opacity-100 hover:ring-2 hover:ring-slate-400 hover:bg-black/5 transition-all z-30"
            title="Watch Overview"
          />

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FEATURE RIBBON / TRUST BAR (EXACT STRIP IN SCREENSHOT 1)    */}
      {/* ============================================================== */}
      <section id="features" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-10 z-40 relative">
        <div className="bg-white rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-200/90 py-3 sm:py-3.5 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 gap-y-3 lg:gap-y-0 items-center">
          
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
      <section id="portals" className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          
          {/* Left Title */}
          <div className="space-y-1 sm:space-y-2">
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
          <div className="flex flex-col md:items-end gap-2.5">
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
