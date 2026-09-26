import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Atom, ChevronRight } from 'lucide-react';
import { sounds } from '../services/audioService';

interface LaunchAnimationProps {
  onComplete: () => void;
}

export const LaunchAnimation: React.FC<LaunchAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing ShikshaAI Adaptive Engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    sounds.playClick();
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            sounds.playCelebration();
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next < 30) {
          setStage('Calibrating NCERT Class 9-10 Adaptive Model...');
        } else if (next < 65) {
          setStage('Connecting Digital Twin & Socratic Knowledge Graph...');
        } else if (next < 90) {
          setStage('Synchronizing Offline Virtual Science Workbenches...');
        } else {
          setStage('Launch Ready • Welcome to ShikshaAI');
        }
        return Math.min(100, next);
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#080c14] text-white flex flex-col items-center justify-between p-8 transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Neural Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), radial-gradient(rgba(215, 247, 66, 0.3) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px'
        }}
      />

      {/* Top Telemetry Header */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d7f742] animate-ping" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
            SHIKSHAAI SYSTEM INITIALIZER v2.6
          </span>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onComplete();
          }}
          className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 rounded-full border border-slate-800 hover:border-slate-600 transition-colors flex items-center gap-1"
        >
          Skip Intro <ChevronRight size={14} />
        </button>
      </div>

      {/* Centerpiece Holographic Logo & Orbital Core */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center space-y-6">
        
        {/* Pulsing Core */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border border-[#d7f742]/30 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-cyan-500/40 animate-[spin_4s_linear_infinite_reverse]" />
          
          {/* Center glowing orb */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-[#d7f742] p-1 shadow-[0_0_50px_rgba(215,247,66,0.5)] flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-[#080c14] flex items-center justify-center">
              <Brain size={36} className="text-[#d7f742]" />
            </div>
          </div>

          {/* Orbiting particles */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#d7f742] shadow-[0_0_12px_#d7f742]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
        </div>

        {/* Brand Typographic Title */}
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Shiksha<span className="text-[#d7f742]">AI</span>
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-400 tracking-wider">
            ADAPTIVE STEM LEARNING ARCHITECTURE
          </p>
        </div>

      </div>

      {/* Bottom Progress Bar & Telemetry Status */}
      <div className="w-full max-w-md z-10 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#d7f742]" /> {stage}
          </span>
          <span className="font-bold text-[#d7f742]">{progress}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-[#d7f742] rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(215,247,66,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-600">
          <span>NEP 2020 COMPLIANT</span>
          <span>CBSE CLASS 9-10 SYLLABUS</span>
          <span>OFFLINE READY</span>
        </div>
      </div>

    </div>
  );
};
