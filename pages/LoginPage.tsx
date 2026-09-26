import React, { useState } from 'react';
import { 
  GraduationCap, School, Building2, ArrowLeft, ArrowRight, 
  ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle2, Lock, User
} from 'lucide-react';
import { UserRole } from '../types';
import { sounds } from '../services/audioService';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
  defaultRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onBack, 
  defaultRole = 'student' 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState('STUDENT-2026-0941');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Kendriya Vidyalaya No. 1, Bajaj Nagar');
  const [isLoading, setIsLoading] = useState(false);

  const ROLE_CONFIGS = {
    student: {
      title: 'Student Portal Access',
      subtitle: 'Class 9-10 Adaptive NCERT Learning & Virtual Science Lab',
      idLabel: 'Student Roll No / APAAR ID',
      placeholderId: 'e.g. APAAR-8291-0491',
      badge: 'CBSE 2026 Aligned',
      icon: GraduationCap,
      persona: {
        name: 'Amit Kumar',
        grade: 'Class 10 - Section A',
        school: 'Kendriya Vidyalaya No. 1, Bajaj Nagar',
        udise: 'UDISE: 08120409201'
      }
    },
    teacher: {
      title: 'Teacher Co-Pilot Login',
      subtitle: 'Real-time Classroom Analytics, Student Twins & Automated Lesson Plans',
      idLabel: 'Teacher Employee ID / Shala Darpan ID',
      placeholderId: 'e.g. TCH-RJ-98214',
      badge: 'AI Pedagogy Suite',
      icon: School,
      persona: {
        name: 'Sunita Sharma, M.Sc B.Ed',
        grade: 'HOD Science & Technology',
        school: 'Kendriya Vidyalaya No. 1, Bajaj Nagar',
        udise: 'Class 10A & 10B'
      }
    },
    official: {
      title: 'District Governance Console',
      subtitle: 'NITI Aayog District Equity Metrics, Learning Gap Heatmaps & Resource Audits',
      idLabel: 'Administrative Officer Key / NIC Gov Email',
      placeholderId: 'e.g. deo.jaipur@nic.in',
      badge: 'State Dashboard',
      icon: Building2,
      persona: {
        name: 'Dr. Ramesh Verma, IAS',
        grade: 'District Education Officer',
        school: 'Department of School Education, Jaipur',
        udise: '142 Schools Active'
      }
    }
  };

  const handleRoleChange = (role: UserRole) => {
    sounds.playClick();
    setSelectedRole(role);
    if (role === 'student') {
      setIdentifier('STUDENT-2026-0941');
    } else if (role === 'teacher') {
      setIdentifier('TCH-RJ-98214');
    } else {
      setIdentifier('deo.jaipur@nic.in');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sounds.playCelebration();
      onLogin(selectedRole);
    }, 450);
  };

  const handleQuickDemo = (role: UserRole) => {
    sounds.playClick();
    setSelectedRole(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sounds.playCelebration();
      onLogin(role);
    }, 250);
  };

  const currentConfig = ROLE_CONFIGS[selectedRole];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Container Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-[36px] border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: ROLE SELECTOR & PERSONA HIGHLIGHT (4 COLS)       */}
        {/* ============================================================== */}
        <aside className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#d7f742 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 space-y-6">
            
            {/* Header Brand */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#d7f742] flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_#d7f742]">
                SA
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Shiksha<span className="text-[#d7f742]">AI</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">
                ACCESS GATEWAY
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Select Your Educational Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Choose your role to load your personalized neural twin and tools.
              </p>
            </div>

            {/* Three Tactile Role Selector Buttons */}
            <div className="space-y-2.5">
              {(['student', 'teacher', 'official'] as UserRole[]).map((r) => {
                const conf = ROLE_CONFIGS[r];
                const Icon = conf.icon;
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-slate-800 border-[#d7f742] shadow-lg shadow-[#d7f742]/10 scale-[1.02]' 
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isSelected ? 'bg-[#d7f742] text-black shadow-md' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className={`text-xs font-black capitalize ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {r} Portal
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {conf.subtitle}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#d7f742]" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Quick Demo Card */}
          <div className="relative z-10 mt-6 p-4 rounded-2xl bg-[#d7f742] text-black shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider block opacity-75">Instant Demo Profile</span>
              <span className="text-xs font-black">{currentConfig.persona.name}</span>
              <span className="text-[10px] block opacity-80">{currentConfig.persona.grade}</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo(selectedRole)}
              className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-white text-[11px] font-black rounded-xl transition-transform active:scale-95 shadow-md"
            >
              1-Click Login →
            </button>
          </div>

        </aside>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: LOGIN CREDENTIALS FORM (7 COLS)                 */}
        {/* ============================================================== */}
        <main className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">

            {/* Back Button & SSL Stamp */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} /> Return to Landing
              </button>

              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                <ShieldCheck size={14} />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Form Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                <CurrentIcon size={12} className="text-blue-600" />
                <span>{currentConfig.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentConfig.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {currentConfig.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Institution / School */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Institution (UDISE+)
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                >
                  <option value="Kendriya Vidyalaya No. 1, Bajaj Nagar">Kendriya Vidyalaya No. 1, Bajaj Nagar (UDISE: 08120409201)</option>
                  <option value="Govt Model Senior Secondary School, Jaipur">Govt Model Senior Secondary School, Jaipur</option>
                  <option value="Jawahar Navodaya Vidyalaya, Paota">Jawahar Navodaya Vidyalaya, Paota</option>
                </select>
              </div>

              {/* ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentConfig.idLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={currentConfig.placeholderId}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                  <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password / Access PIN
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-950 hover:bg-black text-white font-black text-xs rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-[#d7f742] animate-spin" />
                  ) : (
                    <>
                      <span>Sign In & Open Portal</span>
                      <ArrowRight size={16} className="text-[#d7f742]" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Footer Trust Seal */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Ministry of Education • Government of India</span>
            <span className="font-mono text-slate-500">DPDP Act 2023 Compliant</span>
          </div>

        </main>

      </div>

    </div>
  );
};
