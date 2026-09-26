import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { 
  ArrowLeft, ArrowRight, RotateCw, Filter, Layers, Brain, Zap, Atom, Dna, 
  HelpCircle, Volume2, Sparkles, CheckCircle2, Bookmark, Award, AlertCircle, Lightbulb
} from 'lucide-react';
import { sounds } from '../services/audioService';

interface DetailedFlashcard {
  id: string;
  category: 'Chemistry' | 'Physics' | 'Biology';
  chapter: string;
  front: string;
  back: string;
  formulaOrReaction?: string;
  mnemonic?: string;
  examTip?: string;
  hint: string;
  box: 1 | 2 | 3; // 1: Learning, 2: Review, 3: Mastered
}

const EXTENDED_FLASHCARDS: DetailedFlashcard[] = [
  {
    id: 'fc_01',
    category: 'Chemistry',
    chapter: 'Chemical Reactions & Equations',
    front: 'Why should a magnesium ribbon be cleaned before burning in air?',
    back: 'Magnesium is a reactive metal. When exposed to air, it forms a protective passivation layer of basic magnesium carbonate / oxide [2Mg + O₂ → 2MgO] on its surface. Cleaning with sandpaper exposes fresh, pure magnesium metal so it can ignite smoothly with a dazzling white flame.',
    formulaOrReaction: '2Mg (s) + O₂ (g) ➔ 2MgO (s) + Light',
    mnemonic: 'Clean Sandpaper = Clean Sparkle',
    examTip: 'Examiners award marks specifically for mentioning the protective oxide/carbonate layer.',
    hint: 'Think about what forms on the metal surface after sitting on a shelf.',
    box: 1
  },
  {
    id: 'fc_02',
    category: 'Chemistry',
    chapter: 'Acids, Bases & Salts',
    front: 'Why does dry HCl gas not change the color of dry blue litmus paper?',
    back: 'Acids exhibit acidic behavior exclusively in the presence of water, because hydrogen ions (H⁺) dissociate only in aqueous medium to form hydronium ions (H₃O⁺). In completely dry conditions, no H⁺/H₃O⁺ ions exist, so no color change occurs.',
    formulaOrReaction: 'HCl + H₂O ➔ H₃O⁺ + Cl⁻ (No water = No H⁺ ions)',
    mnemonic: 'No H₂O = No H⁺ Glow',
    examTip: 'Common 2-mark CBSE question: Always highlight the role of water in ionizing acids.',
    hint: 'Does acid ionization require moisture?',
    box: 1
  },
  {
    id: 'fc_03',
    category: 'Chemistry',
    chapter: 'Chemical Reactions & Equations',
    front: 'What is a Redox reaction? Identify oxidation and reduction in the reaction of CuO with H₂.',
    back: 'A Redox reaction involves simultaneous oxidation (loss of electrons / gain of oxygen) and reduction (gain of electrons / loss of oxygen). In CuO + H₂ → Cu + H₂O: Copper oxide loses oxygen and is REDUCED to Cu; Hydrogen gains oxygen and is OXIDIZED to H₂O.',
    formulaOrReaction: 'CuO + H₂ ➔ Cu + H₂O (CuO: Oxidizing Agent; H₂: Reducing Agent)',
    mnemonic: 'OIL RIG (Oxidation Is Loss, Reduction Is Gain)',
    examTip: 'Always identify both the substance oxidized/reduced AND the oxidizing/reducing agents.',
    hint: 'Which compound loses oxygen and which gains it?',
    box: 2
  },
  {
    id: 'fc_04',
    category: 'Physics',
    chapter: 'Electricity',
    front: 'State Ohm\'s Law and its mathematical formula. What is the slope of a V-I graph?',
    back: 'Ohm\'s Law states that electric current flowing through a metallic conductor is directly proportional to the potential difference (voltage) across its ends, provided physical conditions (temperature) remain constant. Formula: V = I × R. The slope of a V vs I graph (ΔV / ΔI) represents Electrical Resistance (R).',
    formulaOrReaction: 'V = I × R ⟹ R = V / I (Unit: Ohm Ω)',
    mnemonic: 'VIR: V at the top of the pyramid',
    examTip: 'Always include the condition: "at constant temperature". Leaving this out loses 0.5 marks.',
    hint: 'How are potential difference and current related when temperature is fixed?',
    box: 1
  },
  {
    id: 'fc_05',
    category: 'Physics',
    chapter: 'Light - Reflection & Refraction',
    front: 'Why are convex mirrors preferred as rear-view mirrors in vehicles?',
    back: '1. They always form an erect (upright) and diminished (smaller) image, regardless of object distance.\n2. They bulge outwards, giving them a much wider field of view than a plane mirror, allowing the driver to see a larger area of traffic behind them.',
    formulaOrReaction: 'Focal length f > 0; Magnification m < 1 (always positive and erect)',
    mnemonic: 'Convex = Curving Outward for Wider Traffic View',
    examTip: 'Mention both "erect image" and "wider field of view" to get full marks.',
    hint: 'Consider the image orientation and field of view.',
    box: 2
  },
  {
    id: 'fc_06',
    category: 'Physics',
    chapter: 'Electricity',
    front: 'State Joule\'s Law of Heating and write its 3 mathematical expressions.',
    back: 'The heat produced in a resistor is directly proportional to:\n1. The square of current for a given resistance (I²)\n2. The resistance for a given current (R)\n3. The time for which current flows (t).\nHeat H = I²Rt = VIt = (V² / R)t.',
    formulaOrReaction: 'H = I²Rt Joules',
    mnemonic: 'High Current = Exponential Heat (I squared!)',
    examTip: 'Pay attention to whether questions specify "series" (use I²Rt) or "parallel" (use V²t/R).',
    hint: 'How does heat depend on current, resistance, and time?',
    box: 3
  },
  {
    id: 'fc_07',
    category: 'Biology',
    chapter: 'Life Processes',
    front: 'Why is the small intestine in herbivores longer than in carnivores?',
    back: 'Herbivores eat grass and plant matter rich in cellulose, which is tough and requires complex, prolonged microbial fermentation to digest. Carnivores eat meat which is rich in proteins and much easier to digest, requiring a shorter intestinal tract.',
    formulaOrReaction: 'Cellulose ➔ Requires long transit time & cellulase enzymes',
    mnemonic: 'Herbivores = Hard Cellulose = Long Journey',
    examTip: 'High-frequency 2-mark CBSE biology question.',
    hint: 'Compare the digestibility of cellulose vs meat.',
    box: 2
  },
  {
    id: 'fc_08',
    category: 'Biology',
    chapter: 'Life Processes',
    front: 'What is the role of hydrochloric acid (HCl) in the human stomach?',
    back: '1. Creates an acidic medium (pH ~1.5 to 2.0) necessary to activate inactive pepsinogen into active enzyme Pepsin.\n2. Kills harmful ingested bacteria and microorganisms present in food.\n3. Mucus lining protects the stomach wall from being digested by this strong acid.',
    formulaOrReaction: 'Pepsinogen (inactive) + HCl ➔ Pepsin (active protein-digesting enzyme)',
    mnemonic: 'HCl = Kills Germs & Wakes Pepsin',
    examTip: 'Never say "HCl digests food". HCl only creates the acidic pH to activate pepsin.',
    hint: 'Does it digest protein directly, or activate something else?',
    box: 3
  }
];

export const FlashcardsView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { digitalTwin, addXP } = useStudent();
  const [cards, setCards] = useState<DetailedFlashcard[]>(EXTENDED_FLASHCARDS);
  const [filterSubject, setFilterSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('All');
  const [filterBox, setFilterBox] = useState<'All' | 1 | 2 | 3>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  // Filter cards
  const filteredCards = cards.filter(card => {
    if (filterSubject !== 'All' && card.category !== filterSubject) return false;
    if (filterBox !== 'All' && card.box !== filterBox) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex];

  // Reset index on filter change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [filterSubject, filterBox]);

  // Keyboard navigation & flip support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        sounds.playClick();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (isFlipped) {
        if (e.key === '1') handleRate('AGAIN');
        if (e.key === '2') handleRate('HARD');
        if (e.key === '3') handleRate('GOOD');
        if (e.key === '4') handleRate('EASY');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, filteredCards]);

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      sounds.playClick();
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sounds.playClick();
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Spaced repetition review rating
  const handleRate = (rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') => {
    if (!currentCard) return;
    setReviewedToday(prev => prev + 1);

    let newBox: 1 | 2 | 3 = currentCard.box;
    let xpGain = 5;

    if (rating === 'AGAIN') {
      newBox = 1;
      sounds.playWrong();
    } else if (rating === 'HARD') {
      newBox = Math.max(1, currentCard.box) as 1 | 2 | 3;
      sounds.playClick();
      xpGain = 8;
    } else if (rating === 'GOOD') {
      newBox = Math.min(3, currentCard.box + 1) as 1 | 2 | 3;
      sounds.playCorrect();
      xpGain = 12;
    } else if (rating === 'EASY') {
      newBox = 3;
      sounds.playVictory();
      xpGain = 20;
    }

    addXP(xpGain);

    // Update state
    setCards(prev => prev.map(c => c.id === currentCard.id ? { ...c, box: newBox } : c));

    // Move to next card
    if (currentIndex < filteredCards.length - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  // Audio Read Aloud
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const masteredCount = cards.filter(c => c.box === 3).length;
  const reviewCount = cards.filter(c => c.box === 2).length;
  const learningCount = cards.filter(c => c.box === 1).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Top Header matching Screen 6 in media_1790433716001.jpg */}
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
            <h2 className="text-xl font-extrabold text-slate-900">Scientific Flashcards</h2>
            <p className="text-xs text-slate-400">Quickly revise key concepts with spaced repetition.</p>
          </div>
        </div>
      </div>

      {/* Mode Tabs matching Screen 6: All | Chemistry (Active) | Physics | Biology | Spaced Repetition ▾ */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {['All', 'Chemistry', 'Physics', 'Biology'].map(sub => {
            const isSelected = (sub === 'Chemistry' && filterSubject === 'Chemistry') || (sub === 'All' && filterSubject === 'All');
            return (
              <button
                key={sub}
                onClick={() => {
                  sounds.playClick();
                  setFilterSubject(sub as any);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected 
                    ? 'bg-[#0f172a] text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
          <span>Spaced Repetition</span>
          <span className="text-slate-400">▾</span>
        </div>
      </div>

      {/* Main 3D Flip Flashcard */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="[perspective:1200px] min-h-[440px] w-full relative">
          <div 
            onClick={() => {
              sounds.playClick();
              setIsFlipped(!isFlipped);
            }}
            className={`w-full min-h-[440px] transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer relative rounded-3xl ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* FRONT SIDE (Question / Prompt) */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8 flex flex-col justify-between hover:border-indigo-300 transition-all">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    currentCard.category === 'Chemistry' ? 'bg-purple-100 text-purple-700' :
                    currentCard.category === 'Physics' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentCard.category} • {currentCard.chapter}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    Box {currentCard.box}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.front);
                  }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Listen to question"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              {/* Question Center */}
              <div className="my-6 text-center max-w-xl mx-auto">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                  {currentCard.front}
                </h3>

                {/* Hint toggle */}
                {showHint ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center justify-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                    <Lightbulb size={16} className="text-amber-600 shrink-0" />
                    <span><strong>Hint: </strong>{currentCard.hint}</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      setShowHint(true);
                    }}
                    className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                  >
                    <Lightbulb size={14} /> Need a Hint?
                  </button>
                )}
              </div>

              {/* Footer Tip */}
              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
                <span>Press <strong>Space</strong> or tap to flip</span>
                <span className="font-mono font-bold text-slate-500">
                  {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>
            </div>

            {/* BACK SIDE (Detailed Answer & Mnemonic) */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900 rounded-3xl shadow-xl border-2 border-slate-700 p-8 flex flex-col justify-between text-white">
              {/* Header */}
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Detailed NCERT Solution
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.back);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  title="Listen to explanation"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="my-4 space-y-3 overflow-y-auto max-h-[260px] pr-1">
                <p className="text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </p>

                {currentCard.formulaOrReaction && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-cyan-300 font-mono text-xs">
                    {currentCard.formulaOrReaction}
                  </div>
                )}

                {currentCard.examTip && (
                  <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Exam Secret: </strong>{currentCard.examTip}</span>
                  </div>
                )}
              </div>

              {/* Mnemonic Badge */}
              {currentCard.mnemonic && (
                <div className="text-[11px] text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-center">
                  💡 <strong>Memory Mnemonic: </strong>{currentCard.mnemonic}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          <Layers size={40} className="mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-base text-slate-700">No cards in this filter</h4>
          <button 
            onClick={() => {
              setFilterSubject('All');
              setFilterBox('All');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Spaced Repetition Rating Buttons (Visible when flipped) */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-4 animate-[fadeIn_0.3s_ease-out]">
          <button
            onClick={() => handleRate('AGAIN')}
            className="p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 hover:border-rose-300 rounded-2xl text-center text-rose-700 transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1 group"
          >
            <div className="text-sm font-black flex items-center gap-1.5">
              <span>✕</span> I Forgot
            </div>
            <div className="text-[11px] text-rose-500 font-medium">Reset to Box 1 • Review soon</div>
          </button>
          
          <button
            onClick={() => handleRate('HARD')}
            className="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-300 rounded-2xl text-center text-amber-800 transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1 group"
          >
            <div className="text-sm font-black flex items-center gap-1.5">
              <span>⚡</span> Partially Correct
            </div>
            <div className="text-[11px] text-amber-600 font-medium">Keep in Box 2 • Review tomorrow</div>
          </button>

          <button
            onClick={() => handleRate('EASY')}
            className="p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl text-center text-emerald-800 transition-all hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center gap-1 group"
          >
            <div className="text-sm font-black flex items-center gap-1.5">
              <span>✓</span> I Knew It!
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">Move to Box 3 • +20 XP</div>
          </button>
        </div>
      )}

      {/* Navigation Arrow Controls */}
      <div className="flex justify-center items-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
          title="Previous Card"
        >
          <ArrowLeft size={20} />
        </button>

        <span className="text-xs font-bold text-slate-500 font-mono">
          Card {currentIndex + 1} / {filteredCards.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex >= filteredCards.length - 1}
          className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
          title="Next Card"
        >
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};
