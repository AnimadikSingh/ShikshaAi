import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, Share2, Layers, BookOpen, CheckCircle2, 
  Clock, ArrowRight, Zap, Atom, Dna, Search, Sparkles, X, 
  ExternalLink, Trophy, Flame, ChevronRight, HelpCircle,
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Filter, Eye,
  Compass, ShieldCheck, ChevronDown
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { sounds } from '../services/audioService';

export interface WebNode {
  id: string;
  label: string;
  chapter: string;
  subject: 'Chemistry' | 'Physics' | 'Biology' | 'Central';
  tier: 0 | 1 | 2; // 0 = Central Hub, 1 = Major Chapter Domain, 2 = Core Mechanism Subtopic
  parentId?: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  summary: string;
  boardMarks?: string;
  prereqs: string[];
  unlocks: string[];
  keyQuestion?: string;
  collapsed?: boolean;
}

export interface WebEdge {
  id: string;
  source: string;
  target: string;
  type: 'hierarchy' | 'dependency' | 'bridge';
  label?: string;
}

// -------------------------------------------------------------
// COMPREHENSIVE CBSE CLASS 10 SCIENCE KNOWLEDGE NETWORK
// -------------------------------------------------------------
const BASE_NODES: WebNode[] = [
  // TIER 0: CENTRAL CORE
  {
    id: 'central_core',
    label: 'CBSE Class 10 Science Core',
    chapter: 'NCERT Curriculum',
    subject: 'Central',
    tier: 0,
    x: 0,
    y: 0,
    summary: 'The unified conceptual foundation integrating Chemical Dynamics, Physical Laws of the Universe, and Biological Living Systems.',
    prereqs: ['Class 9 Science Foundation'],
    unlocks: ['Class 11 Science Streams (PCM / PCB)']
  },

  // TIER 1: CHEMISTRY CHAPTER DOMAINS
  {
    id: 'ch_chem_rxn',
    label: 'Chemical Reactions & Equations',
    chapter: 'NCERT Ch 1',
    subject: 'Chemistry',
    tier: 1,
    parentId: 'central_core',
    x: -360,
    y: -220,
    summary: 'Mastering chemical transformations, balancing stoichiometric equations, types of reactions, and redox kinetics.',
    boardMarks: '4-5 Marks',
    prereqs: ['Valency & Atomic Mass (Class 9)'],
    unlocks: ['Acids, Bases & Salts', 'Metals & Non-Metals'],
    keyQuestion: 'Why must chemical equations be balanced according to the Law of Conservation of Mass?'
  },
  {
    id: 'ch_acids_bases',
    label: 'Acids, Bases & Salts',
    chapter: 'NCERT Ch 2',
    subject: 'Chemistry',
    tier: 1,
    parentId: 'central_core',
    x: -440,
    y: -40,
    summary: 'H⁺ vs OH⁻ proton donor-acceptor chemistry, universal pH scale (0-14), indicators, and industrial salts.',
    boardMarks: '5-6 Marks',
    prereqs: ['Chemical Reactions & Equations'],
    unlocks: ['Carbon & Its Compounds', 'Biological Digestion'],
    keyQuestion: 'Why does dry HCl gas not turn dry litmus paper blue, but moist litmus changes red?'
  },
  {
    id: 'ch_metals',
    label: 'Metals & Non-Metals',
    chapter: 'NCERT Ch 3',
    subject: 'Chemistry',
    tier: 1,
    parentId: 'central_core',
    x: -380,
    y: 160,
    summary: 'Reactivity series, ionic crystal lattice bonding, metallurgical extraction, and prevention of corrosion.',
    boardMarks: '5-6 Marks',
    prereqs: ['Chemical Reactions'],
    unlocks: ['Carbon Compounds', 'Electric Conductivity'],
    keyQuestion: 'Why do ionic compounds have high melting and boiling points?'
  },
  {
    id: 'ch_carbon',
    label: 'Carbon & Its Compounds',
    chapter: 'NCERT Ch 4',
    subject: 'Chemistry',
    tier: 1,
    parentId: 'central_core',
    x: -240,
    y: 280,
    summary: 'Tetravalency, catenation, covalent bonding, homologous hydrocarbon series, and functional groups.',
    boardMarks: '6-7 Marks',
    prereqs: ['Covalent Bonding Basics'],
    unlocks: ['Senior Organic Chemistry'],
    keyQuestion: 'Why cannot carbon form C⁴⁺ cation or C⁴⁻ anion?'
  },
  {
    id: 'ch_periodic',
    label: 'Periodic Classification',
    chapter: 'NCERT Ch 5',
    subject: 'Chemistry',
    tier: 1,
    parentId: 'central_core',
    x: -120,
    y: -320,
    summary: 'Mendeleev vs Modern Periodic Table: periodic properties governed by atomic number (Z).',
    boardMarks: '4 Marks',
    prereqs: ['Electronic Configuration'],
    unlocks: ['Atomic Structure (Class 11)'],
    keyQuestion: 'How does atomic radius vary across a period and down a group?'
  },

  // TIER 1: PHYSICS CHAPTER DOMAINS
  {
    id: 'ch_light',
    label: 'Light: Reflection & Refraction',
    chapter: 'NCERT Ch 10',
    subject: 'Physics',
    tier: 1,
    parentId: 'central_core',
    x: 360,
    y: -220,
    summary: 'Ray optics, spherical concave and convex mirrors, Snell\'s Law, and lens magnification formulas.',
    boardMarks: '7-8 Marks',
    prereqs: ['Rectilinear Propagation of Light'],
    unlocks: ['Human Eye & Vision', 'Optical Instruments'],
    keyQuestion: 'Derive the mirror formula 1/f = 1/v + 1/u using Cartesian sign conventions.'
  },
  {
    id: 'ch_human_eye',
    label: 'Human Eye & Colorful World',
    chapter: 'NCERT Ch 11',
    subject: 'Physics',
    tier: 1,
    parentId: 'central_core',
    x: 440,
    y: -40,
    summary: 'Anatomy of crystalline lens, optical defects (Myopia & Hypermetropia), and atmospheric dispersion/scattering.',
    boardMarks: '5-6 Marks',
    prereqs: ['Light: Refraction'],
    unlocks: ['Wave Optics'],
    keyQuestion: 'Why does the sky appear deep blue at noon and reddish during sunrise and sunset?'
  },
  {
    id: 'ch_electricity',
    label: 'Electricity & Circuits',
    chapter: 'NCERT Ch 12',
    subject: 'Physics',
    tier: 1,
    parentId: 'central_core',
    x: 380,
    y: 160,
    summary: 'Electric potential, Ohm\'s Law (V = IR), resistivity (R = ρL/A), series-parallel networks, and Joule heating.',
    boardMarks: '7-8 Marks',
    prereqs: ['Electric Charge & Potential'],
    unlocks: ['Magnetic Effects', 'Electrochemical Cells'],
    keyQuestion: 'Compare equivalent resistance in series vs parallel circuits and explain why household wiring uses parallel.'
  },
  {
    id: 'ch_magnetism',
    label: 'Magnetic Effects of Current',
    chapter: 'NCERT Ch 13',
    subject: 'Physics',
    tier: 1,
    parentId: 'central_core',
    x: 240,
    y: 280,
    summary: 'Oersted discovery, solenoids, Fleming\'s Left-Hand Rule for electric motors, and domestic circuits.',
    boardMarks: '5-6 Marks',
    prereqs: ['Electricity & Circuits'],
    unlocks: ['Electromagnetism'],
    keyQuestion: 'State Fleming\'s Left Hand Rule and identify the role of split rings in a DC motor.'
  },

  // TIER 1: BIOLOGY CHAPTER DOMAINS
  {
    id: 'ch_life_processes',
    label: 'Life Processes (Nutrition & Respiration)',
    chapter: 'NCERT Ch 6',
    subject: 'Biology',
    tier: 1,
    parentId: 'central_core',
    x: -80,
    y: 380,
    summary: 'Four physiological pillars: Autotrophic/heterotrophic nutrition, cellular respiration, circulatory double pump, and nephron excretion.',
    boardMarks: '8-9 Marks',
    prereqs: ['Cell Structure & Mitochondria'],
    unlocks: ['Control & Coordination', 'Human Reproduction'],
    keyQuestion: 'Explain the mechanism of double circulation in human heart and why it is necessary.'
  },
  {
    id: 'ch_control',
    label: 'Control & Coordination',
    chapter: 'NCERT Ch 7',
    subject: 'Biology',
    tier: 1,
    parentId: 'central_core',
    x: 80,
    y: 380,
    summary: 'Neuron electrical signaling, chemical synapse, spinal reflex arc, human brain lobes, and plant phytohormones.',
    boardMarks: '5-6 Marks',
    prereqs: ['Life Processes'],
    unlocks: ['Heredity & Genetics'],
    keyQuestion: 'What constitutes a Reflex Arc? Trace the impulse pathway from stimulus to effector muscle.'
  },
  {
    id: 'ch_reproduction',
    label: 'How do Organisms Reproduce',
    chapter: 'NCERT Ch 8',
    subject: 'Biology',
    tier: 1,
    parentId: 'central_core',
    x: 0,
    y: -360,
    summary: 'Asexual cloning modes, floral double fertilization, male/female human reproductive systems, and contraception.',
    boardMarks: '6-7 Marks',
    prereqs: ['Cell Division & Mitosis'],
    unlocks: ['Heredity & Evolution'],
    keyQuestion: 'Why is vegetative propagation practiced for growing certain types of plants like bananas and rose?'
  },
  {
    id: 'ch_heredity',
    label: 'Heredity & Evolution',
    chapter: 'NCERT Ch 9',
    subject: 'Biology',
    tier: 1,
    parentId: 'central_core',
    x: 180,
    y: -330,
    summary: 'Mendelian monohybrid 3:1 ratio, dihybrid inheritance, XX/XY chromosomal sex determination, and homologous organs.',
    boardMarks: '5-6 Marks',
    prereqs: ['Reproduction & DNA'],
    unlocks: ['Genetics & Biotechnology'],
    keyQuestion: 'Demonstrate with a cross how sex is determined by the sperm in human beings.'
  },

  // TIER 2: SUBTOPICS & MECHANISMS (CHEMISTRY)
  {
    id: 'sub_balancing',
    label: 'Stoichiometric Balancing',
    chapter: 'NCERT Ch 1.1',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_chem_rxn',
    x: -470,
    y: -290,
    summary: 'Equating atom counts on LHS and RHS to uphold mass conservation.',
    prereqs: ['Atomic Mass'],
    unlocks: ['Reaction Types']
  },
  {
    id: 'sub_redox',
    label: 'Redox & Oxidation States',
    chapter: 'NCERT Ch 1.2',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_chem_rxn',
    x: -330,
    y: -310,
    summary: 'Gain of oxygen / loss of hydrogen vs electron transfer.',
    prereqs: ['Chemical Equations'],
    unlocks: ['Corrosion Prevention']
  },
  {
    id: 'sub_ph_scale',
    label: 'Universal pH Scale (0-14)',
    chapter: 'NCERT Ch 2.2',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_acids_bases',
    x: -580,
    y: -80,
    summary: 'Negative log of hydronium ion concentration [H₃O⁺].',
    prereqs: ['Acids & Bases'],
    unlocks: ['Antacid Chemistry', 'Soil pH']
  },
  {
    id: 'sub_neutralization',
    label: 'Neutralization & Salt Prep',
    chapter: 'NCERT Ch 2.3',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_acids_bases',
    x: -560,
    y: 40,
    summary: 'Acid + Base ➔ Salt + Water with exothermic heat release.',
    prereqs: ['pH Scale'],
    unlocks: ['Bleaching Powder', 'POP']
  },
  {
    id: 'sub_reactivity_series',
    label: 'Metal Reactivity Series',
    chapter: 'NCERT Ch 3.2',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_metals',
    x: -510,
    y: 190,
    summary: 'K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.',
    prereqs: ['Chemical Displacement'],
    unlocks: ['Smelting & Electrolysis']
  },
  {
    id: 'sub_catenation',
    label: 'Catenation & Covalent Tetravalency',
    chapter: 'NCERT Ch 4.1',
    subject: 'Chemistry',
    tier: 2,
    parentId: 'ch_carbon',
    x: -320,
    y: 390,
    summary: 'Self-linking ability of carbon forming long chains, branched structures, and rings.',
    prereqs: ['Valency'],
    unlocks: ['Hydrocarbon Isomerism']
  },

  // TIER 2: SUBTOPICS & MECHANISMS (PHYSICS)
  {
    id: 'sub_mirror_formula',
    label: 'Mirror Formula & Ray Tracing',
    chapter: 'NCERT Ch 10.2',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_light',
    x: 470,
    y: -290,
    summary: '1/f = 1/v + 1/u and magnification m = -v/u.',
    prereqs: ['Reflection Laws'],
    unlocks: ['Optical Lenses']
  },
  {
    id: 'sub_snells_law',
    label: 'Snell\'s Law of Refraction',
    chapter: 'NCERT Ch 10.3',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_light',
    x: 340,
    y: -310,
    summary: 'sin(i) / sin(r) = n₂ / n₁ (constant refractive index).',
    prereqs: ['Light Speed in Media'],
    unlocks: ['Prism Dispersion']
  },
  {
    id: 'sub_myopia',
    label: 'Eye Defects & Lens Correction',
    chapter: 'NCERT Ch 11.2',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_human_eye',
    x: 580,
    y: -80,
    summary: 'Correcting Myopia (elongated eyeball) with concave spectacles; Hypermetropia with convex.',
    prereqs: ['Lenses Formula'],
    unlocks: ['Retinal Optics']
  },
  {
    id: 'sub_ohms_law',
    label: 'Ohm\'s Law Verification (V = IR)',
    chapter: 'NCERT Ch 12.2',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_electricity',
    x: 530,
    y: 190,
    summary: 'Current is directly proportional to potential difference under constant temperature.',
    prereqs: ['Electric Potential'],
    unlocks: ['Resistivity Analysis']
  },
  {
    id: 'sub_joule_heating',
    label: 'Joule\'s Heating Law (H = I²Rt)',
    chapter: 'NCERT Ch 12.5',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_electricity',
    x: 450,
    y: 280,
    summary: 'Heat dissipated in resistor wire; electric fuse and tungsten lamps.',
    prereqs: ['Ohm\'s Law'],
    unlocks: ['Power Grid Rating']
  },
  {
    id: 'sub_fleming_rule',
    label: 'Fleming\'s Left-Hand Rule',
    chapter: 'NCERT Ch 13.3',
    subject: 'Physics',
    tier: 2,
    parentId: 'ch_magnetism',
    x: 320,
    y: 390,
    summary: 'Thumb: Force/Motion, Forefinger: Magnetic Field, Middle finger: Current direction.',
    prereqs: ['Magnetic Field Lines'],
    unlocks: ['DC Electric Motors']
  },

  // TIER 2: SUBTOPICS & MECHANISMS (BIOLOGY)
  {
    id: 'sub_photosynthesis',
    label: 'Photosynthesis & Stomata',
    chapter: 'NCERT Ch 6.2',
    subject: 'Biology',
    tier: 2,
    parentId: 'ch_life_processes',
    x: -160,
    y: 470,
    summary: 'Light and dark reactions: 6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ + 6O₂.',
    prereqs: ['Chloroplast Anatomy'],
    unlocks: ['Cellular Respiration']
  },
  {
    id: 'sub_circulation',
    label: 'Double Circulation & Nephron',
    chapter: 'NCERT Ch 6.4',
    subject: 'Biology',
    tier: 2,
    parentId: 'ch_life_processes',
    x: -20,
    y: 490,
    summary: 'Systemic vs pulmonary circulation; Bowman\'s capsule selective ultrafiltration.',
    prereqs: ['Human Anatomy'],
    unlocks: ['Osmoregulation']
  },
  {
    id: 'sub_reflex_arc',
    label: 'Reflex Arc & Synaptic Gap',
    chapter: 'NCERT Ch 7.2',
    subject: 'Biology',
    tier: 2,
    parentId: 'ch_control',
    x: 140,
    y: 470,
    summary: 'Receptor ➔ Sensory Neuron ➔ Spinal Relay ➔ Motor Neuron ➔ Effector muscle.',
    prereqs: ['Neuron Anatomy'],
    unlocks: ['Voluntary Brain Functions']
  },
  {
    id: 'sub_mendel',
    label: 'Mendel\'s Monohybrid Cross',
    chapter: 'NCERT Ch 9.2',
    subject: 'Biology',
    tier: 2,
    parentId: 'ch_heredity',
    x: 270,
    y: -420,
    summary: 'Tall (TT) x Dwarf (tt) produces 100% Tt in F1, and 3:1 phenotypic ratio in F2.',
    prereqs: ['DNA Variation'],
    unlocks: ['Dihybrid Laws']
  }
];

const BASE_EDGES: WebEdge[] = [
  // CORE HIERARCHY EDGES (Central to Chapters)
  { id: 'e_core_chem1', source: 'central_core', target: 'ch_chem_rxn', type: 'hierarchy' },
  { id: 'e_core_chem2', source: 'central_core', target: 'ch_acids_bases', type: 'hierarchy' },
  { id: 'e_core_chem3', source: 'central_core', target: 'ch_metals', type: 'hierarchy' },
  { id: 'e_core_chem4', source: 'central_core', target: 'ch_carbon', type: 'hierarchy' },
  { id: 'e_core_chem5', source: 'central_core', target: 'ch_periodic', type: 'hierarchy' },
  { id: 'e_core_phy1', source: 'central_core', target: 'ch_light', type: 'hierarchy' },
  { id: 'e_core_phy2', source: 'central_core', target: 'ch_human_eye', type: 'hierarchy' },
  { id: 'e_core_phy3', source: 'central_core', target: 'ch_electricity', type: 'hierarchy' },
  { id: 'e_core_phy4', source: 'central_core', target: 'ch_magnetism', type: 'hierarchy' },
  { id: 'e_core_bio1', source: 'central_core', target: 'ch_life_processes', type: 'hierarchy' },
  { id: 'e_core_bio2', source: 'central_core', target: 'ch_control', type: 'hierarchy' },
  { id: 'e_core_bio3', source: 'central_core', target: 'ch_reproduction', type: 'hierarchy' },
  { id: 'e_core_bio4', source: 'central_core', target: 'ch_heredity', type: 'hierarchy' },

  // CHAPTER TO SUBTOPIC EDGES
  { id: 'e_chem1_s1', source: 'ch_chem_rxn', target: 'sub_balancing', type: 'hierarchy' },
  { id: 'e_chem1_s2', source: 'ch_chem_rxn', target: 'sub_redox', type: 'hierarchy' },
  { id: 'e_chem2_s1', source: 'ch_acids_bases', target: 'sub_ph_scale', type: 'hierarchy' },
  { id: 'e_chem2_s2', source: 'ch_acids_bases', target: 'sub_neutralization', type: 'hierarchy' },
  { id: 'e_chem3_s1', source: 'ch_metals', target: 'sub_reactivity_series', type: 'hierarchy' },
  { id: 'e_chem4_s1', source: 'ch_carbon', target: 'sub_catenation', type: 'hierarchy' },
  { id: 'e_phy1_s1', source: 'ch_light', target: 'sub_mirror_formula', type: 'hierarchy' },
  { id: 'e_phy1_s2', source: 'ch_light', target: 'sub_snells_law', type: 'hierarchy' },
  { id: 'e_phy2_s1', source: 'ch_human_eye', target: 'sub_myopia', type: 'hierarchy' },
  { id: 'e_phy3_s1', source: 'ch_electricity', target: 'sub_ohms_law', type: 'hierarchy' },
  { id: 'e_phy3_s2', source: 'ch_electricity', target: 'sub_joule_heating', type: 'hierarchy' },
  { id: 'e_phy4_s1', source: 'ch_magnetism', target: 'sub_fleming_rule', type: 'hierarchy' },
  { id: 'e_bio1_s1', source: 'ch_life_processes', target: 'sub_photosynthesis', type: 'hierarchy' },
  { id: 'e_bio1_s2', source: 'ch_life_processes', target: 'sub_circulation', type: 'hierarchy' },
  { id: 'e_bio2_s1', source: 'ch_control', target: 'sub_reflex_arc', type: 'hierarchy' },
  { id: 'e_bio4_s1', source: 'ch_heredity', target: 'sub_mendel', type: 'hierarchy' },

  // CURRICULAR DEPENDENCY EDGES
  { id: 'dep_chem1_chem2', source: 'ch_chem_rxn', target: 'ch_acids_bases', type: 'dependency', label: 'Prerequisite' },
  { id: 'dep_chem2_chem3', source: 'ch_acids_bases', target: 'ch_metals', type: 'dependency', label: 'Ionic Salt' },
  { id: 'dep_phy1_phy2', source: 'ch_light', target: 'ch_human_eye', type: 'dependency', label: 'Refraction Base' },
  { id: 'dep_phy3_phy4', source: 'ch_electricity', target: 'ch_magnetism', type: 'dependency', label: 'Oersted Effect' },
  { id: 'dep_bio1_bio2', source: 'ch_life_processes', target: 'ch_control', type: 'dependency', label: 'Energy Supply' },
  { id: 'dep_bio3_bio4', source: 'ch_reproduction', target: 'ch_heredity', type: 'dependency', label: 'DNA Transfer' },

  // LIVING CROSS-SUBJECT INTERDISCIPLINARY BRIDGES (Special Synapses)
  { 
    id: 'bridge_electrolysis', 
    source: 'ch_electricity', 
    target: 'ch_chem_rxn', 
    type: 'bridge', 
    label: 'Electrolysis (Physics ⟷ Chemistry)' 
  },
  { 
    id: 'bridge_digestion_ph', 
    source: 'ch_acids_bases', 
    target: 'ch_life_processes', 
    type: 'bridge', 
    label: 'Stomach HCl pH 1.5 (Chemistry ⟷ Biology)' 
  },
  { 
    id: 'bridge_eye_optics', 
    source: 'ch_light', 
    target: 'ch_human_eye', 
    type: 'bridge', 
    label: 'Convex Lens Retinal Image (Physics ⟷ Biology)' 
  },
  { 
    id: 'bridge_nerve_impulse', 
    source: 'ch_control', 
    target: 'ch_electricity', 
    type: 'bridge', 
    label: 'Axon Electrical Voltage (Biology ⟷ Physics)' 
  }
];

export const KnowledgeGraphView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { digitalTwin, markAsStarted } = useStudent();
  
  // Navigation & filtering state
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'GRAPH' | 'ROADMAP' | 'BRIDGES'>('GRAPH');
  
  // Graph interaction state (Pan & Zoom)
  const [pan, setPan] = useState({ x: 500, y: 350 });
  const [zoom, setZoom] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Selected & Hovered Node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('central_core');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // Collapsed branches state
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes dynamically based on selected subject and search
  const visibleNodes = useMemo(() => {
    return BASE_NODES.filter(node => {
      // Always show central node
      if (node.tier === 0) return true;
      
      // Filter by subject
      if (selectedSubject !== 'All' && node.subject !== selectedSubject) {
        return false;
      }
      
      // Filter collapsed children (if parent is collapsed)
      if (node.parentId && collapsedNodes.has(node.parentId)) {
        return false;
      }
      
      return true;
    });
  }, [selectedSubject, collapsedNodes]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  // Filter edges where both source and target are visible
  const visibleEdges = useMemo(() => {
    return BASE_EDGES.filter(edge => {
      return visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target);
    });
  }, [visibleNodeIds]);

  // Find active node object for details drawer
  const activeNode = useMemo(() => {
    const id = selectedNodeId || 'central_core';
    return BASE_NODES.find(n => n.id === id) || BASE_NODES[0];
  }, [selectedNodeId]);

  // Compute connected nodes for highlighting
  const connectedNodeIds = useMemo(() => {
    const focusId = hoveredNodeId || selectedNodeId;
    if (!focusId) return new Set<string>();
    
    const set = new Set<string>([focusId]);
    visibleEdges.forEach(edge => {
      if (edge.source === focusId) set.add(edge.target);
      if (edge.target === focusId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, visibleEdges]);

  // Pan & Zoom Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.min(2.0, Math.max(0.4, prev * zoomFactor)));
  };

  // Center on node
  const centerOnNode = (node: WebNode) => {
    sounds.playClick();
    setSelectedNodeId(node.id);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({
        x: rect.width / 2 - node.x * zoom,
        y: rect.height / 2 - node.y * zoom
      });
    }
  };

  // Reset View
  const handleResetView = () => {
    sounds.playClick();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
      setZoom(0.85);
    }
  };

  // Toggle Branch Collapse
  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Colors & Aesthetic styling
  const getNodeColor = (node: WebNode) => {
    if (node.tier === 0) return { bg: '#0f172a', border: '#38bdf8', text: '#ffffff' };
    if (node.subject === 'Chemistry') return { bg: '#581c87', border: '#c084fc', text: '#f3e8ff' };
    if (node.subject === 'Physics') return { bg: '#0369a1', border: '#38bdf8', text: '#e0f2fe' };
    if (node.subject === 'Biology') return { bg: '#065f46', border: '#34d399', text: '#d1fae5' };
    return { bg: '#1e293b', border: '#94a3b8', text: '#ffffff' };
  };

  // Check if student has completed or has gaps
  const getNodeStatus = (nodeId: string) => {
    const isConfusion = digitalTwin.confusionPoints?.includes(nodeId);
    const isMastered = digitalTwin.masteredSkills?.includes(nodeId);
    if (isConfusion) return 'gap';
    if (isMastered) return 'mastered';
    return 'in_progress';
  };

  // Subject quick switch effect: gently auto-center on subject cluster
  useEffect(() => {
    if (selectedSubject === 'Chemistry') {
      setPan({ x: 650, y: 350 });
      setZoom(0.9);
    } else if (selectedSubject === 'Physics') {
      setPan({ x: 350, y: 350 });
      setZoom(0.9);
    } else if (selectedSubject === 'Biology') {
      setPan({ x: 500, y: 180 });
      setZoom(0.9);
    } else {
      handleResetView();
    }
  }, [selectedSubject]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Top Header matching Screen 3 in media_1790433716001.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowRight size={18} className="rotate-180" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Brain Web</h2>
            <p className="text-xs text-slate-400">See how concepts connect across chapters with an interactive visual map.</p>
          </div>
        </div>

        {/* Mode Pills & Subject Dropdown matching Screen 3 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-full shadow-2xs">
            <button
              onClick={() => setActiveTab('GRAPH')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'GRAPH' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ◉ Full View
            </button>
            <button
              onClick={() => setActiveTab('ROADMAP')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'ROADMAP' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chapter View
            </button>
            <button
              onClick={() => setActiveTab('BRIDGES')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'BRIDGES' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cross-Subject
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            <span>{selectedSubject === 'All' ? 'Chemistry' : selectedSubject}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Subject & Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2">Domains:</span>
          {[
            { id: 'All', label: 'Full Science Web', color: 'hover:border-slate-400' },
            { id: 'Chemistry', label: 'Chemistry (5 Ch)', color: 'text-purple-600' },
            { id: 'Physics', label: 'Physics (5 Ch)', color: 'text-cyan-600' },
            { id: 'Biology', label: 'Biology (5 Ch)', color: 'text-emerald-600' }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                sounds.playClick();
                setSelectedSubject(sub.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === sub.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, formulas, traps..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* VIEW 1: LIVING NEURAL BRAIN WEB (PAN & ZOOM CANVAS)       */}
      {/* ========================================================== */}
      {activeTab === 'GRAPH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visual Web Canvas (2 cols) */}
          <div 
            ref={containerRef}
            id="graph-canvas"
            className="lg:col-span-2 h-[640px] bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Subtle Starry / Neural Grid Backdrop */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
                backgroundSize: '36px 36px',
                transform: `translate(${pan.x % 36}px, ${pan.y % 36}px)`
              }}
            ></div>

            {/* Floating Navigation Controls HUD */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-lg">
              <button 
                onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button 
                onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <div className="w-px h-4 bg-slate-800"></div>
              <button 
                onClick={handleResetView}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Reset Camera Center"
              >
                <RotateCcw size={16} />
              </button>
              <span className="text-[11px] font-mono text-indigo-400 px-2 font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Legend Overlay HUD */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Chemistry
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Physics
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Biology
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 border-b-2 border-dashed border-amber-400"></span> Cross Synapse
              </div>
            </div>

            {/* SVG Graph Layer */}
            <svg className="w-full h-full absolute inset-0">
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                
                {/* 1. EDGES / CONNECTIONS */}
                {visibleEdges.map(edge => {
                  const source = BASE_NODES.find(n => n.id === edge.source);
                  const target = BASE_NODES.find(n => n.id === edge.target);
                  if (!source || !target) return null;

                  const isHighlighted = connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target);
                  const isBridge = edge.type === 'bridge';
                  const isDependency = edge.type === 'dependency';

                  let strokeColor = '#334155';
                  let strokeWidth = 1.5;
                  let strokeDash = isBridge ? '6,6' : isDependency ? '4,4' : 'none';

                  if (isHighlighted) {
                    strokeColor = isBridge ? '#f59e0b' : '#818cf8';
                    strokeWidth = 2.5;
                  }

                  // Midpoint for curve and label
                  const mx = (source.x + target.x) / 2;
                  const my = (source.y + target.y) / 2;

                  return (
                    <g key={edge.id} className="transition-all duration-300">
                      {/* Base connection line */}
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        strokeOpacity={isHighlighted ? 0.95 : 0.35}
                      />
                      
                      {/* Animated pulse packet along highlighted edge */}
                      {isHighlighted && (
                        <circle r="3.5" fill={isBridge ? '#f59e0b' : '#38bdf8'}>
                          <animateMotion
                            path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Bridge Label Tag */}
                      {isBridge && (
                        <g transform={`translate(${mx}, ${my})`}>
                          <rect
                            x="-50"
                            y="-10"
                            width="100"
                            height="20"
                            rx="10"
                            fill="#1e1b4b"
                            stroke="#f59e0b"
                            strokeWidth="1"
                            opacity="0.85"
                          />
                          <text
                            textAnchor="middle"
                            y="4"
                            fill="#fde68a"
                            fontSize="9"
                            fontFamily="sans-serif"
                            fontWeight="bold"
                          >
                            Synapse
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 2. NODES */}
                {visibleNodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnected = connectedNodeIds.has(node.id);
                  const status = getNodeStatus(node.id);
                  const colors = getNodeColor(node);
                  const isMatch = searchQuery && (
                    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    node.summary.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  // Node sizing
                  const radius = node.tier === 0 ? 46 : node.tier === 1 ? 34 : 22;
                  const hasChildren = BASE_NODES.some(n => n.parentId === node.id);
                  const isCollapsed = collapsedNodes.has(node.id);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer transition-transform duration-300"
                      onClick={() => centerOnNode(node)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      {/* Outer pulse aura for active/matching nodes */}
                      {(isSelected || isMatch) && (
                        <circle
                          r={radius + 8}
                          fill="none"
                          stroke={isMatch ? '#eab308' : '#6366f1'}
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          className="animate-spin origin-center"
                          style={{ animationDuration: '8s' }}
                        />
                      )}

                      {/* Status indicator ring */}
                      {status === 'gap' && (
                        <circle
                          r={radius + 5}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                      )}

                      {/* Node Body Circle */}
                      <circle
                        r={radius}
                        fill={colors.bg}
                        stroke={isSelected ? '#ffffff' : colors.border}
                        strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                        filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))"
                        className="transition-colors duration-200"
                      />

                      {/* Node Label Text */}
                      {node.tier === 0 ? (
                        <>
                          <text
                            textAnchor="middle"
                            y="-6"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="900"
                            fontFamily="sans-serif"
                          >
                            SCIENCE
                          </text>
                          <text
                            textAnchor="middle"
                            y="8"
                            fill="#38bdf8"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            CORE 10
                          </text>
                        </>
                      ) : (
                        <text
                          textAnchor="middle"
                          y="4"
                          fill={colors.text}
                          fontSize={node.tier === 1 ? '10' : '8.5'}
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none"
                        >
                          {node.label.length > 18 ? node.label.slice(0, 16) + '..' : node.label}
                        </text>
                      )}

                      {/* Expand / Collapse Toggle Pill for Tier 1 Nodes */}
                      {node.tier === 1 && hasChildren && (
                        <g 
                          transform={`translate(${radius - 8}, ${radius - 8})`}
                          onClick={(e) => toggleCollapse(node.id, e)}
                          className="hover:scale-125 transition-transform"
                        >
                          <circle r="9" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                          <text
                            textAnchor="middle"
                            y="3.5"
                            fill="#cbd5e1"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {isCollapsed ? '+' : '−'}
                          </text>
                        </g>
                      )}

                      {/* Node chapter label tag underneath */}
                      {node.tier !== 0 && (
                        <text
                          textAnchor="middle"
                          y={radius + 14}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="500"
                          fontFamily="sans-serif"
                          className="opacity-80"
                        >
                          {node.chapter}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Side Inspector Drawer (1 col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Concept Header */}
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  activeNode.subject === 'Chemistry' ? 'bg-purple-100 text-purple-800' :
                  activeNode.subject === 'Physics' ? 'bg-cyan-100 text-cyan-800' :
                  activeNode.subject === 'Biology' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {activeNode.subject} • {activeNode.chapter}
                </span>

                {activeNode.boardMarks && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                    ★ {activeNode.boardMarks}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {activeNode.label}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {activeNode.summary}
                </p>
              </div>

              {/* High Yield Key Board Question */}
              {activeNode.keyQuestion && (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-indigo-700 text-[11px] font-black uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> High-Yield Board Trap
                  </div>
                  <p className="text-xs font-medium text-slate-800 italic">
                    "{activeNode.keyQuestion}"
                  </p>
                </div>
              )}

              {/* Prerequisites & Unlock Chains */}
              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-500" /> Prerequisite Foundations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.prereqs.map((pre, i) => (
                      <span key={i} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        {pre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Compass size={14} className="text-emerald-500" /> Unlocks Next Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.unlocks.map((unl, i) => (
                      <span key={i} className="text-xs font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
                        {unl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button 
                onClick={() => {
                  sounds.playVictory();
                  markAsStarted(activeNode.id);
                  alert(`Opening 3D interactive model for: ${activeNode.label}`);
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>View in 3D</span>
                <ArrowRight size={14} />
              </button>
              <div className="flex justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span>Click & drag canvas to pan</span>
                <span>Scroll wheel to zoom</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* VIEW 2: 3-STAGE PROGRESSION ROADMAP (FOUNDATION ➔ APPLIED) */}
      {/* ========================================================== */}
      {activeTab === 'ROADMAP' && (
        <div className="space-y-6">
          {(['Foundation', 'Core Mechanism', 'Board Application'] as const).map((stage, sIdx) => {
            const stageNodes = BASE_NODES.filter(n => {
              if (n.tier === 0) return false;
              if (selectedSubject !== 'All' && n.subject !== selectedSubject) return false;
              if (sIdx === 0) return n.tier === 1 && (n.chapter.includes('Ch 1') || n.chapter.includes('Ch 10') || n.chapter.includes('Ch 6'));
              if (sIdx === 1) return n.tier === 1 && (n.chapter.includes('Ch 2') || n.chapter.includes('Ch 12') || n.chapter.includes('Ch 7'));
              return n.tier === 1 || n.tier === 2;
            });

            return (
              <div key={stage} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                      0{sIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">{stage}</h3>
                      <p className="text-xs text-slate-500">
                        {sIdx === 0 && 'Fundamental definitions, physical laws, and atomic rules.'}
                        {sIdx === 1 && 'Mathematical formulas, reaction kinetics, and organ mechanics.'}
                        {sIdx === 2 && 'High-yield board exam questions, industrial processes, and traps.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {stageNodes.length} Concepts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stageNodes.slice(0, 6).map(node => (
                    <div 
                      key={node.id}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        setActiveTab('GRAPH');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          node.subject === 'Chemistry' ? 'bg-purple-100 text-purple-700' :
                          node.subject === 'Physics' ? 'bg-cyan-100 text-cyan-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {node.chapter}
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">{node.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{node.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================== */}
      {/* VIEW 3: CROSS-SUBJECT INTERDISCIPLINARY BRIDGES           */}
      {/* ========================================================== */}
      {activeTab === 'BRIDGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Electricity ⟷ Chemical Electrolysis',
              subjects: 'Physics + Chemistry',
              connection: 'Electric potential difference and current flow (Ohm\'s Law) drive decomposition of aqueous salts (Chlor-Alkali process to produce NaOH, Cl₂, and H₂).',
              boardImportance: 'Crucial (Chlor-Alkali process appears in 80% of board papers)'
            },
            {
              title: 'Chemical Reactions ⟷ Biological Digestion',
              subjects: 'Chemistry + Biology',
              connection: 'Enzyme catalysis in stomach (Pepsin at pH 1.5) and small intestine (Trypsin at pH 8) is an exact real-world application of Acid-Base neutralization and chemical bond breakdown.',
              boardImportance: 'High (Frequent 3-mark question connecting HCl secretion and enzyme activation)'
            },
            {
              title: 'Optics & Spherical Lenses ⟷ The Human Eye',
              subjects: 'Physics + Biology',
              connection: 'The crystalline lens of the human eye adjusts focal length using ciliary muscles (accommodation) to form sharp inverted images on the retina, corrected by convex or concave spectacles.',
              boardImportance: 'Very High (Myopia and Hypermetropia ray diagrams)'
            },
            {
              title: 'Electricity ⟷ Nerve Reflex Arcs',
              subjects: 'Physics + Biology',
              connection: 'Nerve impulses travel along the axon as electrical electrochemical potentials before converting to chemical neurotransmitters across the synapse.',
              boardImportance: 'Conceptual depth question'
            }
          ].map((bridge, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  {bridge.subjects}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                  Interdisciplinary
                </span>
              </div>
              <h3 className="font-black text-lg text-slate-900">{bridge.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{bridge.connection}</p>
              <div className="pt-3 border-t border-slate-100 text-xs font-bold text-amber-700">
                CBSE Weightage: {bridge.boardImportance}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
