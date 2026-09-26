import React, { useState } from 'react';
import { 
  GraduationCap, School, Building2, Sparkles, ArrowRight, Play, 
  CheckCircle2, X, Compass, Brain, FlaskConical, Layers, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { AITeachingCore } from '../components/AITeachingCore';
import { sounds } from '../services/audioService';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onOpenLogin: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onOpenLogin }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedPortalCategory, setSelectedPortalCategory] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'OFFICIAL'>('ALL');

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans selection:bg-[#d7f742] selection:text-black relative overflow-x-hidden">
      
      {/* Top Background Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-white via-slate-100/60 to-transparent pointer-events-none -z-10" />

      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION BAR (Matching Reference Screenshot 2)        */}
      {/* ============================================================== */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between z-30 relative">
        
        {/* Left Navigation Capsule Dock */}
        <nav className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 sm:gap-2">
          {[
            { label: 'Curriculum', href: '#portals' },
            { label: 'Virtual Lab', href: '#portals' },
            { label: 'Brain Web', href: '#portals' },
            { label: 'NEP 2020', href: '#portals' },
            { label: 'Contact', href: '#portals' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => sounds.playClick()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100/80 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Auth Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLogin('student');
            }}
            className="text-xs font-bold text-slate-700 hover:text-black px-3 py-2 transition-colors"
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
            className="bg-black hover:bg-slate-900 text-white px-4 sm:px-5 py-2 rounded-full text-xs font-black shadow-md hover:shadow-xl transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION: GIANT SHIKSHAAI. TYPOGRAPHY & 3D AI SPHERE     */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16 flex flex-col items-center">
        
        {/* GIANT ARCHITECTURAL BACKGROUND TITLE (MATCHING SAPFORCE.) */}
        <div className="w-full text-center overflow-hidden select-none pointer-events-none mt-2">
          <h1 className="text-[17vw] leading-[0.82] font-black tracking-tighter text-slate-900 uppercase">
            SHIKSHAAI.
          </h1>
        </div>

        {/* CENTERPIECE HERO WRAPPER (THE TEACHING BALL OVERLAPPING TITLE) */}
        <div className="relative w-full flex flex-col items-center -mt-[6vw] sm:-mt-[8vw] z-20">
          
          {/* Interactive 3D AI Teaching Core */}
          <AITeachingCore />

          {/* LEFT & RIGHT HERO COLUMNS GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end mt-4">
            
            {/* Left Hero Column */}
            <div className="md:col-span-6 space-y-4 text-left">
              {/* Avatar Stack + Active Users */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {['Amit K.', 'Sunita S.', 'Dr. V', 'Priya R.'].map((initial, i) => (
                    <div 
                      key={i} 
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs ${
                        ['bg-cyan-500 text-white', 'bg-indigo-600 text-white', 'bg-[#d7f742] text-black', 'bg-purple-500 text-white'][i]
                      }`}
                    >
                      {initial[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 leading-none">1.2M+</div>
                  <div className="text-xs text-slate-500 font-medium">Students & Educators Active</div>
                </div>
              </div>

              {/* Subtitle Description */}
              <p className="text-sm sm:text-base text-slate-700 font-medium max-w-md leading-relaxed">
                The adaptive AI learning platform that powers Class 9-10 NCERT education with interactive 3D science labs, Socratic coaching, and classroom analytics.
              </p>

              {/* Dotted Baseline Line (Matching Reference Screenshot) */}
              <div className="w-full max-w-sm border-b-2 border-dotted border-slate-300 pt-2" />
            </div>

            {/* Right Hero Column */}
            <div className="md:col-span-6 flex flex-col md:items-end justify-between space-y-6">
              
              {/* Feature Indices List (Matching Reference /01 /02 /03) */}
              <div className="space-y-1 text-right font-mono text-xs">
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">NCERT Aligned</span> <span className="text-slate-400">/01</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">Adaptive Neural Twin</span> <span className="text-slate-400">/02</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">3D STEM Science Labs</span> <span className="text-slate-400">/03</span>
                </div>
              </div>

              {/* Signature Acid-Lime Circular Button (Matching Reference Screenshot) */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHowItWorks(true);
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#d7f742] hover:bg-[#cbf130] text-black p-3 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                  <Play size={16} fill="currentColor" className="group-hover:translate-x-0.5 transition-transform" />
                  <span>How it works?</span>
                </div>
                <span className="text-[9px] font-mono text-black/70 mt-1 uppercase tracking-wider">
                  Interactive Tour
                </span>
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. SELECT YOUR PORTAL (Integrating Screenshot 1)               */}
      {/* ============================================================== */}
      <section id="portals" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider shadow-xs mb-2">
              <Sparkles size={12} className="text-blue-600" />
              <span>Personalized Learning Gateways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Select Your Portal
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Choose your educational role to enter your customized interface.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Ministry of Education • Government of India</span>
          </div>
        </div>

        {/* Three Portal Cards (Class 9-10 Student, Teacher, Official) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Student */}
          <div 
            onClick={() => {
              sounds.playClick();
              onOpenLogin('student');
            }}
            className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/90 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <GraduationCap size={24} />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                For Class 9 & 10
              </span>

              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                Student Portal
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Line-by-line NCERT lessons, hands-on 3D virtual science labs, stoichiometric scale balance, and instant adaptive quizzes.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-600">
              <span>Launch Student Twin</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Teacher */}
          <div 
            onClick={() => {
              sounds.playClick();
              onOpenLogin('teacher');
            }}
            className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/90 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <School size={24} />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                AI Pedagogy Suite
              </span>

              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors">
                Teacher Co-Pilot
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Real-time classroom concept heatmaps, automated remedial worksheets, student confusion diagnostics, and lesson plan generator.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-600">
              <span>Open Classroom Co-Pilot</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: District Official */}
          <div 
            onClick={() => {
              sounds.playClick();
              onOpenLogin('official');
            }}
            className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/90 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                <Building2 size={24} />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                State & District Governance
              </span>

              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-amber-600 transition-colors">
                District Official
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                NITI Aayog district education benchmarks, rural vs urban equity radar, learning gap heatmaps, and resource audit telemetry.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-600">
              <span>View Governance Reports</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. "HOW IT WORKS" MODAL (TRIGGERED BY ACID-LIME BUTTON)        */}
      {/* ============================================================== */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative space-y-6">
            
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d7f742] text-black flex items-center justify-center font-black">
                <Play size={18} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">How ShikshaAI Works</h3>
                <p className="text-xs text-slate-500">Class 9-10 Adaptive Learning Architecture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-bold text-xs text-slate-900">Digital Twin Diagnosis</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Maps knowledge gaps across 14 NCERT chapters in real-time as you practice.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-bold text-xs text-slate-900">3D Virtual STEM Labs</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Perform titration, test hydrogen gas pop reactions, and wire Ohm\'s Law circuits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-xs text-slate-900">Socratic AI Coaching</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Avatar explains mistakes using intuitive analogies in English & Hinglish.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowHowItWorks(false);
                  onOpenLogin('student');
                }}
                className="px-6 py-3 bg-black hover:bg-slate-900 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight size={14} className="text-[#d7f742]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. FOOTER TRUST STRIP                                          */}
      {/* ============================================================== */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7f742] border border-black/20" />
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
