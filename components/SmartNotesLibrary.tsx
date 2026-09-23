import React, { useState, useEffect } from 'react';
import { 
  StickyNote, Sparkles, BookOpen, Sigma, Plus, Trash2, Pin, Volume2, 
  Printer, CheckCircle2, AlertTriangle, Calculator, FileText, Share2, 
  Bookmark, Search, ExternalLink, Dna, Atom, Zap, X, ChevronRight
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { rewriteContent } from '../services/geminiService';
import { sounds } from '../services/audioService';

interface CustomNote {
  id: string;
  title: string;
  content: string;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'General';
  isPinned: boolean;
  date: string;
}

interface MasterNote {
  id: string;
  title: string;
  chapter: string;
  subject: 'Chemistry' | 'Physics' | 'Biology';
  summary: string;
  highYieldPoints: string[];
  keyEquations: string[];
  boardExamTrap: string;
  mnemonic: string;
  difficulty: 'Core' | 'High Yield' | 'Numerical Heavy';
}

const MASTER_NOTES: MasterNote[] = [
  {
    id: 'chem_01',
    title: 'Chemical Reactions & Equations',
    chapter: 'Chapter 1: Chemical Reactions',
    subject: 'Chemistry',
    summary: 'A chemical reaction involves breaking old bonds and making new bonds to produce new substances. Verified by change in state, color, temperature, or evolution of gas.',
    highYieldPoints: [
      'Magnesium ribbon is cleaned with sandpaper before burning to remove the protective layer of basic magnesium carbonate/oxide.',
      'Law of Conservation of Mass: Total mass of reactants must equal total mass of products.',
      'Rusting of iron requires both oxygen and moisture.'
    ],
    keyEquations: [
      '2Mg (s) + O₂ (g) ➔ 2MgO (s) [Dazzling white flame + white powder]',
      'Fe (s) + CuSO₄ (aq) ➔ FeSO₄ (aq) + Cu (s) [Blue to light green]',
      'CaO (s) + H₂O (l) ➔ Ca(OH)₂ (aq) + Heat [Slaking of Lime - Exothermic]'
    ],
    boardExamTrap: 'Students often forget physical state symbols (s, l, g, aq). Always include states for full 3-mark board questions.',
    mnemonic: 'OIL RIG — Oxidation Is Loss of electrons/gain of O; Reduction Is Gain of electrons/loss of O.',
    difficulty: 'Core'
  },
  {
    id: 'chem_02',
    title: 'Acids, Bases & Salts',
    chapter: 'Chapter 2: Acids, Bases and Salts',
    subject: 'Chemistry',
    summary: 'Acids generate H⁺ (aq) or H₃O⁺ ions in water; bases generate OH⁻ (aq) ions. Water must always be added to acid slowly with constant stirring to prevent thermal splash.',
    highYieldPoints: [
      'Dry HCl gas does NOT change the color of dry blue litmus paper because ions only dissociate in aqueous medium.',
      'Tooth decay starts when mouth pH falls below 5.5 (bacteria produce acid from sugars).',
      'Plaster of Paris (CaSO₄·½H₂O) sets into gypsum (CaSO₄·2H₂O) within 15 minutes when mixed with water.'
    ],
    keyEquations: [
      'Acid + Metal ➔ Salt + H₂ (g) ↑ [Pop sound test with burning splint]',
      'Acid + Base ➔ Salt + H₂O (l) [Neutralization: Exothermic reaction]',
      '2NaHCO₃ ➔ Na₂CO₃ + H₂O + CO₂ ↑ [Heating Baking Soda]'
    ],
    boardExamTrap: 'Never add water to concentrated acid! Always add acid to water dropwise with continuous stirring.',
    mnemonic: 'BAR: Base turns Red litmus to Blue (B-B: Base -> Blue).',
    difficulty: 'High Yield'
  },
  {
    id: 'phys_01',
    title: "Ohm's Law & Electric Circuits",
    chapter: 'Chapter 12: Electricity',
    subject: 'Physics',
    summary: 'The electric current flowing through a metallic conductor is directly proportional to the potential difference across its terminals, provided temperature remains constant (V = IR).',
    highYieldPoints: [
      'Ammeter is always connected in series (low resistance); Voltmeter in parallel (high resistance).',
      'Resistance R = ρ(L / A). If wire length is doubled, resistance doubles; if radius is halved, area becomes 1/4 and R increases 4x.',
      'Joule Heating Law: H = I²Rt.'
    ],
    keyEquations: [
      'V = I × R (Ohm\'s Law)',
      'R_series = R₁ + R₂ + R₃',
      '1 / R_parallel = 1/R₁ + 1/R₂ + 1/R₃',
      'P = V × I = I²R = V² / R'
    ],
    boardExamTrap: 'When stretching a wire to double length, volume is constant, so cross-sectional area halves, making the new resistance 4 times the original!',
    mnemonic: 'VIR Triangle: V at top, I and R at bottom. Cover the one you want to calculate!',
    difficulty: 'Numerical Heavy'
  },
  {
    id: 'phys_02',
    title: 'Light: Reflection & Spherical Mirrors',
    chapter: 'Chapter 10: Light Reflection & Refraction',
    subject: 'Physics',
    summary: 'Concave mirrors form real, inverted images for most positions, but form virtual, erect, magnified images when object is placed between Pole and Focus.',
    highYieldPoints: [
      'New Cartesian Sign Convention: Distances measured in direction of incident ray are positive; opposite are negative. Object distance u is ALWAYS negative.',
      'Focal length of concave mirror is NEGATIVE; convex mirror is POSITIVE.',
      'Convex mirrors are used as rear-view mirrors because they always form erect, diminished images with wider field of view.'
    ],
    keyEquations: [
      '1/f = 1/v + 1/u (Mirror Formula)',
      'm = -v/u = h\'/h (Magnification)',
      'n = sin(i) / sin(r) = c / v (Snell\'s Law of Refraction)'
    ],
    boardExamTrap: 'Do not confuse mirror formula (1/f = 1/v + 1/u) with lens formula (1/f = 1/v - 1/u). Watch the negative sign!',
    mnemonic: 'Concave Cares (Caves inward, Focus negative); Convex Connects (Bulges outward, Focus positive).',
    difficulty: 'Numerical Heavy'
  },
  {
    id: 'bio_01',
    title: 'Life Processes: Nutrition & Respiration',
    chapter: 'Chapter 6: Life Processes',
    subject: 'Biology',
    summary: 'Autotrophic nutrition utilizes sunlight and chlorophyll to convert CO₂ and H₂O into glucose and oxygen. Heterotrophs rely on organic nutrients digested via enzymes.',
    highYieldPoints: [
      'Salivary amylase digests starch into maltose in the mouth.',
      'Stomach secretes HCl (creates acidic pH ~1.5 for pepsin activation), Pepsin (digests protein), and Mucus (protects stomach lining).',
      'Small intestine is the site of complete digestion of carbohydrates, proteins, and fats via villi with high surface area.'
    ],
    keyEquations: [
      '6CO₂ + 12H₂O + Sunlight + Chlorophyll ➔ C₆H₁₂O₆ + 6O₂ + 6H₂O',
      'Glucose ➔ Pyruvate (Cytoplasm) ➔ CO₂ + H₂O + 38 ATP (Mitochondria)'
    ],
    boardExamTrap: 'Anaerobic respiration in muscle cells produces Lactic Acid + 2 ATP (causing cramps), NOT Ethanol!',
    mnemonic: 'PMAT for Mitosis; SAM for Salivary Amylase breaks down Maltose.',
    difficulty: 'High Yield'
  }
];

export const SmartNotesLibrary: React.FC = () => {
  const { digitalTwin, addXP } = useStudent();
  const [activeTab, setActiveTab] = useState<'NOTES' | 'SOLVER' | 'SCRATCHPAD'>('NOTES');
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<MasterNote | null>(null);

  // AI Modal
  const [aiAssistantText, setAiAssistantText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- SOLVER STATES ---
  const [ohmVoltage, setOhmVoltage] = useState<string>('12');
  const [ohmResistance, setOhmResistance] = useState<string>('4');
  const [ohmResult, setOhmResult] = useState<string>('3.00 A');

  const [mirrorF, setMirrorF] = useState<string>('-15');
  const [mirrorU, setMirrorU] = useState<string>('-30');
  const [mirrorResult, setMirrorResult] = useState<{ v: string; m: string; nature: string }>({
    v: '-30.00 cm',
    m: '-1.00',
    nature: 'Real, Inverted, Same Size (at 2F)'
  });

  // --- CUSTOM SCRATCHPAD NOTES ---
  const [customNotes, setCustomNotes] = useState<CustomNote[]>(() => {
    try {
      const saved = localStorage.getItem('shiksha_custom_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        title: 'Board Exam Morning Checklist',
        content: '1. Remember sign conventions for optics: u is always negative!\n2. Physical states in chemical equations: (s), (l), (g), (aq).\n3. Diagram of nephron and reflex arc with neat labeling.',
        category: 'General',
        isPinned: true,
        date: new Date().toLocaleDateString()
      }
    ];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Chemistry' | 'Physics' | 'Biology' | 'General'>('Chemistry');

  useEffect(() => {
    localStorage.setItem('shiksha_custom_notes', JSON.stringify(customNotes));
  }, [customNotes]);

  // Solver: Ohm's Law Calculator
  const calculateOhm = () => {
    sounds.playClick();
    const v = parseFloat(ohmVoltage);
    const r = parseFloat(ohmResistance);
    if (!isNaN(v) && !isNaN(r) && r > 0) {
      const i = v / r;
      setOhmResult(`${i.toFixed(2)} A (Power = ${(v * i).toFixed(2)} W)`);
      addXP(5);
    } else {
      setOhmResult('Invalid inputs');
    }
  };

  // Solver: Mirror Formula Calculator (1/f = 1/v + 1/u => 1/v = 1/f - 1/u)
  const calculateMirror = () => {
    sounds.playClick();
    const f = parseFloat(mirrorF);
    const u = parseFloat(mirrorU);
    if (!isNaN(f) && !isNaN(u) && f !== 0 && u !== 0 && f !== u) {
      const invV = (1 / f) - (1 / u);
      const v = 1 / invV;
      const m = -v / u;
      const nature = v < 0 ? (Math.abs(m) > 1 ? 'Real, Inverted, Magnified' : Math.abs(m) < 1 ? 'Real, Inverted, Diminished' : 'Real, Inverted, Same Size') : 'Virtual, Erect, Magnified';
      setMirrorResult({
        v: `${v.toFixed(2)} cm`,
        m: m.toFixed(2),
        nature
      });
      addXP(10);
    }
  };

  // AI Helper
  const handleAiAction = async (note: MasterNote, mode: 'Hinglish' | 'Simple' | 'Exam') => {
    setIsAiLoading(true);
    setAiAssistantText(null);
    sounds.playClick();
    try {
      const res = await rewriteContent(
        `${note.title}: ${note.summary}. Key equations: ${note.keyEquations.join('; ')}`,
        mode === 'Hinglish' ? 'Hinglish' : mode === 'Simple' ? 'Analogies' : 'High Yield Exam',
        mode === 'Hinglish' ? 'hi' : 'en'
      );
      setAiAssistantText(res);
    } catch {
      setAiAssistantText('Could not generate AI note right now.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Audio Speech
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Print current notes
  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  // Filtered master notes
  const filteredNotes = MASTER_NOTES.filter(n => {
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen size={16} /> NCERT Class 10 Comprehensive Companion
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            My Smart Science Notebook
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            In-depth chapter micro-notes, high-frequency board traps, interactive numerical solvers, and custom scratchpads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <Printer size={15} /> Print Revision Sheet
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'NOTES', label: 'NCERT Chapter Micro-Notes', icon: FileText, count: MASTER_NOTES.length },
          { id: 'SOLVER', label: 'Interactive Formula Vault', icon: Calculator, count: 'Live Solvers' },
          { id: 'SCRATCHPAD', label: 'My Custom Scratchpad', icon: StickyNote, count: customNotes.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sounds.playClick();
              setActiveTab(tab.id as any);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: NCERT CHAPTER MICRO-NOTES */}
      {/* ========================================================= */}
      {activeTab === 'NOTES' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Chemistry', 'Physics', 'Biology'].map(sub => (
                <button
                  key={sub}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedSubject(sub as any);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubject === sub 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search concepts, equations, traps..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Master Notes Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div 
                key={note.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6">
                  {/* Subject Tag */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      note.subject === 'Chemistry' ? 'bg-purple-100 text-purple-700' :
                      note.subject === 'Physics' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {note.subject} • {note.difficulty}
                    </span>
                    <button 
                      onClick={() => handleSpeak(`${note.title}. ${note.summary}`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Listen"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium mb-3">{note.chapter}</div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {note.summary}
                  </p>

                  {/* High Yield Key Equations Preview */}
                  {note.keyEquations.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 mb-4 font-mono text-[11px] text-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 font-sans uppercase">High Yield Reaction:</div>
                      <div className="line-clamp-2 text-indigo-700 font-semibold">{note.keyEquations[0]}</div>
                    </div>
                  )}

                  {/* Board Trap Alert */}
                  <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-2xl flex items-start gap-2 text-xs text-amber-900">
                    <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight">
                      <strong>Examiner Trap: </strong>{note.boardExamTrap}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-medium italic">{note.mnemonic}</span>
                  <button 
                    onClick={() => {
                      sounds.playClick();
                      setSelectedNote(note);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Open Deep Note <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: INTERACTIVE FORMULA & NUMERICAL SOLVER */}
      {/* ========================================================= */}
      {activeTab === 'SOLVER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Solver 1: Ohm's Law & Electric Power */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  Physics: Electricity
                </span>
                <span className="text-xs text-slate-400 font-mono">V = I × R</span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">Ohm's Law & Power Calculator</h3>
              <p className="text-xs text-slate-500 mb-6">
                Calculate electric current ($I$), resistance ($R$), potential difference ($V$), and power loss in Watts.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Potential Difference (V in Volts):
                  </label>
                  <input 
                    type="number" 
                    value={ohmVoltage}
                    onChange={e => setOhmVoltage(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resistance (R in Ohms Ω):
                  </label>
                  <input 
                    type="number" 
                    value={ohmResistance}
                    onChange={e => setOhmResistance(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button 
                  onClick={calculateOhm}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calculator size={15} /> Compute Current (I) & Power (P)
                </button>
              </div>
            </div>

            <div className="mt-6 bg-slate-900 text-white p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Computed Output:</span>
              <div className="text-lg font-black text-amber-400 font-mono mt-1">{ohmResult}</div>
              <div className="text-[11px] text-slate-400 mt-1">Formula used: I = V / R; P = V × I</div>
            </div>
          </div>

          {/* Solver 2: Spherical Mirror & Lens Solver */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Physics: Ray Optics
                </span>
                <span className="text-xs text-slate-400 font-mono">1/f = 1/v + 1/u</span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">Mirror Formula & Magnification Solver</h3>
              <p className="text-xs text-slate-500 mb-6">
                Calculate image distance ($v$), magnification ($m$), and image nature with standard Cartesian sign convention.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Focal Length f in cm (negative for Concave, positive for Convex):
                  </label>
                  <input 
                    type="number" 
                    value={mirrorF}
                    onChange={e => setMirrorF(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Object Distance u in cm (ALWAYS negative, e.g. -30):
                  </label>
                  <input 
                    type="number" 
                    value={mirrorU}
                    onChange={e => setMirrorU(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button 
                  onClick={calculateMirror}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calculator size={15} /> Solve Image Distance & Nature
                </button>
              </div>
            </div>

            <div className="mt-6 bg-slate-900 text-white p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Computed Image Characteristics:</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-[10px] text-slate-400">Position (v):</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{mirrorResult.v}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Magnification (m):</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{mirrorResult.m}</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-400">Nature: {mirrorResult.nature}</div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: CUSTOM STUDENT SCRATCHPAD */}
      {/* ========================================================= */}
      {activeTab === 'SCRATCHPAD' && (
        <div className="space-y-6">
          {/* New Note Creator */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-indigo-600" /> Create Personal Study Note
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input 
                type="text"
                placeholder="Note title (e.g. Tough numericals in Light)..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="md:col-span-2 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
              >
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="General">General Revision</option>
              </select>
            </div>

            <textarea
              placeholder="Jot down formulas, teachers' tips, personal doubts..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-3"
            />

            <button
              onClick={() => {
                if (!newTitle.trim() || !newContent.trim()) return;
                sounds.playClick();
                const note: CustomNote = {
                  id: Date.now().toString(),
                  title: newTitle,
                  content: newContent,
                  category: newCategory,
                  isPinned: false,
                  date: new Date().toLocaleDateString()
                };
                setCustomNotes([note, ...customNotes]);
                setNewTitle('');
                setNewContent('');
                addXP(15);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Save to Notebook (+15 XP)
            </button>
          </div>

          {/* Saved Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customNotes.map(cn => (
              <div 
                key={cn.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {cn.category}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setCustomNotes(customNotes.filter(n => n.id !== cn.id));
                      }}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-2">{cn.title}</h4>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mb-4">
                    {cn.content}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                  <span>Logged: {cn.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAILED MASTER NOTE MODAL & AI COPILOT */}
      {/* ========================================================= */}
      {selectedNote && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-y-auto border border-slate-200 p-6 md:p-8 animate-[scaleIn_0.2s_ease-out]">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {selectedNote.subject} • {selectedNote.chapter}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedNote.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedNote(null);
                  setAiAssistantText(null);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* In-depth content */}
            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Summary</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedNote.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">High-Yield Board Exam Points</h4>
                <div className="space-y-2">
                  {selectedNote.highYieldPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Balanced Equations</h4>
                <div className="space-y-2">
                  {selectedNote.keyEquations.map((eq, i) => (
                    <div key={i} className="bg-slate-900 text-indigo-300 font-mono text-xs p-3 rounded-xl">
                      {eq}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Study Enhancer Buttons */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-3">
                  <Sparkles size={16} className="text-indigo-600" />
                  AI Study Assistant: Convert this note instantly
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAiAction(selectedNote, 'Hinglish')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Explain in Hinglish
                  </button>
                  <button
                    onClick={() => handleAiAction(selectedNote, 'Simple')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Real-Life Analogy
                  </button>
                  <button
                    onClick={() => handleAiAction(selectedNote, 'Exam')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Examiner Trap Sheet
                  </button>
                </div>

                {isAiLoading && (
                  <div className="mt-3 text-xs text-indigo-600 animate-pulse font-medium">
                    Generating customized study breakdown...
                  </div>
                )}

                {aiAssistantText && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {aiAssistantText}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedNote(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Note
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
