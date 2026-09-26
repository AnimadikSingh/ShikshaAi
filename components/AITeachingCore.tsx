import React, { useState, useEffect, useRef } from 'react';
import { Atom, Brain, Sparkles, Zap, BookOpen, Lightbulb, Compass, GraduationCap } from 'lucide-react';

export const AITeachingCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      setMousePos({ 
        x: Math.max(-1, Math.min(1, x)), 
        y: Math.max(-1, Math.min(1, y)) 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tiltX = -mousePos.y * 14;
  const tiltY = mousePos.x * 14;

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] flex items-center justify-center cursor-pointer select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic 3D Rotational Canvas Wrapper */}
      <div 
        className="w-full h-full relative flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Soft Ambient Core Halo Shadow */}
        <div 
          className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(215, 247, 66, 0.45) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 75%)',
            transform: 'translateZ(-50px)'
          }}
        />

        {/* Outer Orbital Ring 1: Chrome Silver Ellipse (Rotates 360) */}
        <div 
          className="absolute w-[94%] h-[45%] rounded-[50%] border-2 border-slate-300/80 shadow-[0_0_15px_rgba(255,255,255,0.4)] pointer-events-none animate-[spin_18s_linear_infinite]"
          style={{
            transform: 'rotateZ(25deg) rotateX(68deg)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Outer Orbital Ring 2: Glowing Lime Ellipse */}
        <div 
          className="absolute w-[88%] h-[42%] rounded-[50%] border-2 border-[#d7f742]/90 shadow-[0_0_20px_rgba(215,247,66,0.6)] pointer-events-none animate-[spin_14s_linear_infinite_reverse]"
          style={{
            transform: 'rotateZ(-35deg) rotateX(62deg)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Outer Orbital Ring 3: Deep Cyan / Silver Loop */}
        <div 
          className="absolute w-[80%] h-[38%] rounded-[50%] border border-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.5)] pointer-events-none animate-[spin_22s_linear_infinite]"
          style={{
            transform: 'rotateZ(70deg) rotateX(65deg)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* ============================================================= */}
        {/* MAIN 3D SPHERE (AI NEURAL KNOWLEDGE CORE)                     */}
        {/* ============================================================= */}
        <div 
          className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex items-center justify-center transition-transform duration-500"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 20%, #64748b 50%, #1e293b 85%, #0f172a 100%)',
            transform: 'translateZ(20px)',
            boxShadow: isHovered 
              ? '0 0 60px rgba(215, 247, 66, 0.6), inset 0 0 40px rgba(255,255,255,0.8)' 
              : '0 25px 60px -15px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.4)'
          }}
        >
          {/* Swirling Bio-Luminescent Neon Lime Liquid Energy Crests */}
          <div 
            className="absolute inset-0 opacity-85 mix-blend-color-burn pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 45% 45%, #d7f742 0%, #10b981 35%, transparent 70%)',
              filter: 'blur(8px)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />

          {/* Organic Fluid Wave Layer (Matching Reference Image) */}
          <svg className="absolute inset-0 w-full h-full opacity-75 mix-blend-overlay pointer-events-none" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="coreLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d7f742" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path 
              d="M20,100 C40,40 140,30 180,80 C210,130 150,180 90,170 C30,160 0,140 20,100 Z" 
              fill="url(#coreLiquid)"
              className="animate-[spin_25s_linear_infinite]"
              style={{ transformOrigin: 'center' }}
            />
          </svg>

          {/* Glowing Neural Synaptic Nodes Inside Sphere */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <Brain size={64} className="text-slate-900/80 drop-shadow-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={28} className="text-[#d7f742] animate-bounce" />
              </div>
            </div>
          </div>

          {/* High-Gloss Specular Refraction Arc (Glass Reflection) */}
          <div 
            className="absolute top-2 left-6 w-32 h-20 rounded-[50%] bg-gradient-to-b from-white/70 to-transparent pointer-events-none"
            style={{ transform: 'rotate(-32deg)' }}
          />
        </div>

        {/* ============================================================= */}
        {/* ORBITING EDUCATIONAL STEM / AI TOKENS                         */}
        {/* ============================================================= */}
        
        {/* Token 1: Water Molecule (H₂O) */}
        <div 
          className="absolute -top-2 left-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-1.5 animate-[floatGentle_4s_ease-in-out_infinite]"
          style={{ transform: 'translateZ(60px)' }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-xs font-black font-mono text-slate-800">H₂O</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">Chem</span>
        </div>

        {/* Token 2: Mass Energy (E=mc²) */}
        <div 
          className="absolute top-1/4 -right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-1.5 animate-[floatGentle_4.5s_ease-in-out_infinite_1s]"
          style={{ transform: 'translateZ(70px)' }}
        >
          <Atom size={14} className="text-indigo-600 animate-spin" />
          <span className="text-xs font-black font-mono text-slate-900">E = mc²</span>
        </div>

        {/* Token 3: Ohm's Law (V = IR) */}
        <div 
          className="absolute bottom-8 -left-2 bg-slate-950/90 text-white backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-1.5 animate-[floatGentle_5s_ease-in-out_infinite_2s]"
          style={{ transform: 'translateZ(50px)' }}
        >
          <Zap size={14} className="text-[#d7f742]" />
          <span className="text-xs font-mono font-bold text-white">V = I · R</span>
          <span className="text-[9px] text-[#d7f742] font-black">12Ω</span>
        </div>

        {/* Token 4: Adaptive AI Brain Node */}
        <div 
          className="absolute -bottom-4 right-16 bg-[#d7f742] text-black px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 animate-[floatGentle_3.8s_ease-in-out_infinite_1.5s]"
          style={{ transform: 'translateZ(80px)' }}
        >
          <Brain size={14} className="text-black" />
          <span className="text-xs font-black tracking-tight">Adaptive Twin 2.6</span>
        </div>

      </div>
    </div>
  );
};
