import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Flame, RotateCcw, Droplets, Zap, Eye, CheckCircle2, 
  HelpCircle, Volume2, VolumeX, BookOpen, Sparkles, AlertTriangle, 
  ArrowRight, ArrowLeft, Search, FileText, BarChart3, ChevronRight, Check, Play,
  Sliders, Beaker, ShieldCheck, ChevronDown, RefreshCw, X
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { sounds } from '../services/audioService';

type ExperimentId = 
  | 'TITRATION' 
  | 'REACTION_RATE'
  | 'SALT_ANALYSIS' 
  | 'ELECTROLYSIS' 
  | 'PH_TEST' 
  | 'HEAT_REACTION' 
  | 'PREPARE_GAS' 
  | 'TEST_CO2' 
  | 'METALS_REACTIVITY'
  | 'MORE_EXPERIMENTS';

type LabPhase = 'SETUP' | 'PROCEDURE' | 'OBSERVATIONS' | 'RESULT' | 'QUESTIONS';

interface ObservationEntry {
  id: number;
  naohAdded: number; // in mL
  flaskColor: string;
  ph: number;
  remark: string;
}

export const VirtualLab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [activeExp, setActiveExp] = useState<ExperimentId>('TITRATION');
  const [activePhase, setActivePhase] = useState<LabPhase>('SETUP');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Titration Simulation State
  const [buretteVolume, setBuretteVolume] = useState(50.0); // mL remaining in burette
  const [dropsAdded, setDropsAdded] = useState(0); // 1 drop = 0.5 mL
  const [selectedBuretteSol, setSelectedBuretteSol] = useState('0.1 M NaOH');
  const [selectedFlaskSol, setSelectedFlaskSol] = useState('10.0 mL HCl');
  const [selectedIndicator, setSelectedIndicator] = useState('Phenolphthalein');
  const [stirrerActive, setStirrerActive] = useState(true);
  const [dispenseAnim, setDispenseAnim] = useState(false);
  const [continuousDispense, setContinuousDispense] = useState(false);
  
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Derived Values
  const totalVolumeAdded = Number((dropsAdded * 0.5).toFixed(1)); // in mL
  const equivalencePoint = 10.0; // 10.0 mL neutralizes 10.0 mL 0.1M HCl
  
  // Real pH calculation
  const calculatePh = (): number => {
    const v = totalVolumeAdded;
    if (v === 0) return 1.20;
    if (v < equivalencePoint) {
      const remainingMolesAcid = 0.001 - (v / 1000) * 0.1;
      const totalVolume = 0.01 + v / 1000;
      const hConc = remainingMolesAcid / totalVolume;
      return Math.max(1.20, Number((-Math.log10(hConc)).toFixed(2)));
    } else if (Math.abs(v - equivalencePoint) < 0.1) {
      return 7.00;
    } else {
      const excessMolesBase = ((v - equivalencePoint) / 1000) * 0.1;
      const totalVolume = 0.01 + v / 1000;
      const ohConc = excessMolesBase / totalVolume;
      const pOh = -Math.log10(ohConc);
      return Math.min(13.50, Number((14 - pOh).toFixed(2)));
    }
  };

  const currentPh = calculatePh();
  const isNeutralized = totalVolumeAdded >= equivalencePoint;

  // Liquid color based on phenolphthalein
  const getFlaskLiquidColor = (): string => {
    if (totalVolumeAdded === 0) return 'rgba(238, 242, 255, 0.4)'; // clear
    if (totalVolumeAdded < equivalencePoint) return 'rgba(244, 244, 255, 0.5)'; // transparent
    if (Math.abs(totalVolumeAdded - equivalencePoint) <= 0.5) return 'rgba(244, 114, 182, 0.85)'; // light pink endpoint
    return 'rgba(219, 39, 119, 0.95)'; // deep magenta in excess base
  };

  const handleDispense = (amountMl: number = 0.5) => {
    if (buretteVolume <= 0) return;
    setDispenseAnim(true);
    if (soundEnabled) sounds.playClick();

    setTimeout(() => {
      setDispenseAnim(false);
      const drops = Math.round(amountMl / 0.5);
      setDropsAdded(prev => prev + drops);
      setBuretteVolume(prev => Math.max(0, Number((prev - amountMl).toFixed(1))));

      if (totalVolumeAdded + amountMl >= equivalencePoint && !isNeutralized) {
        if (soundEnabled) sounds.playCelebration();
        addXP(50);
      }
    }, 250);
  };

  const handleReset = () => {
    if (soundEnabled) sounds.playClick();
    setBuretteVolume(50.0);
    setDropsAdded(0);
    setContinuousDispense(false);
  };

  // Continuous dispensing interval
  useEffect(() => {
    let interval: any = null;
    if (continuousDispense && buretteVolume > 0) {
      interval = setInterval(() => {
        handleDispense(0.5);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [continuousDispense, buretteVolume]);

  const EXPERIMENTS = [
    { id: 'TITRATION', title: 'Acid-Base Titration', chapter: 'Acids, Bases & Salts' },
    { id: 'REACTION_RATE', title: 'Reaction Rate', chapter: 'Chemical Reactions' },
    { id: 'SALT_ANALYSIS', title: 'Salt Analysis', chapter: 'Chemical Reactions' },
    { id: 'ELECTROLYSIS', title: 'Electrolysis of Water', chapter: 'Chemical Reactions' },
    { id: 'PH_TEST', title: 'pH Indicator Test', chapter: 'Acids, Bases & Salts' },
    { id: 'HEAT_REACTION', title: 'Heat of Reaction', chapter: 'Chemical Reactions' },
    { id: 'PREPARE_GAS', title: 'Prepare a Gas', chapter: 'Metals & Non-metals' },
    { id: 'TEST_CO2', title: 'Test for CO₂', chapter: 'Chemical Reactions' },
    { id: 'METALS_REACTIVITY', title: 'Metals Reactivity', chapter: 'Metals & Non-metals' },
    { id: 'MORE_EXPERIMENTS', title: 'More Experiments', chapter: 'CBSE STEM Vault' },
  ];

  const filteredExperiments = EXPERIMENTS.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.chapter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-5 animate-[fadeIn_0.2s_ease-out]">
      
      {/* Top Header Bar matching Screen 4 in media_1790433716001.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Virtual Laboratory</h2>
            <p className="text-xs text-slate-400">Perform experiments with realistic simulations and step-by-step guidance.</p>
          </div>
        </div>

        {/* Action Pills: Theory, Lab Manual, Report */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold shadow-2xs transition-colors"
          >
            <BookOpen size={13} className="text-indigo-600" />
            <span>Theory</span>
          </button>

          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileText size={13} className="text-indigo-600" />
            <span>Lab Manual</span>
          </button>

          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold shadow-2xs transition-colors"
          >
            <BarChart3 size={13} className="text-indigo-600" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Phase Flow Pills matching Screen 4 */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'SETUP', label: 'Experiment Setup' },
          { id: 'PROCEDURE', label: 'Procedure' },
          { id: 'OBSERVATIONS', label: 'Observations' },
          { id: 'RESULT', label: 'Result' },
          { id: 'QUESTIONS', label: 'Questions' }
        ].map((phase) => {
          const isActive = activePhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => { sounds.playClick(); setActivePhase(phase.id as LabPhase); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {phase.label}
            </button>
          );
        })}
      </div>

      {/* 3-Column Studio Layout matching Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: EXPERIMENTS DIRECTORY (col-span-3)                */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700">Experiments</div>

          {/* Search Input */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-400"
            />
          </div>

          {/* Experiments List */}
          <div className="space-y-1 max-h-[520px] overflow-y-auto custom-scrollbar pr-0.5">
            {filteredExperiments.map(exp => {
              const isSelected = activeExp === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveExp(exp.id as ExperimentId);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                    isSelected 
                      ? 'bg-blue-50/80 border border-blue-200 text-blue-800 font-bold shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FlaskConical size={14} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="truncate">{exp.title}</span>
                  </div>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER COLUMN: REALISTIC LABORATORY BENCH (col-span-6)         */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-300 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[680px]">
          
          {/* Realistic Chemistry Lab Bench Background Image */}
          <img 
            src="/images/lab_bench.jpg" 
            alt="Chemistry Laboratory Bench Countertop" 
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />

          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/60 pointer-events-none" />

          {/* Top Info Bar */}
          <div className="relative z-10 px-4 py-2.5 bg-slate-950/70 backdrop-blur-md border-b border-white/10 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-white font-bold">Acid-Base Neutralization Simulation</span>
            </div>
            <div className="font-mono text-[10px] text-cyan-300">
              {totalVolumeAdded.toFixed(1)} mL Dispensed
            </div>
          </div>

          {/* Apparatus Stage */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-4">
            
            {/* RETORT STAND BASE & VERTICAL CHROME ROD */}
            <div className="absolute left-[30%] top-6 bottom-10 flex flex-col items-center pointer-events-none">
              <div className="w-2 h-full bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-full shadow-md" />
              <div className="w-32 h-3.5 bg-gradient-to-b from-slate-700 to-slate-950 rounded-md -mt-1 border border-slate-600 shadow-xl" />
            </div>

            {/* HORIZONTAL EXTENSION CLAMP */}
            <div className="absolute left-[30%] top-[30%] w-24 h-3.5 bg-gradient-to-r from-slate-500 to-slate-300 rounded-r-md border border-slate-400 shadow-sm z-10" />

            {/* GLASS BURETTE COLUMN */}
            <div className="absolute left-[44%] top-6 flex flex-col items-center z-20">
              
              {/* Floating White Badge matching mockup */}
              <div className="mb-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-800 shadow-md">
                Burette: <span className="text-blue-600">{selectedBuretteSol}</span>
              </div>

              {/* Glass Tube Body */}
              <div className="w-9 h-72 bg-gradient-to-r from-white/30 via-cyan-100/10 to-white/40 border-x border-t border-white/60 relative shadow-inner overflow-hidden backdrop-blur-xs rounded-t-sm">
                
                {/* Metric graduation ticks */}
                <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-2 pointer-events-none opacity-60">
                  {[0, 10, 20, 30, 40, 50].map((t) => (
                    <div key={t} className="flex items-center gap-1 justify-end">
                      <span className="text-[7px] font-mono text-cyan-200">{t}</span>
                      <div className="w-1.5 h-px bg-cyan-200" />
                    </div>
                  ))}
                </div>

                {/* Liquid Level Inside Burette */}
                <div 
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cyan-400/70 to-cyan-200/50 transition-all duration-300"
                  style={{ height: `${(buretteVolume / 50) * 100}%` }}
                >
                  <div className="w-full h-1 bg-cyan-100/90 rounded-b-full" />
                </div>
              </div>

              {/* PTFE Stopcock Valve & Nozzle */}
              <div className="relative flex flex-col items-center">
                <div className="w-3.5 h-5 bg-amber-600 rounded-xs border border-amber-400 shadow-sm flex items-center justify-center">
                  <div className="w-7 h-1.5 bg-amber-400 rounded-full" />
                </div>
                <div className="w-1 h-5 bg-white/50 border-x border-white/60 rounded-b-full" />
              </div>

              {/* Animated Liquid Stream / Dripping Drops */}
              {dispenseAnim && (
                <div className="w-0.5 h-10 bg-cyan-300 animate-pulse rounded-full shadow-[0_0_6px_#38bdf8]" />
              )}
            </div>

            {/* ERLENMEYER CONICAL FLASK */}
            <div className="absolute left-[44%] bottom-10 flex flex-col items-center z-10">
              
              <div className="relative w-40 h-44 flex flex-col items-center">
                
                {/* Neck */}
                <div className="w-7 h-7 bg-white/20 border-x border-white/50 relative backdrop-blur-2xs">
                  <div className="absolute -top-1 inset-x-0 h-1 rounded-full border border-white/60 bg-white/30" />
                </div>

                {/* Conical Flask Body */}
                <div 
                  className="w-40 h-36 relative border-b border-white/60 shadow-xl overflow-hidden flex items-end justify-center"
                  style={{
                    clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)',
                    backdropFilter: 'blur(2px)'
                  }}
                >
                  {/* Dynamic Color Fluid */}
                  <div 
                    className="w-full transition-all duration-500 ease-out relative flex items-center justify-center"
                    style={{
                      height: `${Math.min(80, 35 + totalVolumeAdded * 3.5)}%`,
                      backgroundColor: getFlaskLiquidColor(),
                      boxShadow: isNeutralized ? '0 0 25px rgba(244, 114, 182, 0.9)' : 'none'
                    }}
                  >
                    {/* Magnetic Stirrer */}
                    {stirrerActive && (
                      <div className="w-6 h-1.5 bg-white rounded-full shadow-md animate-[spin_0.2s_linear_infinite]" />
                    )}
                  </div>
                </div>

                {/* Floating Conical Flask Badge matching mockup */}
                <div className="mt-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-800 shadow-md text-center">
                  <div>Conical Flask</div>
                  <div className="text-[9px] text-slate-500">{selectedFlaskSol} • {selectedIndicator}</div>
                </div>
              </div>
            </div>

            {/* DIGITAL PH METER DISPLAY BOX (RIGHT OF APPARATUS) matching Screen 4 */}
            <div className="absolute right-4 top-20 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl flex flex-col items-center w-44 z-20 backdrop-blur-md p-4">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">pH Meter</span>
              
              {/* LCD Display */}
              <div className="my-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full text-center shadow-inner">
                <span className={`text-3xl font-black font-mono tracking-tight transition-colors ${
                  isNeutralized ? 'text-pink-400 animate-pulse' : 'text-cyan-400'
                }`}>
                  {currentPh.toFixed(2)}
                </span>
                <span className="text-[9px] font-mono text-slate-500 block">pH</span>
              </div>

              <div className="text-[10px] font-mono font-bold">
                {currentPh < 6.8 ? (
                  <span className="text-rose-400">Acidic</span>
                ) : currentPh > 7.2 ? (
                  <span className="text-pink-400">Basic</span>
                ) : (
                  <span className="text-emerald-400">Neutral (pH 7)</span>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Bench Surface Strip */}
          <div className="relative z-10 px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
            <span>Indicator: {selectedIndicator}</span>
            <span>Reaction: HCl + NaOH → NaCl + H₂O</span>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: CONTROLS TRAY (col-span-3)                        */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
          <div className="text-xs font-bold text-slate-700">Controls</div>

          {/* Burette Solution */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500">Burette Solution</label>
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
              <span>{selectedBuretteSol}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Flask Solution */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500">Flask Solution</label>
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
              <span>{selectedFlaskSol}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Indicator */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500">Indicator</label>
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
              <span>{selectedIndicator}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Dispense Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-medium text-slate-500">Dispense Titrant</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleDispense(0.5)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              >
                +0.5 mL
              </button>
              <button
                onClick={() => handleDispense(1.0)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              >
                +1.0 mL
              </button>
              <button
                onClick={() => handleDispense(5.0)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              >
                +5.0 mL
              </button>
            </div>

            <button
              onClick={() => setContinuousDispense(!continuousDispense)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                continuousDispense 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
              }`}
            >
              <Droplets size={14} />
              <span>{continuousDispense ? 'Stop Dripping' : 'Continuous Drip'}</span>
            </button>
          </div>

          {/* Reset Button matching Screen 4 */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Reset Experiment</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal: Theory */}
      {showTheoryModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Titration Theory</h3>
              <button onClick={() => setShowTheoryModal(false)}><X size={16} /></button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acid-base titration is a quantitative analysis method to determine the unknown concentration of an acid or base. In the neutralization reaction:
              <br /><br />
              <code className="bg-slate-100 p-1.5 rounded block text-indigo-700 font-mono">
                HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)
              </code>
              <br />
              At equivalence point (pH 7), moles of H⁺ equal moles of OH⁻. Phenolphthalein turns light pink at pH 8.2–10.0 indicating complete neutralization.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Lab Manual */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Lab Manual & Procedure</h3>
              <button onClick={() => setShowManualModal(false)}><X size={16} /></button>
            </div>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Rinse and fill the burette with 0.1 M NaOH solution up to the 0 mL mark.</li>
              <li>Pipette out 10.0 mL of 0.1 M HCl into the conical flask.</li>
              <li>Add 2–3 drops of phenolphthalein indicator into the flask. The solution remains colorless.</li>
              <li>Titrate by adding NaOH dropwise with continuous stirring until a persistent faint pink color appears.</li>
              <li>Note the final volume of NaOH used from the burette.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Modal: Report */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Live Experiment Report</h3>
              <button onClick={() => setShowReportModal(false)}><X size={16} /></button>
            </div>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span>Initial Burette Reading:</span>
                <span className="font-mono font-bold">50.0 mL</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span>Volume NaOH Dispensed:</span>
                <span className="font-mono font-bold">{totalVolumeAdded.toFixed(1)} mL</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span>Current pH:</span>
                <span className="font-mono font-bold">{currentPh.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span>Status:</span>
                <span className="font-bold text-indigo-600">{isNeutralized ? 'Neutralized / End Point Reached' : 'Under-titrated (Acidic)'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
