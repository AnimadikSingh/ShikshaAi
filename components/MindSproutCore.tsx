import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Code2, Cpu, BookOpen, Share2 } from 'lucide-react';
import { sounds } from '../services/audioService';

interface MindSproutCoreProps {
  onSelectTopic?: (topic: string) => void;
}

export const MindSproutCore: React.FC<MindSproutCoreProps> = ({ onSelectTopic }) => {
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

  const tiltX = -mousePos.y * 8;
  const tiltY = mousePos.x * 8;

  const topics = [
    {
      id: 'science',
      label: 'Science',
      icon: (
        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <FlaskConical size={12} strokeWidth={2.5} />
        </span>
      ),
      className: 'top-2 sm:top-4 left-1/3 -translate-x-1/2',
      floatAnim: 'animate-[floatGentle_4s_ease-in-out_infinite]',
    },
    {
      id: 'mathematics',
      label: 'Mathematics',
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
          √x
        </span>
      ),
      className: 'top-10 sm:top-14 right-2 sm:right-6',
      floatAnim: 'animate-[floatGentle_4.5s_ease-in-out_infinite_0.8s]',
    },
    {
      id: 'coding',
      label: 'Coding',
      icon: (
        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Code2 size={12} strokeWidth={2.5} />
        </span>
      ),
      className: 'top-[42%] -left-3 sm:-left-6 -translate-y-1/2',
      floatAnim: 'animate-[floatGentle_5s_ease-in-out_infinite_1.5s]',
    },
    {
      id: 'ai',
      label: 'AI',
      icon: (
        <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
          <Cpu size={12} strokeWidth={2.5} />
        </span>
      ),
      className: 'top-[42%] -right-2 sm:-right-6 -translate-y-1/2',
      floatAnim: 'animate-[floatGentle_4.2s_ease-in-out_infinite_0.4s]',
    },
    {
      id: 'english',
      label: 'English',
      icon: (
        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
          <BookOpen size={12} strokeWidth={2.5} />
        </span>
      ),
      className: 'bottom-10 sm:bottom-14 left-4 sm:left-10',
      floatAnim: 'animate-[floatGentle_4.8s_ease-in-out_infinite_1.2s]',
    },
    {
      id: 'social-science',
      label: 'Social Science',
      icon: (
        <span className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
          <Share2 size={12} strokeWidth={2.5} />
        </span>
      ),
      className: 'bottom-4 sm:bottom-8 right-6 sm:right-12',
      floatAnim: 'animate-[floatGentle_4.4s_ease-in-out_infinite_2s]',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[520px] flex items-center justify-center select-none cursor-pointer"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic 3D Rotational Canvas */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Radiant Aurora Behind Mind */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-70 animate-orb-glow"
          style={{
            background: 'radial-gradient(circle, rgba(163, 230, 53, 0.45) 0%, rgba(34, 197, 94, 0.35) 35%, rgba(6, 182, 212, 0.25) 65%, transparent 80%)',
            transform: 'translateZ(-30px)',
          }}
        />

        {/* SVG Orbital Rings with glowing gradients */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          viewBox="0 0 540 520"
        >
          <defs>
            <linearGradient id="orbitGradLime" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="orbitGradCyan" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Large Primary Orbital Ring */}
          <ellipse
            cx="270"
            cy="260"
            rx="235"
            ry="95"
            fill="none"
            stroke="url(#orbitGradLime)"
            strokeWidth="2"
            transform="rotate(-24 270 260)"
            className="opacity-80"
          />

          {/* Secondary Counter Orbital Ring */}
          <ellipse
            cx="270"
            cy="260"
            rx="215"
            ry="80"
            fill="none"
            stroke="url(#orbitGradCyan)"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            transform="rotate(32 270 260)"
            className="opacity-75"
          />

          {/* Orbit Node Glowing Dots */}
          <circle cx="160" cy="180" r="4.5" fill="#c8ff00" stroke="#166534" strokeWidth="1.5" />
          <circle cx="395" cy="210" r="4.5" fill="#c8ff00" stroke="#166534" strokeWidth="1.5" />
          <circle cx="210" cy="365" r="4" fill="#06b6d4" stroke="#083344" strokeWidth="1.5" />
          <circle cx="430" cy="335" r="4" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
        </svg>

        {/* ============================================================== */}
        {/* CENTER MIND & SPROUT IMAGE                                     */}
        {/* ============================================================== */}
        <div
          className="relative z-20 flex items-center justify-center transition-transform duration-500"
          style={{ transform: 'translateZ(30px)' }}
        >
          <img
            src="/images/brain-sprout.png"
            alt="AI Neural Mind with Sprout of Knowledge"
            className="w-56 h-auto sm:w-72 md:w-80 lg:w-[350px] object-contain drop-shadow-[0_15px_35px_rgba(34,197,94,0.45)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ============================================================== */}
        {/* 6 FLOATING SUBJECT CAPSULES (PILLS)                            */}
        {/* ============================================================== */}
        {topics.map((t) => (
          <div
            key={t.id}
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              if (onSelectTopic) onSelectTopic(t.id);
            }}
            className={`absolute z-30 ${t.className} ${t.floatAnim} pointer-events-auto`}
            style={{ transform: 'translateZ(55px)' }}
          >
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-lg hover:border-emerald-400 hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer">
              {t.icon}
              <span className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                {t.label}
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
