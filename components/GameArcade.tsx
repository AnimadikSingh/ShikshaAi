import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Play, RefreshCw, Zap, Brain, ArrowLeft, Gamepad2, Timer, 
  CheckCircle2, Star, Sparkles, Scale, Lightbulb, Compass, Award, 
  RotateCw, ChevronRight, Volume2, VolumeX, ShieldAlert, Flame,
  Sliders, Eye, ShieldCheck, Target, Layers, ArrowUpRight
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { sounds } from '../services/audioService';

type ArcadeView = 'HUB' | 'BALANCE_BEAM' | 'CIRCUIT_MASTER' | 'ELEMENT_RUSH' | 'OPTICS_MAZE';

// =========================================================================
// GAME 1: REACTION BALANCE BEAM (Chemical Stoichiometric Scale)
// =========================================================================
interface EquationLevel {
  id: number;
  title: string;
  reactants: { formula: string; atoms: { symbol: string; count: number }[]; targetCoeff: number }[];
  products: { formula: string; atoms: { symbol: string; count: number }[]; targetCoeff: number }[];
  explanation: string;
}

const BALANCE_LEVELS: EquationLevel[] = [
  {
    id: 1,
    title: 'Formation of Water',
    reactants: [
      { formula: 'H₂', atoms: [{ symbol: 'H', count: 2 }], targetCoeff: 2 },
      { formula: 'O₂', atoms: [{ symbol: 'O', count: 2 }], targetCoeff: 1 }
    ],
    products: [
      { formula: 'H₂O', atoms: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }], targetCoeff: 2 }
    ],
    explanation: '2H₂ + O₂ ➔ 2H₂O: 4 Hydrogen atoms and 2 Oxygen atoms on both sides (Law of Conservation of Mass).'
  },
  {
    id: 2,
    title: 'Synthesis of Ammonia',
    reactants: [
      { formula: 'N₂', atoms: [{ symbol: 'N', count: 2 }], targetCoeff: 1 },
      { formula: 'H₂', atoms: [{ symbol: 'H', count: 2 }], targetCoeff: 3 }
    ],
    products: [
      { formula: 'NH₃', atoms: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 3 }], targetCoeff: 2 }
    ],
    explanation: 'N₂ + 3H₂ ➔ 2NH₃ (Haber Process): 2 Nitrogen and 6 Hydrogen atoms balanced in equilibrium.'
  },
  {
    id: 3,
    title: 'Combustion of Methane',
    reactants: [
      { formula: 'CH₄', atoms: [{ symbol: 'C', count: 1 }, { symbol: 'H', count: 4 }], targetCoeff: 1 },
      { formula: 'O₂', atoms: [{ symbol: 'O', count: 2 }], targetCoeff: 2 }
    ],
    products: [
      { formula: 'CO₂', atoms: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 2 }], targetCoeff: 1 },
      { formula: 'H₂O', atoms: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }], targetCoeff: 2 }
    ],
    explanation: 'CH₄ + 2O₂ ➔ CO₂ + 2H₂O: Exothermic natural gas combustion with 1 Carbon, 4 Hydrogen, 4 Oxygen.'
  }
];

const BalanceBeamGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = BALANCE_LEVELS[levelIdx];

  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(currentLevel.reactants.map(() => 1));
  const [productCoeffs, setProductCoeffs] = useState<number[]>(currentLevel.products.map(() => 1));
  const [isBalanced, setIsBalanced] = useState(false);

  useEffect(() => {
    setReactantCoeffs(currentLevel.reactants.map(() => 1));
    setProductCoeffs(currentLevel.products.map(() => 1));
    setIsBalanced(false);
  }, [levelIdx]);

  const countAtoms = (side: 'reactants' | 'products') => {
    const counts: Record<string, number> = {};
    if (side === 'reactants') {
      currentLevel.reactants.forEach((species, i) => {
        const coeff = reactantCoeffs[i] || 1;
        species.atoms.forEach(atom => {
          counts[atom.symbol] = (counts[atom.symbol] || 0) + atom.count * coeff;
        });
      });
    } else {
      currentLevel.products.forEach((species, i) => {
        const coeff = productCoeffs[i] || 1;
        species.atoms.forEach(atom => {
          counts[atom.symbol] = (counts[atom.symbol] || 0) + atom.count * coeff;
        });
      });
    }
    return counts;
  };

  const leftCounts = countAtoms('reactants');
  const rightCounts = countAtoms('products');

  const totalLeftAtoms = Object.values(leftCounts).reduce((a, b) => a + b, 0);
  const totalRightAtoms = Object.values(rightCounts).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const allElements = Array.from(new Set([...Object.keys(leftCounts), ...Object.keys(rightCounts)]));
    const balanced = allElements.every(el => (leftCounts[el] || 0) === (rightCounts[el] || 0));

    if (balanced && !isBalanced) {
      setIsBalanced(true);
      sounds.playVictory();
      addXP(30);
    } else if (!balanced && isBalanced) {
      setIsBalanced(false);
    }
  }, [reactantCoeffs, productCoeffs]);

  const tiltDeg = Math.min(10, Math.max(-10, (totalRightAtoms - totalLeftAtoms) * 2));

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Arcade Hub
        </button>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Level {levelIdx + 1} of {BALANCE_LEVELS.length}: {currentLevel.title}
        </span>
      </div>

      {/* Tilting Physical Balance Scale */}
      <div className="relative py-8 flex flex-col items-center">
        <div className="w-16 h-12 bg-slate-800 border-2 border-slate-600 rounded-t-full relative z-10 flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        </div>

        <div 
          className="w-full max-w-xl h-4 bg-gradient-to-r from-amber-500 via-slate-600 to-cyan-500 rounded-full transition-transform duration-500 relative -mt-2 shadow-2xl flex items-center justify-between px-4"
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        >
          {/* Left Pan */}
          <div className="absolute -left-4 top-4 flex flex-col items-center">
            <div className="w-0.5 h-16 bg-slate-400"></div>
            <div className="w-36 h-12 bg-slate-900 border-2 border-amber-400 rounded-b-3xl flex flex-wrap items-center justify-center gap-1 p-1 shadow-lg">
              {Object.entries(leftCounts).map(([el, cnt]) => (
                <span key={el} className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {el}: {cnt}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold text-amber-400 mt-1">Reactants Pan</span>
          </div>

          {/* Right Pan */}
          <div className="absolute -right-4 top-4 flex flex-col items-center">
            <div className="w-0.5 h-16 bg-slate-400"></div>
            <div className="w-36 h-12 bg-slate-900 border-2 border-cyan-400 rounded-b-3xl flex flex-wrap items-center justify-center gap-1 p-1 shadow-lg">
              {Object.entries(rightCounts).map(([el, cnt]) => (
                <span key={el} className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  {el}: {cnt}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold text-cyan-400 mt-1">Products Pan</span>
          </div>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-6 mt-8">
        <div className="flex items-center gap-4">
          {currentLevel.reactants.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    sounds.playClick();
                    const updated = [...reactantCoeffs];
                    updated[i] = Math.min(6, updated[i] + 1);
                    setReactantCoeffs(updated);
                  }}
                  className="w-7 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded-t-lg font-bold text-xs"
                >
                  ▲
                </button>
                <div className="w-7 h-8 bg-amber-500 text-black font-black text-sm flex items-center justify-center">
                  {reactantCoeffs[i]}
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    const updated = [...reactantCoeffs];
                    updated[i] = Math.max(1, updated[i] - 1);
                    setReactantCoeffs(updated);
                  }}
                  className="w-7 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded-b-lg font-bold text-xs"
                >
                  ▼
                </button>
              </div>
              <span className="text-xl font-bold font-mono text-white">{spec.formula}</span>
              {i < currentLevel.reactants.length - 1 && <span className="text-xl text-slate-500 font-bold">+</span>}
            </div>
          ))}
        </div>

        <span className="text-2xl text-cyan-400 font-bold">➔</span>

        <div className="flex items-center gap-4">
          {currentLevel.products.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    sounds.playClick();
                    const updated = [...productCoeffs];
                    updated[i] = Math.min(6, updated[i] + 1);
                    setProductCoeffs(updated);
                  }}
                  className="w-7 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded-t-lg font-bold text-xs"
                >
                  ▲
                </button>
                <div className="w-7 h-8 bg-cyan-500 text-black font-black text-sm flex items-center justify-center">
                  {productCoeffs[i]}
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    const updated = [...productCoeffs];
                    updated[i] = Math.max(1, updated[i] - 1);
                    setProductCoeffs(updated);
                  }}
                  className="w-7 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded-b-lg font-bold text-xs"
                >
                  ▼
                </button>
              </div>
              <span className="text-xl font-bold font-mono text-white">{spec.formula}</span>
              {i < currentLevel.products.length - 1 && <span className="text-xl text-slate-500 font-bold">+</span>}
            </div>
          ))}
        </div>
      </div>

      {isBalanced ? (
        <div className="bg-emerald-950/80 border-2 border-emerald-500 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-[scaleIn_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-2xl text-black">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-400 text-base">Perfect Equilibrium Achieved! ⭐⭐⭐</h4>
              <p className="text-xs text-emerald-200 mt-0.5">{currentLevel.explanation}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              if (levelIdx < BALANCE_LEVELS.length - 1) {
                setLevelIdx(prev => prev + 1);
              } else {
                onBack();
              }
            }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
          >
            {levelIdx < BALANCE_LEVELS.length - 1 ? 'Next Challenge' : 'Complete Quest'} <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="text-center text-xs text-slate-400 font-medium">
          Adjust coefficients until every element's atom count on the Left Pan equals the Right Pan!
        </div>
      )}
    </div>
  );
};

// =========================================================================
// GAME 2: CIRCUIT MASTER (Power Grid Puzzle)
// =========================================================================
const CircuitMasterGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [targetCurrent, setTargetCurrent] = useState(2.0);
  const [selectedBattery, setSelectedBattery] = useState(12);
  const [selectedResistor, setSelectedResistor] = useState(6);
  const [hasSolved, setHasSolved] = useState(false);

  const current = Number((selectedBattery / selectedResistor).toFixed(2));

  const checkCircuit = () => {
    if (Math.abs(current - targetCurrent) < 0.05) {
      setHasSolved(true);
      sounds.playVictory();
      addXP(35);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to Arcade Hub
        </button>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Ohm's Law Substation Challenge
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Mission Directive:</span>
          <h4 className="font-bold text-sm text-white">Power the Central Science Lab</h4>
          <p className="text-xs text-slate-400">Deliver exact target current of <strong className="text-cyan-400">{targetCurrent} A</strong> using Ohm's Law (I = V / R).</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Target Current</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{targetCurrent} A</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">1. Choose DC Power Source (V):</label>
            <div className="grid grid-cols-3 gap-2">
              {[6, 12, 24].map(v => (
                <button
                  key={v}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedBattery(v);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedBattery === v ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md' : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {v} Volts DC
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">2. Choose Load Resistor (R):</label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 12].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedResistor(r);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedResistor === r ? 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-md' : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {r} Ω
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={checkCircuit}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Zap size={16} /> Engage Master Circuit Breaker
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative">
          <div 
            className="w-24 h-24 rounded-full border-2 border-amber-400/50 flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: `rgba(251, 191, 36, ${Math.min(1, current / 3)})`,
              boxShadow: hasSolved ? '0 0 40px rgba(251, 191, 36, 0.9)' : 'none'
            }}
          >
            <Zap size={40} className={hasSolved ? 'text-black' : 'text-slate-500'} />
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Real-Time Amperage:</span>
            <div className="text-3xl font-black text-white font-mono mt-1">{current} A</div>
            <div className="text-xs text-slate-400 mt-1">Formula: I = {selectedBattery}V / {selectedResistor}Ω = {current}A</div>
          </div>
        </div>
      </div>

      {hasSolved && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-4 rounded-2xl flex items-center justify-between animate-[scaleIn_0.2s_ease-out]">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={18} className="text-emerald-400" />
            Grid Online! Safe operating current delivered (+35 XP).
          </div>
          <button onClick={onBack} className="px-4 py-1.5 bg-emerald-500 text-black text-xs font-black rounded-lg">
            Return to Hub
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// GAME 3: ELEMENT SPEED RUSH (Time-Attack Arcade)
// =========================================================================
interface ElementCard {
  name: string;
  symbol: string;
  category: 'METAL' | 'NON_METAL' | 'NOBLE_GAS';
  z: number;
}

const ELEMENT_POOL: ElementCard[] = [
  { name: 'Sodium', symbol: 'Na', category: 'METAL', z: 11 },
  { name: 'Chlorine', symbol: 'Cl', category: 'NON_METAL', z: 17 },
  { name: 'Helium', symbol: 'He', category: 'NOBLE_GAS', z: 2 },
  { name: 'Iron', symbol: 'Fe', category: 'METAL', z: 26 },
  { name: 'Oxygen', symbol: 'O', category: 'NON_METAL', z: 8 },
  { name: 'Neon', symbol: 'Ne', category: 'NOBLE_GAS', z: 10 },
  { name: 'Copper', symbol: 'Cu', category: 'METAL', z: 29 },
  { name: 'Carbon', symbol: 'C', category: 'NON_METAL', z: 6 },
  { name: 'Argon', symbol: 'Ar', category: 'NOBLE_GAS', z: 18 },
  { name: 'Magnesium', symbol: 'Mg', category: 'METAL', z: 12 },
  { name: 'Nitrogen', symbol: 'N', category: 'NON_METAL', z: 7 },
  { name: 'Krypton', symbol: 'Kr', category: 'NOBLE_GAS', z: 36 }
];

const ElementRushGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [cardIdx, setCardIdx] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(1);

  const currentElement = ELEMENT_POOL[cardIdx % ELEMENT_POOL.length];

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      sounds.playVictory();
      addXP(score * 2);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClassify = (cat: 'METAL' | 'NON_METAL' | 'NOBLE_GAS') => {
    if (gameOver) return;
    if (currentElement.category === cat) {
      sounds.playCorrect();
      setScore(prev => prev + 10 * combo);
      setCombo(prev => Math.min(5, prev + 1));
    } else {
      sounds.playWrong();
      setCombo(1);
    }
    setCardIdx(prev => prev + 1);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to Arcade Hub
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-amber-400">⏳ {timeLeft}s remaining</span>
          <span className="text-xs font-mono font-bold text-emerald-400">Score: {score} ({combo}x Combo)</span>
        </div>
      </div>

      {!gameOver ? (
        <div className="flex flex-col items-center py-8">
          <div className="w-40 h-48 bg-slate-900 border-2 border-purple-500 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-4 mb-8 transform hover:scale-105 transition-transform">
            <span className="text-xs font-mono text-purple-300 font-bold mb-1">Z = {currentElement.z}</span>
            <span className="text-4xl font-black text-purple-400 font-mono">{currentElement.symbol}</span>
            <span className="text-sm font-bold text-white mt-2">{currentElement.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <button
              onClick={() => handleClassify('METAL')}
              className="py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-black shadow-lg"
            >
              1. Metal
            </button>
            <button
              onClick={() => handleClassify('NON_METAL')}
              className="py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-black shadow-lg"
            >
              2. Non-Metal
            </button>
            <button
              onClick={() => handleClassify('NOBLE_GAS')}
              className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black shadow-lg"
            >
              3. Noble Gas
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center space-y-4">
          <Trophy size={48} className="mx-auto text-amber-400" />
          <h3 className="text-2xl font-black text-white">Time's Up!</h3>
          <p className="text-sm text-slate-400">Final Arcade Score: <strong className="text-white">{score}</strong> points (+{score * 2} XP)</p>
          <button
            onClick={() => {
              setTimeLeft(30);
              setScore(0);
              setCombo(1);
              setGameOver(false);
            }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// GAME 4: OPTICS RAY MAZE (Reflection & Snell's Law Refraction)
// =========================================================================
const OpticsMazeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [mirrorAngle, setMirrorAngle] = useState(45); // Degrees (Target is 45 to reflect 90 deg into target sensor!)
  const [laserOn, setLaserOn] = useState(true);
  const [solved, setSolved] = useState(false);

  // Target angle is 45 deg (incident at 45 deg -> reflection at 45 deg hits sensor at top)
  const isAligned = Math.abs(mirrorAngle - 45) < 3;

  useEffect(() => {
    if (isAligned && !solved) {
      setSolved(true);
      sounds.playVictory();
      addXP(40);
    }
  }, [mirrorAngle, isAligned, solved]);

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to Arcade Hub
        </button>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          NCERT Ch 10 • Optics Ray Reflection Maze
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Mission Directive:</span>
          <h4 className="font-bold text-sm text-white">Target Sensor Photoelectric Lock</h4>
          <p className="text-xs text-slate-400">
            Rotate the plane mirror so the reflected laser ray (<strong className="text-emerald-400">∠i = ∠r</strong>) hits the photoelectric target sensor at the top.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Current Mirror Angle</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{mirrorAngle}°</div>
        </div>
      </div>

      {/* Optical Bench Canvas */}
      <div className="relative h-72 bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center">
        
        {/* Optical grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        {/* Laser Emitter (Left) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-12 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg border border-red-400">
            <span className="text-[9px] font-mono font-bold text-white">LASER</span>
          </div>
        </div>

        {/* Target Photo-Sensor (Top Center) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className={`w-14 h-8 rounded-lg flex items-center justify-center border transition-all ${
            isAligned ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_20px_#10b981]' : 'bg-slate-800 border-slate-700'
          }`}>
            <span className="text-[9px] font-mono font-bold text-white">
              {isAligned ? 'LOCKED!' : 'SENSOR'}
            </span>
          </div>
          <div className="w-1 h-3 bg-slate-600"></div>
        </div>

        {/* SVG Ray Tracing */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          {/* Incident Ray (from Laser to Center Mirror) */}
          <line x1="60" y1="144" x2="350" y2="144" stroke="#ef4444" strokeWidth="2.5" />
          
          {/* Reflected Ray based on mirror angle */}
          {laserOn && (
            <line 
              x1="350" 
              y1="144" 
              x2={350 + Math.cos(((mirrorAngle * 2 - 90) * Math.PI) / 180) * 220} 
              y2={144 - Math.sin(((mirrorAngle * 2 - 90) * Math.PI) / 180) * 220} 
              stroke={isAligned ? '#10b981' : '#ef4444'} 
              strokeWidth="2.5"
              strokeDasharray={isAligned ? 'none' : '4,4'}
            />
          )}

          {/* Plane Mirror (Rotates in center at (350, 144)) */}
          <g transform={`translate(350, 144) rotate(${mirrorAngle})`}>
            <line x1="0" y1="-45" x2="0" y2="45" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            <line x1="4" y1="-45" x2="4" y2="45" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
          </g>
        </svg>

        {/* Normal Line & Angle readouts */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
          Law of Reflection: <strong className="text-emerald-400">∠i = ∠r = {Math.abs(90 - mirrorAngle)}°</strong>
        </div>
      </div>

      {/* Angle Stepper Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Adjust Mirror Angle:</span>
          {[30, 45, 60, 75].map(deg => (
            <button
              key={deg}
              onClick={() => {
                sounds.playClick();
                setMirrorAngle(deg);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mirrorAngle === deg ? 'bg-emerald-500 text-black shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              sounds.playClick();
              setMirrorAngle(prev => Math.max(15, prev - 5));
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            −5°
          </button>
          <span className="text-xs font-mono font-bold text-emerald-400 px-2">{mirrorAngle}°</span>
          <button 
            onClick={() => {
              sounds.playClick();
              setMirrorAngle(prev => Math.min(85, prev + 5));
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            +5°
          </button>
        </div>
      </div>

      {solved && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-4 rounded-2xl flex items-center justify-between animate-[scaleIn_0.2s_ease-out]">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={18} className="text-emerald-400" />
            Photoelectric Lock Disengaged! Law of Reflection Verified (+40 XP).
          </div>
          <button onClick={onBack} className="px-4 py-1.5 bg-emerald-500 text-black text-xs font-black rounded-lg">
            Return to Hub
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MAIN KNOWLEDGE ARCADE HUB
// =========================================================================
export const GameArcade: React.FC = () => {
  const { digitalTwin } = useStudent();
  const [currentView, setCurrentView] = useState<ArcadeView>('HUB');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CHEMISTRY' | 'PHYSICS' | 'DRILL'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
      
      {currentView === 'HUB' && (
        <>
          {/* Master Arcade Telemetry Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Gamepad2 size={16} /> Interactive STEM Manipulatives & Quests
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                Knowledge Arcade: Interactive Concept Sandbox
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Hands-on stoichiometric balance scales, power grid circuit puzzles, optics ray mazes, and periodic speed challenges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-950/60 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Star size={16} fill="currentColor" /> 22/28 Stars Earned
              </div>
              <div className="bg-indigo-950/60 border border-indigo-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Flame size={16} /> 1.5x XP Boost
              </div>
              <button
                onClick={() => setSoundEnabled(sounds.toggleSound())}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Toggle Sound Effects"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Challenges' },
              { id: 'CHEMISTRY', label: 'Chemistry Manipulatives' },
              { id: 'PHYSICS', label: 'Physics Workbenches' },
              { id: 'DRILL', label: 'Speed Drills' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.id as any);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Game Cards Bento Grid with Interactive Miniature Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Game 1: Reaction Balance Beam */}
            {(selectedCategory === 'ALL' || selectedCategory === 'CHEMISTRY') && (
              <div 
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('BALANCE_BEAM');
                }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                      NCERT Class 10 Ch 1 • Stoichiometric Balancing
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      ★★☆ Standard • +30 XP
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                    Reaction Balance Beam
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Balance chemical reactions on a physical tilting balance scale. Level up as atoms on the reactant and product pans reach perfect equilibrium!
                  </p>

                  {/* Interactive Miniature Scale Preview */}
                  <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-amber-500/50 transition-colors">
                    <div className="w-48 h-2 bg-gradient-to-r from-amber-400 via-slate-600 to-cyan-400 rounded-full group-hover:rotate-3 transition-transform duration-300 flex justify-between px-2 items-center">
                      <div className="w-5 h-4 bg-amber-500 rounded-sm -mt-2 shadow-sm"></div>
                      <div className="w-5 h-4 bg-cyan-500 rounded-sm -mt-2 shadow-sm"></div>
                    </div>
                    <div className="w-6 h-5 bg-slate-800 rounded-t-lg mt-1 border border-slate-700"></div>
                    <span className="text-[10px] text-slate-400 font-mono mt-2">
                      2H₂ + O₂ ➔ 2H₂O (Conservation of Mass)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-amber-600">
                  <span className="flex items-center gap-1.5">
                    <Play size={14} fill="currentColor" /> Launch Manipulative
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Game 2: Circuit Master */}
            {(selectedCategory === 'ALL' || selectedCategory === 'PHYSICS') && (
              <div 
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('CIRCUIT_MASTER');
                }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
                      NCERT Class 10 Ch 12 • Electricity & Ohm's Law
                    </span>
                    <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                      ★★★ Advanced • +35 XP
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 group-hover:text-cyan-600 transition-colors">
                    Circuit Master: Power the Grid
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Calculate battery voltage and resistor load using Ohm's Law (V = IR) to deliver exact target amperes without blowing the fuse.
                  </p>

                  {/* Interactive Miniature Circuit Preview */}
                  <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between px-6 group-hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                        12V
                      </div>
                      <div className="w-12 h-0.5 bg-cyan-400 border-b border-dashed border-cyan-300 animate-pulse"></div>
                      <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-300 font-mono text-xs font-bold">
                        6Ω
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-[10px] text-slate-400">DELIVERED</div>
                      <div className="text-base font-black text-emerald-400">2.00 A</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-cyan-600">
                  <span className="flex items-center gap-1.5">
                    <Play size={14} fill="currentColor" /> Launch Circuit Workbench
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Game 3: Optics Ray Maze */}
            {(selectedCategory === 'ALL' || selectedCategory === 'PHYSICS') && (
              <div 
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('OPTICS_MAZE');
                }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      NCERT Class 10 Ch 10 • Reflection & Snell's Law
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ★★★ Spatial Mechanics • +40 XP
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Optics Ray & Reflection Maze
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Rotate plane and spherical optical mirrors to guide an incoming laser beam onto target photoelectric sensors using angle laws (∠i = ∠r).
                  </p>

                  {/* Interactive Miniature Ray Preview */}
                  <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                    <div className="w-full h-10 flex items-center justify-around">
                      <span className="text-[10px] text-red-400 font-mono font-bold">LASER ➔</span>
                      <div className="w-1 h-8 bg-cyan-400 rotate-45 rounded-full shadow-[0_0_8px_#38bdf8]"></div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">➔ SENSOR [45°]</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <Play size={14} fill="currentColor" /> Launch Optics Maze
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Game 4: Elemental Speed Rush */}
            {(selectedCategory === 'ALL' || selectedCategory === 'DRILL' || selectedCategory === 'CHEMISTRY') && (
              <div 
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('ELEMENT_RUSH');
                }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      NCERT Class 10 Ch 5 • Periodic Classification
                    </span>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      ★★☆ Speed Drill • +25 XP
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 group-hover:text-purple-600 transition-colors">
                    Elemental Speed Rush
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Fast-paced periodic table sorting drill! Classify metals, non-metals, and noble gases under 30 seconds for combo streaks and multiplier bonuses.
                  </p>

                  {/* Interactive Periodic Card Preview */}
                  <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around group-hover:border-purple-500/50 transition-colors">
                    <div className="w-12 h-14 bg-amber-950/70 border border-amber-500/50 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[8px] text-amber-300 font-mono">11</span>
                      <span className="text-sm font-black text-amber-400 font-mono">Na</span>
                    </div>
                    <div className="w-12 h-14 bg-cyan-950/70 border border-cyan-500/50 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[8px] text-cyan-300 font-mono">17</span>
                      <span className="text-sm font-black text-cyan-400 font-mono">Cl</span>
                    </div>
                    <div className="w-12 h-14 bg-purple-950/70 border border-purple-500/50 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[8px] text-purple-300 font-mono">10</span>
                      <span className="text-sm font-black text-purple-400 font-mono">Ne</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-purple-600">
                  <span className="flex items-center gap-1.5">
                    <Play size={14} fill="currentColor" /> Launch Speed Drill
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {currentView === 'BALANCE_BEAM' && <BalanceBeamGame onBack={() => setCurrentView('HUB')} />}
      {currentView === 'CIRCUIT_MASTER' && <CircuitMasterGame onBack={() => setCurrentView('HUB')} />}
      {currentView === 'ELEMENT_RUSH' && <ElementRushGame onBack={() => setCurrentView('HUB')} />}
      {currentView === 'OPTICS_MAZE' && <OpticsMazeGame onBack={() => setCurrentView('HUB')} />}

    </div>
  );
};
