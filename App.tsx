import React, { useState } from 'react';
import { StudentProvider } from './context/StudentContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { LaunchAnimation } from './components/LaunchAnimation';
import { Dashboard } from './pages/Dashboard';
import { LearningSession } from './pages/LearningSession';
import { QuizSession } from './pages/QuizSession';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { OfficialDashboard } from './pages/OfficialDashboard';
import { UserRole, Quiz } from './types';
import { QUIZZES } from './data/curriculum';

const AppContent: React.FC = () => {
  const [showLaunch, setShowLaunch] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'session' | 'quiz'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [loginDefaultRole, setLoginDefaultRole] = useState<UserRole>('student');
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setView('dashboard');
  };

  const handleOpenLogin = (role: UserRole = 'student') => {
    setLoginDefaultRole(role);
    setView('login');
  };
  
  const handleLogout = () => {
    setView('landing');
    setUserRole('student'); 
  };
  
  const handleStartSession = (conceptId: string) => {
    setActiveConcept(conceptId);
    setView('session');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz); 
    setView('quiz');
  };

  const handleExitSession = () => {
    setActiveConcept(null);
    setActiveQuiz(null);
    setView('dashboard');
  };

  // Launch Animation Overlay
  if (showLaunch) {
    return <LaunchAnimation onComplete={() => setShowLaunch(false)} />;
  }

  // Render Logic based on Role and View
  if (view === 'landing') {
    return <LandingPage onLogin={handleLogin} onOpenLogin={handleOpenLogin} />;
  }

  if (view === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onBack={() => setView('landing')} 
        defaultRole={loginDefaultRole} 
      />
    );
  }

  if (view === 'dashboard') {
    if (userRole === 'teacher') return <TeacherDashboard onBack={handleLogout} />;
    if (userRole === 'official') return <OfficialDashboard onBack={handleLogout} />;
    return <Dashboard onStartSession={handleStartSession} onStartQuiz={handleStartQuiz} onBack={handleLogout} />; 
  }

  if (view === 'session' && activeConcept) {
    return <LearningSession conceptId={activeConcept} onExit={handleExitSession} />;
  }

  if (view === 'quiz' && activeQuiz) {
      return <QuizSession quiz={activeQuiz} onExit={handleExitSession} />;
  }

  return <div>Error: Unknown State</div>;
};

const App: React.FC = () => {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
};

export default App;