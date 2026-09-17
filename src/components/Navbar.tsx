import React, { useState } from 'react';
import { Home, User, LayoutDashboard, QrCode, Sun, Moon, Menu, X, LogIn, GraduationCap } from 'lucide-react';
import { StudentUser } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'student' | 'admin' | 'gate' | 'auth';
  onSwitchView: (view: 'landing' | 'student' | 'admin' | 'gate' | 'auth') => void;
  pendingCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser?: StudentUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  pendingCount,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (view: 'landing' | 'student' | 'admin' | 'gate' | 'auth') => {
    onSwitchView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-white/60 dark:border-white/10 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Institution Branding */}
          <button
            onClick={() => handleMobileNav('landing')}
            className="flex items-center space-x-2.5 sm:space-x-3 text-left group focus:outline-none cursor-pointer min-h-[44px]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center shadow-md border border-white/80 dark:border-white/20 shrink-0">
              <img src="/assets/cu-logo.webp" alt="Crawford University" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white block leading-none">
                CRU-CS
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                Crawford University
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => onSwitchView('landing')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                currentView === 'landing'
                  ? 'bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-500/30 backdrop-blur-md shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSwitchView('student')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                currentView === 'student'
                  ? 'bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-500/30 backdrop-blur-md shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => onSwitchView('admin')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition flex items-center gap-1.5 relative cursor-pointer min-h-[40px] ${
                currentView === 'admin'
                  ? 'bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-500/30 backdrop-blur-md shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Console</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full shadow-xs">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSwitchView('gate')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer min-h-[40px] backdrop-blur-md ${
                currentView === 'gate'
                  ? 'bg-indigo-800/90 text-white shadow-indigo-900/50 border border-indigo-400/30'
                  : 'bg-indigo-600/90 dark:bg-indigo-500/90 text-white hover:bg-indigo-700/90 dark:hover:bg-indigo-600/90 border border-indigo-400/30 shadow-indigo-200/50 dark:shadow-none'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Scanner</span>
            </button>

            {/* Auth / Account Switcher Button */}
            <button
              onClick={() => onSwitchView('auth')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[40px] border ${
                currentView === 'auth'
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 backdrop-blur-md'
                  : currentUser
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              {currentUser ? (
                <>
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate max-w-[100px]">{currentUser.studentName.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Sign In / Sign Up</span>
                </>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <div className="pl-1 border-l border-slate-200/60 dark:border-slate-800/60 flex items-center">
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 glass-pill transition flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-4.5 h-4.5 text-amber-400" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Right Controls: Dark Mode Toggle + Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 glass-pill transition flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px]"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 glass-pill transition flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/40 dark:border-slate-800/60 glass-panel px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleMobileNav('landing')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition min-h-[48px] cursor-pointer ${
              currentView === 'landing'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleMobileNav('student')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition min-h-[48px] cursor-pointer ${
              currentView === 'student'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Student Exeat Portal</span>
          </button>

          <button
            onClick={() => handleMobileNav('auth')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition min-h-[48px] cursor-pointer ${
              currentView === 'auth'
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{currentUser ? `Account (${currentUser.studentName})` : 'Sign In / Sign Up'}</span>
          </button>

          <button
            onClick={() => handleMobileNav('admin')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition min-h-[48px] cursor-pointer ${
              currentView === 'admin'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Console</span>
            </div>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {pendingCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => handleMobileNav('gate')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition min-h-[48px] cursor-pointer ${
              currentView === 'gate'
                ? 'bg-indigo-800 text-white'
                : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>Gate Scanner Desk</span>
          </button>
        </div>
      )}
    </nav>
  );
};

