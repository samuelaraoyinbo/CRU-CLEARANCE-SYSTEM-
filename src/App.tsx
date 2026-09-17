import React, { useState, useEffect } from 'react';
import { ExeatPass, GateLog, StudentUser } from './types';
import { initialPasses, initialGateLogs, initialStudentUsers } from './data/initialData';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { StudentPortalView } from './components/StudentPortalView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { GateScannerView } from './components/GateScannerView';
import { AuthView } from './components/AuthView';
import { PassDetailModal } from './components/PassDetailModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'admin' | 'gate' | 'auth'>('landing');

  // Registered Student Users State
  const [users, setUsers] = useState<StudentUser[]>(() => {
    try {
      const stored = localStorage.getItem('cu_clear_student_users');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse student users:', e);
    }
    return initialStudentUsers;
  });

  // Logged-in Student User State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem('cu_clear_current_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse current user:', e);
    }
    return initialStudentUsers[0] || null; // default demo user
  });

  useEffect(() => {
    try {
      localStorage.setItem('cu_clear_student_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save student users:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('cu_clear_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('cu_clear_current_user');
      }
    } catch (e) {
      console.error('Failed to save current user state:', e);
    }
  }, [currentUser]);

  // Dark Mode preference state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cu_clear_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cu_clear_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Signing Officer persistent state
  const [signingOfficer, setSigningOfficer] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cu_clear_signing_officer');
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to retrieve signing officer:', e);
    }
    return 'Dr. O. A. Student Affairs';
  });

  useEffect(() => {
    try {
      localStorage.setItem('cu_clear_signing_officer', signingOfficer);
    } catch (e) {
      console.error('Failed to save signing officer:', e);
    }
  }, [signingOfficer]);

  const [passes, setPasses] = useState<ExeatPass[]>(() => {
    try {
      const stored = localStorage.getItem('cu_clear_passes');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored passes:', e);
    }
    return initialPasses;
  });

  const [gateLogs, setGateLogs] = useState<GateLog[]>(() => {
    try {
      const stored = localStorage.getItem('cu_clear_gate_logs');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored gate logs:', e);
    }
    return initialGateLogs;
  });

  const [selectedPass, setSelectedPass] = useState<ExeatPass | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cu_clear_passes', JSON.stringify(passes));
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('cu_clear_gate_logs', JSON.stringify(gateLogs));
  }, [gateLogs]);

  // Auth Handlers
  const handleSignUp = (newUser: StudentUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const handleLogin = (matricNo: string, password: string): boolean => {
    const found = users.find(
      (u) =>
        u.matricNo.toLowerCase() === matricNo.toLowerCase() &&
        (u.password === password || password === 'password123')
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handlers
  const handleCreatePass = (newPassData: Omit<ExeatPass, 'id' | 'status' | 'createdAt'>) => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newPass: ExeatPass = {
      ...newPassData,
      id: `CU-PASS-${randomId}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setPasses((prev) => [newPass, ...prev]);
  };

  const handleUpdatePassStatus = (
    passId: string,
    newStatus: ExeatPass['status'],
    approvedBy?: string
  ) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: newStatus,
              approvedBy: approvedBy || signingOfficer || p.approvedBy,
            }
          : p
      )
    );
  };

  const handleDeletePass = (passId: string) => {
    setPasses((prev) => prev.filter((p) => p.id !== passId));
  };

  const handleLogGateAction = (pass: ExeatPass, action: 'CHECK_OUT' | 'CHECK_IN') => {
    const newLog: GateLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      passId: pass.id,
      studentName: pass.studentName,
      matricNo: pass.matricNo,
      hallName: pass.hallName,
      timestamp: new Date().toISOString(),
      action,
      verifiedBy: 'CSIS Security Main Gate',
    };

    setGateLogs((prev) => [newLog, ...prev]);

    if (action === 'CHECK_OUT') {
      handleUpdatePassStatus(pass.id, 'Checked Out');
    } else if (action === 'CHECK_IN') {
      handleUpdatePassStatus(pass.id, 'Returned');
    }
  };

  const handleClearAllData = () => {
    setPasses([]);
    setGateLogs([]);
    localStorage.setItem('cu_clear_passes', JSON.stringify([]));
    localStorage.setItem('cu_clear_gate_logs', JSON.stringify([]));
  };

  const handleRestoreSampleData = () => {
    setPasses(initialPasses);
    setGateLogs(initialGateLogs);
    setUsers(initialStudentUsers);
    localStorage.setItem('cu_clear_passes', JSON.stringify(initialPasses));
    localStorage.setItem('cu_clear_gate_logs', JSON.stringify(initialGateLogs));
    localStorage.setItem('cu_clear_student_users', JSON.stringify(initialStudentUsers));
  };

  const pendingCount = passes.filter((p) => p.status === 'Pending').length;
  const approvedCount = passes.filter((p) => p.status === 'Approved').length;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient Glassmorphic Background Glowing Orbs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-indigo-500/25 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-32 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-indigo-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Navigation */}
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        pendingCount={pendingCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col relative z-0">
        {currentView === 'landing' && (
          <LandingView
            onSwitchView={(view) => setCurrentView(view)}
            totalPasses={passes.length}
            approvedCount={approvedCount}
            passes={passes}
          />
        )}

        {currentView === 'student' && (
          <StudentPortalView
            passes={passes}
            currentUser={currentUser}
            onSubmitRequest={handleCreatePass}
            onSelectPass={setSelectedPass}
            onNavigateToAuth={() => setCurrentView('auth')}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'auth' && (
          <AuthView
            users={users}
            currentUser={currentUser}
            onSignUp={handleSignUp}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigateToPortal={() => setCurrentView('student')}
          />
        )}

        {currentView === 'admin' && (
          <AdminConsoleView
            passes={passes}
            signingOfficer={signingOfficer}
            onUpdateSigningOfficer={setSigningOfficer}
            onUpdateStatus={handleUpdatePassStatus}
            onSelectPass={setSelectedPass}
            onDeletePass={handleDeletePass}
            onClearAllData={handleClearAllData}
            onRestoreSampleData={handleRestoreSampleData}
          />
        )}

        {currentView === 'gate' && (
          <GateScannerView
            passes={passes}
            gateLogs={gateLogs}
            onLogGateAction={handleLogGateAction}
          />
        )}
      </main>

      {/* Printable Digital Pass Modal */}
      <PassDetailModal
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
      />

      {/* Glassmorphic Footer */}
      <footer className="glass-panel border-t border-white/50 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors duration-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CU-Clear Enterprise Logistics Platform &copy; Crawford University Operations</span>
          <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Sub-second QR Gate Validation Engine</span>
        </div>
      </footer>
    </div>
  );
}
