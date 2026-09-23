import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, Flame, RotateCcw, Droplets, Zap, Eye, CheckCircle2, 
  HelpCircle, Volume2, VolumeX, BookOpen, Sparkles, AlertTriangle, 
  Activity, ArrowRight, Gauge, Play, ShieldAlert, Award, Compass,
  Sliders, Thermometer, Wind, RefreshCw, ChevronRight, Info
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { sounds } from '../services/audioService';

type LabExperiment = 'TITRATION' | 'METAL_ACID' | 'OHM_CIRCUIT' | 'PH_STRIP';

export const VirtualLab: React.FC = () => {
  const { addXP } = useStudent();
  const [activeExp, setActiveExp] = useState<LabExperiment>('TITRATION');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // -------------------------------------------------------------
  // EXPERIMENT 1: TITRATION (HCl + NaOH with Phenolphthalein)
  // -------------------------------------------------------------
  const [buretteVolume, setBuretteVolume] = useState(50.0); // 50.0 mL start
  const [flaskDropsAdded, setFlaskDropsAdded] = useState(0); // drops of 0.1M NaOH
  const [hasIndicator, setHasIndicator] = useState(false);
  const [stirrerActive, setStirrerActive] = useState(true);
  const [stirrerRpm, setStirrerRpm] = useState(450);
  const [stopcockOpen, setStopcockOpen] = useState(false);
  const [titrationComplete, setTitrationComplete] = useState(false);
  const [dispenseAnim, setDispenseAnim] = useState(false);

  // -------------------------------------------------------------
  // EXPERIMENT 2: METAL + ACID HYDROGEN EVOLUTION (Zn + HCl)
  // -------------------------------------------------------------
  const [hasZinc, setHasZinc] = useState(false);
  const [hasAcid, setHasAcid] = useState(false);
  const [reactionActive, setReactionActive] = useState(false);
  const [gasCollected, setGasCollected] = useState(0); // 0 to 100%
  const [splintTested, setSplintTested] = useState(false);
  const [popEffect, setPopEffect] = useState(false);

  // -------------------------------------------------------------
  // EXPERIMENT 3: OHM'S LAW ELECTRIC CIRCUIT (V = I * R)
  // -------------------------------------------------------------
  const [voltage, setVoltage] = useState(4.0); // Volts
  const [resistance, setResistance] = useState(10); // Ohms
  const [switchClosed, setSwitchClosed] = useState(true);
  const [plottedPoints, setPlottedPoints] = useState<{ v: number; i: number }[]>([
    { v: 1.0, i: 0.1 },
    { v: 2.0, i: 0.2 },
    { v: 3.0, i: 0.3 }
  ]);

  // -------------------------------------------------------------
  // EXPERIMENT 4: UNIVERSAL PH SPOT PLATE
  // -------------------------------------------------------------
  const PH_SAMPLES = [
    { id: 'gastric', name: 'Gastric Juice (Dil. HCl)', actualPh: 1.2, color: '#dc2626', hexColor: '#ef4444', desc: 'Gastric Acid / HCl' },
    { id: 'lemon', name: 'Lemon Juice', actualPh: 2.4, color: '#ea580c', hexColor: '#f97316', desc: 'Citric Acid' },
    { id: 'water', name: 'Distilled Water', actualPh: 7.0, color: '#16a34a', hexColor: '#22c55e', desc: 'Pure Neutral H₂O' },
    { id: 'blood', name: 'Human Blood', actualPh: 7.4, color: '#0d9488', hexColor: '#14b8a6', desc: 'Slightly Alkaline' },
    { id: 'magnesia', name: 'Milk of Magnesia', actualPh: 10.5, color: '#2563eb', hexColor: '#3b82f6', desc: 'Antacid Mg(OH)₂' },
    { id: 'naoh', name: 'Dilute NaOH', actualPh: 13.8, color: '#7c3aed', hexColor: '#8b5cf6', desc: 'Strong Alkali' }
  ];
  const [activeWellIndex, setActiveWellIndex] = useState(0);
  const [dippedWells, setDippedWells] = useState<Record<number, boolean>>({});
  const [selectedSample, setSelectedSample] = useState(PH_SAMPLES[0]);

  // Lab Notebook Log
  const [labNotes, setLabNotes] = useState<string[]>([
    "Safety protocol verified: Chemical splash goggles and lab coats equipped.",
    "Fume exhaust hood operating at normal airflow (850 CFM).",
    "Digital instrumentation calibrated at 25.0 °C / 1.00 atm."
  ]);

  const addNote = (note: string) => {
    setLabNotes(prev => [note, ...prev.slice(0, 6)]);
  };

  const handleToggleSound = () => {
    const s = sounds.toggleSound();
    setSoundEnabled(s);
  };

  // Titration dispensing logic
  const handleDispenseNaOH = (drops: number) => {
    if (buretteVolume <= 0 || titrationComplete) return;
    sounds.playBubble();
    setDispenseAnim(true);
    setTimeout(() => setDispenseAnim(false), 300);

    const newDrops = flaskDropsAdded + drops;
    setFlaskDropsAdded(newDrops);
    const volumeUsed = Number((drops * 0.5).toFixed(1));
    setBuretteVolume(prev => Math.max(0, Number((prev - volumeUsed).toFixed(1))));

    // End point at 20 drops (10.0 mL of 0.1M NaOH neutralizing 10.0 mL of 0.1M HCl)
    if (newDrops >= 20 && !titrationComplete) {
      setTitrationComplete(true);
      sounds.playVictory();
      addXP(50);
      addNote("🎉 EQUIVALENCE ENDPOINT REACHED! Phenolphthalein indicator turned persistent light pink (pH = 8.2). Vol NaOH = 10.0 mL. +50 XP!");
    } else {
      addNote(`Dispensed ${volumeUsed} mL NaOH solution from burette. Solution pH: ${(1.2 + newDrops * 0.35).toFixed(2)}`);
    }
  };

  // Metal + Acid gas evolution loop
  useEffect(() => {
    let interval: any = null;
    if (hasZinc && hasAcid && !reactionActive) {
      setReactionActive(true);
      sounds.playBubble();
      addNote("Rapid effervescence initiated! Zinc reacting vigorously with dilute HCl to evolve H₂ gas.");
    }
    if (reactionActive && gasCollected < 100) {
      interval = setInterval(() => {
        setGasCollected(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [hasZinc, hasAcid, reactionActive, gasCollected]);

  // Pop Test Handler
  const handlePopTest = () => {
    if (gasCollected < 35 || splintTested) return;
    setSplintTested(true);
    setPopEffect(true);
    sounds.playLaser();
    setTimeout(() => {
      sounds.playVictory();
      setPopEffect(false);
    }, 450);
    addXP(40);
    addNote("💥 POP TEST CONFIRMED! Hydrogen gas burns with a characteristic sharp 'POP' sound and blue flame. +40 XP!");
  };

  // Ohm's Law physics calculations
  const currentAmp = switchClosed ? Number((voltage / resistance).toFixed(3)) : 0;
  const powerWatts = switchClosed ? Number((voltage * currentAmp).toFixed(2)) : 0;

  const handlePlotPoint = () => {
    if (!switchClosed) return;
    sounds.playClick();
    const exists = plottedPoints.some(p => Math.abs(p.v - voltage) < 0.2);
    if (!exists) {
      const updated = [...plottedPoints, { v: voltage, i: currentAmp }].sort((a, b) => a.v - b.v);
      setPlottedPoints(updated);
      addNote(`Data point logged on Oscilloscope: V = ${voltage.toFixed(1)}V, I = ${currentAmp.toFixed(3)}A.`);
      if (updated.length >= 5) {
        sounds.playVictory();
        addXP(35);
        addNote("📈 Ohm's Law verified: V-I graph is a perfect straight line passing through the origin (Slope = R). +35 XP!");
      }
    }
  };

  // Resets
  const resetTitration = () => {
    setBuretteVolume(50.0);
    setFlaskDropsAdded(0);
    setHasIndicator(false);
    setTitrationComplete(false);
    sounds.playClick();
    addNote("Burette refilled with 0.1 M NaOH. Conical flask rinsed and replenished with 10 mL dilute HCl.");
  };

  const resetMetalLab = () => {
    setHasZinc(false);
    setHasAcid(false);
    setReactionActive(false);
    setGasCollected(0);
    setSplintTested(false);
    setPopEffect(false);
    sounds.playClick();
    addNote("Boiling tube flushed and dried. Fresh zinc granules and acid dispensers prepared.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* ============================================================== */}
      {/* 1. REALISTIC LABORATORY HEADER & ENVIRONMENTAL MONITOR          */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        {/* Subtle glass reflection highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
        
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FlaskConical size={16} /> NCERT Class 10 Science Practical Workbench
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            CBSE STEM Virtual Laboratory
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Precision glassware, magnetic stirrers, gas pneumatic troughs, and electrical instruments.
          </p>
        </div>

        {/* Real-time Environmental Telemetry Panel */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono pr-2 border-r border-slate-800">
            <Thermometer size={14} className="text-amber-400" />
            <span>24.8°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono pr-2 border-r border-slate-800">
            <Gauge size={14} className="text-cyan-400" />
            <span>1.00 atm</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono pr-2 border-r border-slate-800">
            <Wind size={14} className="text-emerald-400" />
            <span>850 CFM</span>
          </div>
          <button 
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition-colors ${soundEnabled ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle Realistic Lab Acoustics"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. REALISTIC LAB WORKSTATION SELECTOR                          */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { 
            id: 'TITRATION', 
            label: '1. Acid-Base Titration', 
            sub: 'Burette, Stirrer & Phenolphthalein', 
            icon: Droplets, 
            accent: 'border-pink-500/70 text-pink-400 bg-pink-950/20' 
          },
          { 
            id: 'METAL_ACID', 
            label: '2. Hydrogen Gas Evolution', 
            sub: 'Zn + HCl Pneumatic Trough & Pop Test', 
            icon: Flame, 
            accent: 'border-amber-500/70 text-amber-400 bg-amber-950/20' 
          },
          { 
            id: 'OHM_CIRCUIT', 
            label: "3. Ohm's Law Verification", 
            sub: 'Power Supply, Knife Switch & Bulb', 
            icon: Zap, 
            accent: 'border-cyan-500/70 text-cyan-400 bg-cyan-950/20' 
          },
          { 
            id: 'PH_STRIP', 
            label: '4. Universal pH Spot Plate', 
            sub: 'Whatman Indicator Strips 1-14', 
            icon: Activity, 
            accent: 'border-purple-500/70 text-purple-400 bg-purple-950/20' 
          }
        ].map((station) => (
          <button
            key={station.id}
            onClick={() => {
              sounds.playClick();
              setActiveExp(station.id as LabExperiment);
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              activeExp === station.id 
                ? `${station.accent} shadow-xl ring-2 ring-white/10 scale-[1.01]` 
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <station.icon size={20} className={activeExp === station.id ? '' : 'text-slate-400'} />
              {activeExp === station.id && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </div>
            <div className="font-bold text-sm tracking-tight">{station.label}</div>
            <div className="text-[11px] opacity-70 mt-0.5">{station.sub}</div>
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 3. PHYSICAL BENCH STAGE & SPIRAL LAB NOTEBOOK LAYOUT          */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ============================================================ */}
        {/* SPATIAL LABORATORY BENCH (2 cols)                           */}
        {/* ============================================================ */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col justify-between min-h-[580px] lab-bench-wood">
          
          {/* Ceramic Tile Background Pattern on Wall */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Polished Epoxy Lab Countertop (3D Perspective Base) */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800/90 lab-beveled-edge pointer-events-none">
            {/* Bevel reflection line */}
            <div className="w-full h-1 bg-white/10"></div>
          </div>

          {/* ========================================================== */}
          {/* APPARATUS 1: PRECISION TITRATION WORKBENCH                */}
          {/* ========================================================== */}
          {activeExp === 'TITRATION' && (
            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              
              {/* Benchtop Instrument Header */}
              <div className="flex justify-between items-center bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-xs">
                    <span className="text-slate-400">Burette Titrant: </span>
                    <strong className="text-cyan-400 font-mono">0.1 M NaOH</strong>
                  </div>
                  <div className="w-px h-4 bg-slate-700"></div>
                  <div className="text-xs">
                    <span className="text-slate-400">Flask Analyte: </span>
                    <strong className="text-pink-400 font-mono">10.0 mL Dilute HCl</strong>
                  </div>
                  <div className="w-px h-4 bg-slate-700"></div>
                  <div className="text-xs">
                    <span className="text-slate-400">Indicator: </span>
                    <strong className={hasIndicator ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {hasIndicator ? 'Phenolphthalein' : 'None'}
                    </strong>
                  </div>
                </div>

                <button 
                  onClick={resetTitration} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <RotateCcw size={14} /> Reset Glassware
                </button>
              </div>

              {/* Physical Apparatus Center (Retort Stand + Burette + Magnetic Stirrer Flask) */}
              <div className="my-6 flex justify-around items-end">
                
                {/* 1. Cast-Iron Retort Stand & Graduated Glass Burette */}
                <div className="relative flex flex-col items-center">
                  
                  {/* Chrome Vertical Support Rod */}
                  <div className="absolute top-0 bottom-4 w-2 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-full shadow-lg left-2"></div>
                  
                  {/* Heavy Cast-Iron Retort Base Plate */}
                  <div className="w-36 h-6 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl relative z-10 flex items-center justify-center">
                    <span className="text-[9px] text-slate-500 font-mono font-bold tracking-widest">RETORT STAND</span>
                  </div>

                  {/* Dual Bosshead Burette Clamp */}
                  <div className="absolute top-28 left-0 w-24 h-4 bg-slate-700 rounded-sm shadow-md flex items-center justify-between px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>

                  {/* Borosilicate Glass Burette Column */}
                  <div className="absolute -top-6 left-12 flex flex-col items-center">
                    <div className="text-[10px] text-cyan-300 font-mono mb-1 font-bold">
                      {buretteVolume.toFixed(1)} mL
                    </div>

                    {/* Graduated Glass Tube with Meniscus Liquid */}
                    <div className="w-7 h-52 bg-slate-800/80 border-2 border-slate-400/80 rounded-t-sm relative overflow-hidden flex flex-col justify-end shadow-inner glass-specular">
                      {/* Fluid inside */}
                      <div 
                        className="w-full bg-cyan-400/40 transition-all duration-300 border-t-2 border-cyan-300"
                        style={{ height: `${(buretteVolume / 50) * 100}%` }}
                      >
                        {/* Meniscus curve highlight */}
                        <div className="w-full h-1.5 bg-cyan-200/70 rounded-full opacity-80"></div>
                      </div>

                      {/* Graduated Tick Marks */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-1 opacity-50">
                        {[0, 10, 20, 30, 40, 50].map(v => (
                          <div key={v} className="w-full flex justify-between text-[7px] text-white font-mono">
                            <span>—</span><span>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brass PTFE Stopcock Valve with Turning Handle */}
                    <div 
                      onClick={() => handleDispenseNaOH(1)}
                      className="w-8 h-5 bg-amber-600 hover:bg-amber-500 rounded-sm my-0.5 flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
                      title="Click Stopcock to Dispense 1 Drop"
                    >
                      <div className="w-1.5 h-6 bg-slate-950 rounded-full transform rotate-45"></div>
                    </div>

                    {/* Fine Capillary Tip */}
                    <div className="w-1.5 h-6 bg-slate-500 rounded-b-sm"></div>

                    {/* Dispensed Falling Drop */}
                    {dispenseAnim && (
                      <div className="w-2.5 h-3 bg-cyan-300 rounded-full animate-bounce mt-1 shadow-[0_0_8px_#38bdf8]"></div>
                    )}
                  </div>
                </div>

                {/* 2. Corning Digital Magnetic Stirrer & Erlenmeyer Flask */}
                <div className="flex flex-col items-center relative z-20">
                  
                  {/* Digital pH Probe suspended into flask */}
                  <div className="relative mb-2">
                    <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono font-bold">DIGITAL pH METER:</span>
                      <span className={`text-sm font-black font-mono ${
                        flaskDropsAdded < 18 ? 'text-red-400' :
                        flaskDropsAdded >= 20 ? 'text-pink-400' : 'text-emerald-400'
                      }`}>
                        {flaskDropsAdded < 18 ? (1.2 + flaskDropsAdded * 0.28).toFixed(2) :
                         flaskDropsAdded >= 20 ? '8.35' : '7.00'}
                      </span>
                    </div>
                  </div>

                  {/* Erlenmeyer Glass Flask SVG */}
                  <div className="relative w-44 h-48 flex items-end justify-center">
                    <svg viewBox="0 0 160 180" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                      {/* Flask Wall */}
                      <path 
                        d="M 65 10 L 95 10 L 95 60 L 148 155 A 15 15 0 0 1 135 172 L 25 172 A 15 15 0 0 1 12 155 L 65 60 Z" 
                        fill="rgba(30, 41, 59, 0.45)" 
                        stroke="#94a3b8" 
                        strokeWidth="3.5"
                      />
                      {/* Liquid Meniscus & Color */}
                      <path 
                        d={`M 30 ${125 - Math.min(20, flaskDropsAdded * 0.4)} 
                            Q 80 ${122 - Math.min(20, flaskDropsAdded * 0.4)} 130 ${125 - Math.min(20, flaskDropsAdded * 0.4)} 
                            L 136 167 L 24 167 Z`}
                        fill={
                          hasIndicator 
                            ? (flaskDropsAdded >= 20 ? 'rgba(244, 114, 182, 0.9)' : 'rgba(241, 245, 249, 0.35)') 
                            : 'rgba(241, 245, 249, 0.25)'
                        }
                        className="transition-colors duration-500"
                      />
                      {/* Magnetic Stirring Vortex Pill */}
                      {stirrerActive && (
                        <rect x="70" y="162" width="20" height="4" rx="2" fill="#ffffff" className="animate-spin origin-[80px_164px]" />
                      )}
                    </svg>

                    {/* Phenolphthalein Pink Vortex Ripples */}
                    {stirrerActive && hasIndicator && flaskDropsAdded >= 20 && (
                      <div className="absolute bottom-8 flex gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-ping delay-150"></div>
                      </div>
                    )}
                  </div>

                  {/* Authentic Digital Magnetic Hotplate/Stirrer Base */}
                  <div className="w-56 bg-slate-900 rounded-2xl border-2 border-slate-700 p-3 shadow-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">DIGITAL STIRRER</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">{stirrerActive ? `${stirrerRpm} RPM` : 'STBY'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => {
                          sounds.playClick();
                          setStirrerActive(!stirrerActive);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          stirrerActive ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stirrerActive ? 'STIRRER ON' : 'STIRRER OFF'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500 font-bold">SPEED</span>
                        <input
                          type="range"
                          min="200"
                          max="800"
                          step="50"
                          value={stirrerRpm}
                          onChange={(e) => setStirrerRpm(Number(e.target.value))}
                          className="w-16 accent-cyan-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Benchtop Physical Action Bar */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sounds.playBubble();
                      setHasIndicator(true);
                      addNote("Added 2 drops of Phenolphthalein indicator into flask. Analyte remains colorless in acidic medium (pH < 7).");
                    }}
                    disabled={hasIndicator}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      hasIndicator 
                        ? 'bg-pink-950/60 text-pink-300 border border-pink-700/50' 
                        : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md'
                    }`}
                  >
                    <Droplets size={14} /> {hasIndicator ? 'Phenolphthalein Present' : 'Add 2 Drops Indicator'}
                  </button>

                  <button
                    onClick={() => handleDispenseNaOH(1)}
                    disabled={buretteVolume <= 0 || titrationComplete}
                    className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Droplets size={14} /> Dispense 1 Drop NaOH (0.5 mL)
                  </button>

                  <button
                    onClick={() => handleDispenseNaOH(5)}
                    disabled={buretteVolume <= 0 || titrationComplete}
                    className="px-4 py-2.5 bg-cyan-800 hover:bg-cyan-700 text-cyan-100 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                  >
                    +5 Drops Stream (2.5 mL)
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Total Titrant Consumed</div>
                  <div className="text-xl font-black text-cyan-300 font-mono">
                    {(flaskDropsAdded * 0.5).toFixed(1)} mL NaOH
                  </div>
                </div>
              </div>

              {/* Balanced Chemical Reaction Banner */}
              <div className="mt-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center text-xs text-slate-300 font-mono">
                HCl (aq) + NaOH (aq) ➔ NaCl (aq) + H₂O (l) + ΔH (Exothermic Neutralization)
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* APPARATUS 2: HYDROGEN GAS EVOLUTION (Zn + HCl)            */}
          {/* ========================================================== */}
          {activeExp === 'METAL_ACID' && (
            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              
              <div className="flex justify-between items-center bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl backdrop-blur-md shadow-lg">
                <div className="text-xs">
                  <span className="text-slate-400">Chemical Reaction: </span>
                  <strong className="text-amber-400 font-mono">Granulated Zinc (Zn) + Dilute Hydrochloric Acid (HCl)</strong>
                </div>
                <button 
                  onClick={resetMetalLab}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  <RotateCcw size={14} /> Reset Experiment
                </button>
              </div>

              {/* Physical Setup: Clamped Boiling Tube + Delivery Tube + Soap Trough */}
              <div className="my-8 flex justify-center items-end gap-12">
                
                {/* 1. Heavy Clamped Boiling Test Tube */}
                <div className="flex flex-col items-center">
                  <div className="text-[11px] text-amber-300 font-bold mb-2 font-mono">Boiling Reaction Tube</div>
                  
                  {/* Borosilicate Tube Glassware */}
                  <div className="w-18 h-60 bg-slate-800/70 border-2 border-slate-400 rounded-b-full relative overflow-hidden flex flex-col justify-end p-1.5 shadow-2xl glass-specular">
                    {/* Acid Level */}
                    {hasAcid && (
                      <div className="w-full h-36 bg-cyan-400/25 rounded-b-full relative overflow-hidden transition-all duration-500">
                        {/* Rising Effervescence Bubble Swarms */}
                        {reactionActive && (
                          <div className="absolute inset-0 flex flex-wrap justify-around items-end">
                            {[1,2,3,4,5,6,7,8].map(i => (
                              <div 
                                key={i} 
                                className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
                                style={{ animationDuration: `${0.35 + i * 0.12}s` }}
                              ></div>
                            ))}
                          </div>
                        )}
                        {/* Zinc Granules Pellets at bottom */}
                        {hasZinc && (
                          <div className="absolute bottom-2 inset-x-2 flex gap-1 justify-center items-center">
                            <div className="w-3.5 h-3.5 bg-slate-300 rounded-sm transform rotate-12 shadow-sm"></div>
                            <div className="w-4 h-3 bg-slate-400 rounded-sm transform -rotate-12 shadow-sm"></div>
                            <div className="w-3.5 h-3.5 bg-slate-300 rounded-sm shadow-sm"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="w-24 h-5 bg-slate-800 rounded-lg mt-2 border border-slate-700 shadow-md"></div>
                </div>

                {/* 2. Glass Delivery Tube Arc */}
                <div className="w-28 h-28 border-t-4 border-r-4 border-slate-400 rounded-tr-3xl mb-36 -mx-8 pointer-events-none opacity-70"></div>

                {/* 3. Inverted Gas Collector in Soap Trough */}
                <div className="flex flex-col items-center">
                  <div className="text-[11px] text-cyan-300 font-bold mb-2 font-mono">Pneumatic Inverted Jar</div>
                  
                  <div className="w-28 h-52 bg-slate-900/90 border-2 border-cyan-400/60 rounded-t-3xl relative overflow-hidden flex flex-col justify-start p-2 shadow-2xl glass-specular">
                    {/* Displaced Hydrogen Gas level */}
                    <div 
                      className="w-full bg-gradient-to-b from-cyan-400/30 to-transparent transition-all duration-300 flex items-center justify-center border-b border-cyan-300/40"
                      style={{ height: `${gasCollected}%` }}
                    >
                      <span className="text-[10px] text-cyan-200 font-mono font-bold">
                        H₂ Gas ({gasCollected}%)
                      </span>
                    </div>

                    {/* Pop Test Explosion Visual Effect */}
                    {popEffect && (
                      <div className="absolute inset-0 bg-amber-400/90 flex flex-col items-center justify-center text-slate-950 font-black text-2xl animate-ping">
                        💥 POP!
                        <span className="text-xs font-mono font-bold">H₂ Combusted</span>
                      </div>
                    )}
                  </div>

                  {/* Soap Solution Trough Base */}
                  <div className="w-36 h-8 bg-slate-800 rounded-xl mt-2 border border-slate-700 text-center text-[10px] text-slate-300 pt-1 font-bold shadow-md">
                    Soap Solution Basin
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setHasZinc(true);
                      addNote("Zinc metal granules (Zn) deposited into boiling test tube.");
                    }}
                    disabled={hasZinc}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    1. Add Zinc (Zn) Granules
                  </button>

                  <button
                    onClick={() => {
                      sounds.playBubble();
                      setHasAcid(true);
                      addNote("Poured 10 mL dilute HCl over Zinc granules.");
                    }}
                    disabled={hasAcid || !hasZinc}
                    className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    2. Pour Dilute HCl
                  </button>

                  <button
                    onClick={handlePopTest}
                    disabled={gasCollected < 35 || splintTested}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      gasCollected >= 35 && !splintTested
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Flame size={16} /> 3. Test with Burning Splint
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Displacement Yield</div>
                  <div className="text-xl font-black text-cyan-300 font-mono">{gasCollected}% H₂</div>
                </div>
              </div>

              <div className="mt-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center text-xs text-slate-300 font-mono">
                Zn (s) + 2HCl (aq) ➔ ZnCl₂ (aq) + H₂ (g) ↑ (Single Displacement Reaction)
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* APPARATUS 3: OHM'S LAW ELECTRIC CIRCUIT                   */}
          {/* ========================================================== */}
          {activeExp === 'OHM_CIRCUIT' && (
            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              
              <div className="flex justify-between items-center bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl backdrop-blur-md shadow-lg">
                <div className="text-xs">
                  <span className="text-slate-400">Physics Lab: </span>
                  <strong className="text-cyan-400 font-mono">Ohm's Law Verification Apparatus (V = I × R)</strong>
                </div>

                <button 
                  onClick={() => {
                    sounds.playClick();
                    setSwitchClosed(!switchClosed);
                    addNote(switchClosed ? "Opened knife switch: Current ceased (0.000 A)." : "Closed knife switch: Circuit active.");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md ${
                    switchClosed ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  <Zap size={14} /> Knife Switch: {switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                </button>
              </div>

              {/* Physical Circuit Components (DC Supply + Glowing Bulb + Analog Ammeter) */}
              <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* 1. DC Regulated Power Supply */}
                <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-2xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold mb-2">DC POWER SUPPLY</span>
                  
                  {/* Illuminated Digital 7-Segment Readout */}
                  <div className="w-32 h-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-black text-red-500 font-mono tracking-widest">
                      {switchClosed ? voltage.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-[10px] text-red-700 font-mono ml-1 font-bold">V</span>
                  </div>

                  {/* Rotary Voltage Slider */}
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>VOLTAGE POTENTIOMETER</span>
                      <span className="text-cyan-400 font-bold">{voltage.toFixed(1)} V</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" 
                      max="12.0" 
                      step="0.5" 
                      value={voltage} 
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer" 
                    />
                  </div>
                </div>

                {/* 2. Incandescent Tungsten Filament Bulb */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-3 flex flex-col items-center">
                    {/* Radiant Glow Halo */}
                    <div 
                      className="w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: switchClosed && voltage > 1.0 ? 'rgba(251, 191, 36, 0.25)' : 'transparent',
                        boxShadow: switchClosed && voltage > 1.0 ? `0 0 ${voltage * 8}px rgba(245, 158, 11, 0.7)` : 'none'
                      }}
                    >
                      {/* Glass Bulb SVG */}
                      <svg viewBox="0 0 100 120" className="w-20 h-24">
                        <circle cx="50" cy="50" r="38" fill="rgba(255,255,255,0.15)" stroke="#94a3b8" strokeWidth="2" />
                        {/* Tungsten Coiled Filament */}
                        <path 
                          d="M 40 85 L 45 45 Q 50 35 55 45 L 60 85" 
                          fill="none" 
                          stroke={switchClosed && voltage > 1.0 ? '#fbbf24' : '#64748b'} 
                          strokeWidth={switchClosed && voltage > 3.0 ? '3' : '2'}
                        />
                        <rect x="38" y="85" width="24" height="20" rx="3" fill="#64748b" />
                      </svg>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono mt-1 font-bold">
                      Tungsten Test Load (R = {resistance} Ω)
                    </span>
                  </div>

                  {/* Wire Resistance Selector */}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold">RHEOSTAT:</span>
                    {[5, 10, 20].map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          sounds.playClick();
                          setResistance(r);
                          addNote(`Adjusted Rheostat slider to ${r} Ω resistance.`);
                        }}
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          resistance === r ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r}Ω
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Precision Analog Moving-Coil Ammeter */}
                <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-2xl flex flex-col items-center shadow-2xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold mb-2">PRECISION AMMETER (A)</span>
                  
                  {/* Analog Gauge Dial */}
                  <div className="w-32 h-32 rounded-full border-4 border-slate-700 relative overflow-hidden analog-meter-dial flex flex-col items-center justify-end p-2">
                    {/* Dial Needle */}
                    <div 
                      className="w-1 h-14 bg-red-600 origin-bottom transition-transform duration-300"
                      style={{
                        transform: `rotate(${switchClosed ? Math.min(65, (currentAmp / 1.5) * 65 - 35) : -35}deg)`
                      }}
                    ></div>
                    <div className="w-4 h-4 rounded-full bg-slate-800 z-10 -mb-2"></div>
                    <span className="text-[9px] text-slate-800 font-mono font-bold z-10">CURRENT</span>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {currentAmp.toFixed(3)} A
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <button
                  onClick={handlePlotPoint}
                  disabled={!switchClosed}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-40"
                >
                  <Activity size={16} /> Log Data Point to Oscilloscope
                </button>

                <div className="text-xs text-slate-300 font-mono">
                  Dissipated Power: <strong className="text-amber-400">{powerWatts} Watts</strong> (P = V × I)
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* APPARATUS 4: UNIVERSAL PH SPOT PLATE                      */}
          {/* ========================================================== */}
          {activeExp === 'PH_STRIP' && (
            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              
              <div className="flex justify-between items-center bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl backdrop-blur-md shadow-lg">
                <div className="text-xs">
                  <span className="text-slate-400">Qualitative Analysis: </span>
                  <strong className="text-purple-400 font-mono">Universal pH Spot Plate & Capillary Strips</strong>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Dip strips into porcelain wells to reveal hydronium ion concentration.
                </div>
              </div>

              {/* Glazed Porcelain Spot Plate with 6 Circular Wells */}
              <div className="my-6 flex flex-col items-center">
                <div className="bg-slate-100 rounded-3xl p-6 border-4 border-slate-300 shadow-2xl max-w-xl w-full">
                  <div className="text-center text-[10px] text-slate-500 font-mono font-bold tracking-widest mb-4">
                    GLAZED PORCELAIN WELL SPOT PLATE (6-CAVITY)
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {PH_SAMPLES.map((sample, idx) => {
                      const isDipped = dippedWells[idx];
                      return (
                        <div 
                          key={sample.id}
                          onClick={() => {
                            sounds.playBubble();
                            setDippedWells(prev => ({ ...prev, [idx]: true }));
                            setSelectedSample(sample);
                            addXP(15);
                            addNote(`Tested ${sample.name}: Paper strip turned to color indicating pH ${sample.actualPh}.`);
                          }}
                          className="bg-white rounded-2xl p-3 border-2 border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
                        >
                          {/* Well Cavity */}
                          <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 shadow-inner flex items-center justify-center relative overflow-hidden mb-2">
                            {/* Liquid in well */}
                            <div className="w-12 h-12 rounded-full opacity-60" style={{ backgroundColor: sample.hexColor }}></div>
                            
                            {/* Whatman Test Strip dipped inside */}
                            {isDipped && (
                              <div 
                                className="absolute w-4 h-12 rounded-t-sm shadow-md transition-all duration-300 animate-bounce"
                                style={{ backgroundColor: sample.hexColor }}
                              ></div>
                            )}
                          </div>

                          <div className="text-xs font-bold text-slate-800 text-center">{sample.name}</div>
                          <div className="text-[10px] text-slate-400 text-center">{sample.desc}</div>

                          {isDipped && (
                            <span className="mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono">
                              pH {sample.actualPh}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Official 1-14 Universal Indicator Buffer Color Spectrum */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 shadow-lg">
                <div className="text-[11px] text-slate-400 font-mono font-bold mb-2">
                  OFFICIAL NCERT UNIVERSAL INDICATOR COLOR SCALE (pH 1.0 to 14.0)
                </div>
                <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner">
                  {[
                    { ph: 1, c: '#dc2626' }, { ph: 2, c: '#ef4444' }, { ph: 3, c: '#f97316' }, 
                    { ph: 4, c: '#f59e0b' }, { ph: 5, c: '#eab308' }, { ph: 6, c: '#84cc16' }, 
                    { ph: 7, c: '#22c55e' }, { ph: 8, c: '#10b981' }, { ph: 9, c: '#14b8a6' }, 
                    { ph: 10, c: '#06b6d4' }, { ph: 11, c: '#3b82f6' }, { ph: 12, c: '#6366f1' }, 
                    { ph: 13, c: '#8b5cf6' }, { ph: 14, c: '#7c3aed' }
                  ].map(p => (
                    <div key={p.ph} className="flex-1 flex items-center justify-center text-[9px] font-bold text-white font-mono" style={{ backgroundColor: p.c }}>
                      {p.ph}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* PHYSICAL SPIRAL LAB NOTEBOOK & OBSERVATIONS (1 col)         */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            {/* Notebook Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                  Science Lab Journal
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Empirical Log
              </span>
            </div>

            {/* Empirical Observation Feed */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {labNotes.map((note, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl text-xs font-mono leading-relaxed border ${
                    idx === 0 
                      ? 'bg-indigo-50/70 border-indigo-200 text-slate-900 font-bold' 
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="text-[9px] text-slate-400 mb-0.5">ENTRY #{labNotes.length - idx}</div>
                  {note}
                </div>
              ))}
            </div>

            {/* Practical Exam High-Yield Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Board Practical Viva Tip
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {activeExp === 'TITRATION' && 'Always read the LOWER meniscus for colorless liquids like NaOH, and UPPER meniscus for dark colored liquids like KMnO₄.'}
                {activeExp === 'METAL_ACID' && 'Nitric acid (HNO₃) does not evolve H₂ gas with metals because it is a strong oxidizing agent (oxidizes H₂ to H₂O), except with Mg and Mn.'}
                {activeExp === 'OHM_CIRCUIT' && 'An ideal Voltmeter has infinite resistance and is connected in parallel; an ideal Ammeter has zero resistance and is connected in series.'}
                {activeExp === 'PH_STRIP' && 'Pure water conducts almost no electricity, but adding a single drop of acid generates hydronium ions to conduct current.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>CBSE Practicals 2026</span>
            <span className="text-indigo-600 font-bold">Standard STP Verified</span>
          </div>

        </div>

      </div>

    </div>
  );
};
