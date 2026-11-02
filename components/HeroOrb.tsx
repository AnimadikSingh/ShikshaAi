import React, { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';

export const HeroOrb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tiltX = -mousePos.y * 12;
  const tiltY = mousePos.x * 12;

  return (
    <div
      ref={containerRef}
      className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Rotational Canvas */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Emerald & Lime Glow Behind Orb */}
        <div
          className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(163, 230, 53, 0.45) 0%, rgba(34, 197, 94, 0.35) 40%, rgba(14, 165, 233, 0.2) 70%, transparent 80%)',
            transform: 'translateZ(-40px)',
          }}
        />

        {/* SVG Orbital Rings & Subject Node Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          viewBox="0 0 480 480"
        >
          <defs>
            <linearGradient id="orbRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#84cc16" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="orbRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Orbit Ellipse 1 (Large tilted ellipse) */}
          <ellipse
            cx="240"
            cy="240"
            rx="210"
            ry="90"
            fill="none"
            stroke="url(#orbRingGrad1)"
            strokeWidth="1.4"
            strokeDasharray="4 3"
            transform="rotate(-28 240 240)"
          />

          {/* Orbit Ellipse 2 (Counter tilted ellipse) */}
          <ellipse
            cx="240"
            cy="240"
            rx="195"
            ry="75"
            fill="none"
            stroke="url(#orbRingGrad2)"
            strokeWidth="1.2"
            transform="rotate(38 240 240)"
          />

          {/* Orbit Ellipse 3 (Subtle inner dashed halo) */}
          <ellipse
            cx="240"
            cy="240"
            rx="155"
            ry="60"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            transform="rotate(-8 240 240)"
          />

          {/* Connector Lines to Nodes */}
          {/* Science Connector */}
          <line x1="184" y1="130" x2="200" y2="135" stroke="#84cc16" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Mathematics Connector */}
          <line x1="288" y1="154" x2="298" y2="156" stroke="#84cc16" strokeWidth="1" strokeDasharray="2 2" />

          {/* English Connector */}
          <line x1="192" y1="340" x2="198" y2="344" stroke="#84cc16" strokeWidth="1" strokeDasharray="2 2" />

          {/* Social Science Connector */}
          <line x1="288" y1="340" x2="296" y2="344" stroke="#84cc16" strokeWidth="1" strokeDasharray="2 2" />
        </svg>

        {/* ============================================================== */}
        {/* SUBJECT ORBITAL NODES (MATCHING SCREENSHOT LABELS EXACTLY)    */}
        {/* ============================================================== */}
        
        {/* 1. SCIENCE (Top) */}
        <div
          className="absolute top-[24%] left-[32%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 z-20 pointer-events-auto"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-[#c8ff00] animate-ping opacity-60 absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#c8ff00] border-2 border-slate-900 shadow-sm relative" />
          </div>
          <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-slate-900 uppercase">
            SCIENCE
          </span>
        </div>

        {/* 2. MATHEMATICS (Right) */}
        <div
          className="absolute top-[32%] right-[12%] flex items-center gap-2 z-20 pointer-events-auto"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-[#c8ff00] animate-ping opacity-60 absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#c8ff00] border-2 border-slate-900 shadow-sm relative" />
          </div>
          <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-slate-900 uppercase">
            MATHEMATICS
          </span>
        </div>

        {/* 3. SOCIAL SCIENCE (Bottom Right) */}
        <div
          className="absolute bottom-[20%] right-[10%] flex items-center gap-2 z-20 pointer-events-auto"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c8ff00] border-2 border-slate-900 shadow-sm" />
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-900 uppercase">
            SOCIAL SCIENCE
          </span>
        </div>

        {/* 4. ENGLISH (Bottom Left) */}
        <div
          className="absolute bottom-[20%] left-[28%] -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c8ff00] border-2 border-slate-900 shadow-sm" />
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-900 uppercase">
            ENGLISH
          </span>
        </div>

        {/* ============================================================== */}
        {/* CENTER GLOWING GLASS SPHERE                                    */}
        {/* ============================================================== */}
        <div
          className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{
            background: 'radial-gradient(circle at 38% 34%, rgba(220, 252, 231, 0.95) 0%, rgba(74, 222, 128, 0.85) 25%, rgba(22, 163, 74, 0.9) 50%, rgba(6, 78, 59, 0.95) 75%, #022c22 100%)',
            transform: 'translateZ(25px)',
            boxShadow: '0 0 50px rgba(74, 222, 128, 0.45), inset 0 0 35px rgba(255,255,255,0.7)',
          }}
        >
          {/* Swirling Inner Aurora Mist */}
          <div
            className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 45% 45%, #ccff00 0%, #10b981 40%, transparent 70%)',
              filter: 'blur(10px)',
              animation: 'pulse 3.5s ease-in-out infinite',
            }}
          />

          {/* Deep Fluid Core Gradient */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none"
            viewBox="0 0 200 200"
          >
            <defs>
              <linearGradient id="orbInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ccff00" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="url(#orbInnerGrad)"
              className="animate-[spin_20s_linear_infinite]"
              style={{ transformOrigin: 'center' }}
            />
          </svg>

          {/* Illuminated Brain Icon inside Orb */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-xs border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.6)]">
              <Brain
                className="w-10 h-10 sm:w-14 sm:h-14 text-slate-900 drop-shadow-[0_2px_10px_rgba(202,255,4,0.8)]"
                strokeWidth={2.4}
              />
            </div>
          </div>

          {/* Specular Curved Reflection Arc (Glass Finish) */}
          <div
            className="absolute top-2 left-6 w-28 sm:w-36 h-16 sm:h-20 rounded-[50%] bg-gradient-to-b from-white/80 via-white/40 to-transparent pointer-events-none"
            style={{ transform: 'rotate(-35deg)' }}
          />

          {/* Subtle Bottom Rim Reflection */}
          <div
            className="absolute -bottom-2 right-4 w-32 h-14 rounded-[50%] bg-gradient-to-t from-white/30 to-transparent pointer-events-none opacity-50"
            style={{ transform: 'rotate(20deg)' }}
          />
        </div>
      </div>
    </div>
  );
};
