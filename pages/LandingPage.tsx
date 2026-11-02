import React, { useState } from 'react';
import { 
  GraduationCap, Users, BarChart3, ArrowRight, Play, 
  X, BookOpen, FlaskConical, Sprout, FileText, ChevronDown,
  ArrowLeft, CheckCircle2, Sparkles, Compass, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { HeroOrb } from '../components/HeroOrb';
import { sounds } from '../services/audioService';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onOpenLogin: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onOpenLogin }) => {
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [activePortalIndex, setActivePortalIndex] = useState(0);

  const portals = [
    {
      id: 'student' as UserRole,
      title: 'Student Portal',
      description: 'Access NCERT lessons, 3D virtual labs, adaptive quizzes and your personalized learning path.',
      tags: ['Learn', 'Practice', 'Explore', 'Track'],
      icon: GraduationCap,
      accentBg: 'bg-blue-50/80',
      accentBorder: 'border-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      badgeGradient: 'from-blue-500/10 to-transparent',
    },
    {
      id: 'teacher' as UserRole,
      title: 'Teacher Co-Pilot',
      description: 'Real-time classroom insights, concept heatmaps, automated worksheets and AI-powered lesson planning.',
      tags: ['Analytics', 'Lesson Plans', 'Worksheets', 'AI Tools'],
      icon: Users,
      accentBg: 'bg-emerald-50/80',
      accentBorder: 'border-emerald-100',
      iconColor: 'text-emerald-600',
      buttonBg: 'bg-[#86efac] hover:bg-[#4ade80] text-slate-900',
      badgeGradient: 'from-emerald-500/10 to-transparent',
    },
    {
      id: 'official' as UserRole,
      title: 'District Official',
      description: 'NITI Aayog aligned education benchmarks, learning gap heatmaps and resource audit telemetry.',
      tags: ['Reports', 'Equity Metrics', 'Gap Analysis', 'Planning'],
      icon: BarChart3,
      accentBg: 'bg-amber-50/80',
      accentBorder: 'border-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-900',
      badgeGradient: 'from-amber-500/10 to-transparent',
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
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 font-sans selection:bg-[#c8ff00] selection:text-black relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION HEADER                                       */}
      {/* ============================================================== */}
      <header className="w-full bg-[#f7f8fa]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between">
          
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
      {/* 2. HERO SECTION: ARCHITECTURAL GRID, GIANT SHIKSHA & 3D SCENE   */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden blueprint-grid border-b border-slate-200/70 pt-4 pb-12 sm:pb-16 lg:pb-20">
        
        {/* Top Micro-Labels Bar */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-2 flex items-start justify-between z-20 relative">
          
          {/* Left Micro-Label */}
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] text-slate-400 font-semibold uppercase">
            <span>INDIA'S ADAPTIVE LEARNING PLATFORM</span>
            <span className="w-16 sm:w-24 h-[1px] bg-slate-300 inline-block" />
          </div>

          {/* Right Micro-Label (02 — ADAPTIVE LEARNING FOR A BRIGHTER TOMORROW) */}
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-slate-400 font-semibold">
              <span>02</span>
              <span className="w-8 sm:w-12 h-[1px] bg-slate-300 inline-block" />
            </div>
            <div className="text-[10px] font-mono tracking-[0.18em] text-slate-400 font-semibold uppercase leading-tight max-w-[160px] ml-auto">
              ADAPTIVE LEARNING FOR A BRIGHTER TOMORROW.
            </div>
          </div>

        </div>

        {/* GIANT ARCHITECTURAL BACKGROUND TYPOGRAPHY: SHIKSHA */}
        <div className="w-full text-center select-none pointer-events-none mt-2 sm:mt-0 overflow-hidden">
          <h1 className="text-[14vw] font-[900] leading-[0.88] tracking-tight text-[#141b25] uppercase opacity-95">
            SHIKSHA
          </h1>
        </div>

        {/* ============================================================== */}
        {/* RIGHT BACKGROUND IMAGE: BOY SITTING ON MOUNTAIN (IMAGE 2)      */}
        {/* ============================================================== */}
        <div className="absolute right-0 bottom-0 w-[60%] sm:w-[55%] lg:w-[48%] h-[85%] sm:h-[90%] pointer-events-none select-none z-10 overflow-hidden flex items-end justify-end">
          <img
            src="/boy-mountain.png"
            alt="Student sitting on mountain cliff with ShikshaAI backpack"
            className="w-full h-full object-contain object-right-bottom mix-blend-multiply opacity-95"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 45%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 45%)',
            }}
          />
        </div>

        {/* ============================================================== */}
        {/* CENTERPIECE 3D GLASS SPHERE WITH ORBITAL SUBJECT NODES         */}
        {/* ============================================================== */}
        <div className="hidden md:flex absolute left-[50%] -translate-x-1/2 top-[46%] sm:top-[48%] -translate-y-1/2 z-20 pointer-events-auto">
          <HeroOrb />
        </div>

        {/* Mobile Orb Fallback */}
        <div className="md:hidden flex justify-center -mt-6 mb-4 z-20 relative">
          <HeroOrb />
        </div>

        {/* ============================================================== */}
        {/* LEFT EDITORIAL HERO HEADLINE & CTA                             */}
        {/* ============================================================== */}
        <div className="relative z-30 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 -mt-10 sm:-mt-16 lg:-mt-24">
          <div className="max-w-xl space-y-6 text-left">
            
            {/* 01 Index Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold">
              <span>01</span>
              <span className="w-12 h-[1px] bg-slate-300 inline-block" />
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.06] tracking-tight font-editorial">
              Learning <br />
              for <span className="text-[#4e6b2c] italic font-editorial">what's next.</span>
            </h2>

            {/* Paragraph Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md font-normal">
              NCERT–aligned learning, interactive 3D labs and personalized guidance for Classes 9–10.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  const el = document.getElementById('portals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenLogin('student');
                }}
                className="bg-[#0b1017] hover:bg-slate-800 text-white px-6 sm:px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-95 group"
              >
                <span>Explore Platform</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowOverviewModal(true);
                }}
                className="bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 px-5 sm:px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 shadow-xs hover:shadow-sm transition-all active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <Play size={10} fill="currentColor" />
                </div>
                <span>Watch Overview</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. FEATURE RIBBON / TRUST BAR (MATCHING REFERENCE STRIP)       */}
      {/* ============================================================== */}
      <section id="features" className="w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-4 px-6 sm:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/70 gap-y-4 lg:gap-y-0">
          
          {/* 1. NCERT Aligned */}
          <div className="flex items-center gap-3.5 px-3 py-1">
            <BookOpen className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">NCERT Aligned</div>
              <div className="text-[11px] text-slate-500 font-medium">Class 9–10 Curriculum</div>
            </div>
          </div>

          {/* 2. Interactive 3D Labs */}
          <div className="flex items-center gap-3.5 px-3 py-1">
            <FlaskConical className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Interactive 3D Labs</div>
              <div className="text-[11px] text-slate-500 font-medium">Learn by Doing</div>
            </div>
          </div>

          {/* 3. Personalized Learning */}
          <div className="flex items-center gap-3.5 px-3 py-1">
            <Sprout className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Personalized Learning</div>
              <div className="text-[11px] text-slate-500 font-medium">Your Pace, Your Path</div>
            </div>
          </div>

          {/* 4. Classroom Insights */}
          <div className="flex items-center gap-3.5 px-3 py-1">
            <BarChart3 className="w-5 h-5 text-slate-800 flex-shrink-0" strokeWidth={1.8} />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Classroom Insights</div>
              <div className="text-[11px] text-slate-500 font-medium">For Teachers</div>
            </div>
          </div>

          {/* 5. Ministry of Education / Government of India */}
          <div className="flex items-center gap-3.5 px-3 py-1">
            {/* National Emblem Silhouette */}
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
          <div className="flex items-center gap-3.5 px-3 py-1">
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
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 transition-colors"
                title="Previous"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={handleNextPortal}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black hover:border-slate-400 transition-colors"
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
                className={`bg-white rounded-[28px] p-7 sm:p-8 border border-slate-200/90 hover:border-slate-400 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Subtle card aura */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${portal.badgeGradient} pointer-events-none rounded-full blur-2xl`} />

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
                      className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-medium text-slate-600 shadow-2xs group-hover:border-slate-300 transition-colors"
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
      <footer id="footer" className="w-full border-t border-slate-200/80 bg-white/70 py-8">
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
