import React, { useState } from 'react';
import { Zap, QrCode, ShieldCheck, ArrowRight, Lock, CheckCircle2, Search, Clock, FileText, Building, Users, AlertCircle } from 'lucide-react';
import { ExeatPass } from '../types';

interface LandingViewProps {
  onSwitchView: (view: 'student' | 'admin' | 'gate') => void;
  totalPasses: number;
  approvedCount: number;
  passes?: ExeatPass[];
}

export const LandingView: React.FC<LandingViewProps> = ({ onSwitchView, totalPasses, approvedCount, passes = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPass, setSearchedPass] = useState<ExeatPass | null | undefined>(null);

  const handleSearchPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchedPass(null);
      return;
    }

    const found = passes.find(
      (p) =>
        p.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.matricNo.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    setSearchedPass(found || undefined);
  };

  return (
    <div className="flex-1 bg-transparent transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900/90 via-indigo-950/85 to-indigo-900/90 backdrop-blur-2xl text-white py-12 sm:py-20 px-4 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.25),transparent_50%)]"></div>
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <img src="/assets/cu-logo.webp" alt="Crawford University" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-white/95 p-1.5 shadow-xl shadow-black/30 border border-white/30 backdrop-blur-md" />
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] sm:text-xs font-semibold tracking-wide uppercase backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-indigo-300" />
              Crawford University Clearance System (CRU-CS)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight px-2">
            Crawford University Clearance System
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-indigo-100/80 max-w-2xl mx-auto font-light px-2">
            Eliminating administrative bottlenecks, manual queues, and paper pass forging with sub-second QR gate validation at Crawford University (CRU-CS).
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onSwitchView('student')}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-indigo-500/90 hover:bg-indigo-600 text-white font-semibold rounded-xl backdrop-blur-md border border-indigo-400/40 shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group min-h-[48px] cursor-pointer"
            >
              <span>Open Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSwitchView('admin')}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/25 backdrop-blur-md transition min-h-[48px] cursor-pointer"
            >
              Access Admin Console
            </button>
            <button
              onClick={() => onSwitchView('gate')}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-emerald-600/90 hover:bg-emerald-700/90 text-white font-semibold rounded-xl border border-emerald-400/30 backdrop-blur-md shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch Gate Scanner</span>
            </button>
          </div>

          {/* Live Quick Stats Bar */}
          <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-8 text-xs text-indigo-200/80 border-t border-indigo-800/50 max-w-xl mx-auto mt-6 sm:mt-8">
            <div className="p-2 sm:p-0">
              <span className="block font-extrabold text-xl sm:text-2xl text-white">{totalPasses}</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-300 block sm:inline">Total Passes</span>
            </div>
            <div className="p-2 sm:p-0 sm:border-l sm:border-indigo-800/60 sm:pl-8">
              <span className="block font-extrabold text-xl sm:text-2xl text-emerald-400">{approvedCount}</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-300 block sm:inline">Approved Passes</span>
            </div>
            <div className="p-2 sm:p-0 sm:border-l sm:border-indigo-800/60 sm:pl-8">
              <span className="block font-extrabold text-xl sm:text-2xl text-white">&lt;0.5s</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-300 block sm:inline">Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Pass Verification Lookup */}
      <section className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-100 font-bold text-sm">
            <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>CRU-CS Exeat Pass Status Lookup</span>
          </div>
          <form onSubmit={handleSearchPass} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Pass ID (e.g. CRU-CS-8921) or Matric..."
              className="glass-input flex-1 px-4 py-2.5 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition min-h-[44px] cursor-pointer shadow-md"
            >
              Verify
            </button>
          </form>

          {/* Search Result Output */}
          {searchedPass === undefined && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 backdrop-blur-md text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>No exeat pass record found matching <strong>"{searchQuery}"</strong>. Please verify the Pass ID or Matric Number.</span>
            </div>
          )}

          {searchedPass && (
            <div className="mt-4 p-4 rounded-xl glass-card border-indigo-500/30 dark:border-indigo-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{searchedPass.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                      searchedPass.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        : searchedPass.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                        : searchedPass.status === 'Checked Out'
                        ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30'
                        : 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    {searchedPass.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">
                  {searchedPass.studentName} ({searchedPass.matricNo}) &bull; {searchedPass.hallName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Type: {searchedPass.type} Exeat | Destination: {searchedPass.destination}
                </p>
              </div>

              <button
                onClick={() => onSwitchView('student')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Primary Portal Direct Action Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Access CRU-CS Modules</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Select your designated portal role to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div
            onClick={() => onSwitchView('student')}
            className="glass-card p-5 sm:p-6 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 bg-indigo-500/15 dark:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all backdrop-blur-md">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Student Exeat Portal</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Submit new exeat clearance requests, monitor approval status in real-time, and download official CRU-CS QR gate passes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Enter Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onSwitchView('admin')}
            className="glass-card p-5 sm:p-6 rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 bg-purple-500/15 dark:bg-purple-500/25 border border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all backdrop-blur-md">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Admin & Hall Master Console</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Review student exeat applications, evaluate reasons, sign authorization credentials, and approve digital passes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Access Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onSwitchView('gate')}
            className="glass-card p-5 sm:p-6 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all backdrop-blur-md">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">CRU Gate Security Desk</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Sub-second QR gate scanner for security staff at Crawford University main gates to verify student departures and entry logs.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Launch Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 pb-12 sm:pb-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Institutional Security & Efficiency Engine</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Designed for Crawford University Hall Masters, Student Affairs, and Campus Gate Security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-3 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/15 dark:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-xl font-bold backdrop-blur-md">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Zero Physical Queues</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Students request, track, and receive exeat approvals directly from their mobile devices without visiting Student Affairs.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant request submission</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Real-time status updates</li>
            </ul>
          </div>

          <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-3 hover:border-emerald-400/60 dark:hover:border-emerald-500/60 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold backdrop-blur-md">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Dynamic CRU QR Tokens</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Cryptographically linked gate tokens generated instantly upon full departmental approval for unforgeable exit validation.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> High-contrast QR token</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tamper-proof Pass ID</li>
            </ul>
          </div>

          <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-3 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-xl font-bold backdrop-blur-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Auditable Gate Logs</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sub-second gate verification scanner giving security personnel clear departure authorization and automatic timestamp recording.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant security desk verification</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Complete student exit & entry audit log</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Exeat Protocol & Policy Guidelines */}
      <section className="glass-panel border-t border-white/50 dark:border-slate-800/60 py-10 sm:py-12 px-4 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Crawford University Exeat Guidelines & Policy Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Day Exeat Rules</span>
              </div>
              <p className="leading-relaxed">
                Day exeats are granted for essential errands within Igbesa and environs. Departure allowed from 08:00 AM and return curfew is strictly 06:00 PM on the same day.
              </p>
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Weekend & Home Exeats</span>
              </div>
              <p className="leading-relaxed">
                Requires parental consent verification and Hall Master recommendation. Passes valid for specified departure and return dates recorded on your digital QR pass.
              </p>
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Gate Clearance Verification</span>
              </div>
              <p className="leading-relaxed">
                Present your digital QR pass at the main campus gate. Crawford Security officers scan and log departure/arrival timestamps directly into the institutional audit register.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
