import React, { useState } from 'react';
import { ExeatPass, GateLog } from '../types';
import { QrCode, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Camera, UserCheck, Clock } from 'lucide-react';

interface GateScannerViewProps {
  passes: ExeatPass[];
  gateLogs: GateLog[];
  onLogGateAction: (pass: ExeatPass, action: 'CHECK_OUT' | 'CHECK_IN') => void;
}

export const GateScannerView: React.FC<GateScannerViewProps> = ({ passes, gateLogs, onLogGateAction }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    pass?: ExeatPass;
    found: boolean;
    statusText?: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  const handleVerify = (idToVerify?: string) => {
    const query = (idToVerify || tokenInput).trim();
    if (!query) return;

    const matchedPass = passes.find((p) => p.id.toLowerCase() === query.toLowerCase());

    if (!matchedPass) {
      setScanResult({
        found: false,
        statusText: `No active exeat pass found matching Token ID: ${query}`,
      });
      return;
    }

    setScanResult({
      found: true,
      pass: matchedPass,
    });
  };

  const handleSimulateCameraScan = (passId: string) => {
    setIsScanning(true);
    setTokenInput(passId);
    setTimeout(() => {
      setIsScanning(false);
      handleVerify(passId);
    }, 600);
  };

  const activeApprovedPasses = passes.filter((p) => p.status === 'Approved');

  return (
    <div className="flex-1 max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
      {/* Security Gate Banner */}
      <div className="glass-panel bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-indigo-950/90 text-white p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-xl flex items-center justify-center p-1 border border-white/40 shadow-sm shrink-0 backdrop-blur-md">
            <img src="/assets/cu-logo.webp" alt="Crawford University Official Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Security Gate Scanner Desk</h2>
            <p className="text-xs text-slate-300 mt-0.5">CRU-CS Gate Validation & Real-time Departure Verification</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sub-second Verification Active</span>
        </div>
      </div>

      {/* Main Scanner Box */}
      <div className="glass-card p-5 sm:p-8 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl text-center space-y-5 sm:space-y-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-md backdrop-blur-md">
          <QrCode className={`w-7 h-7 sm:w-8 sm:h-8 ${isScanning ? 'animate-pulse text-indigo-500' : ''}`} />
        </div>

        <div>
          <h3 className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">Scan or Enter Student Gate Token</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter student pass token ID or select from active approved queue to verify authorization.</p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="glass-input flex-1 px-4 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase tracking-wider min-h-[44px]"
            placeholder="e.g. CRU-CS-8921"
          />
          <button
            onClick={() => handleVerify()}
            className="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Pass</span>
          </button>
        </div>

        {/* Quick Sample Click Buttons for Gate Officer Convenience */}
        {activeApprovedPasses.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
              Active Approved Tokens at Gate:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {activeApprovedPasses.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSimulateCameraScan(p.id)}
                  className="px-2.5 py-1.5 bg-white/40 dark:bg-slate-800/60 hover:bg-indigo-500/20 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 text-xs font-mono rounded-xl border border-slate-300/60 dark:border-slate-700/80 transition flex items-center gap-1 cursor-pointer min-h-[36px] backdrop-blur-md"
                >
                  <Camera className="w-3 h-3 text-slate-400" />
                  <span>{p.id}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">({p.studentName.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scan Result Container */}
        {scanResult && (
          <div className="mt-6 text-left transition-all">
            {!scanResult.found ? (
              <div className="p-4 sm:p-5 rounded-2xl border border-red-500/30 bg-red-500/10 dark:bg-red-950/40 text-red-900 dark:text-red-200 space-y-1 backdrop-blur-md">
                <div className="font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Invalid Token</span>
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">{scanResult.statusText}</div>
              </div>
            ) : scanResult.pass?.status === 'Approved' ? (
              <div className="p-4 sm:p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 space-y-3 shadow-md backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-base sm:text-lg text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Departure Authorized</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                    {scanResult.pass.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{scanResult.pass.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Matriculation No</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{scanResult.pass.matricNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Hall of Residence</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{scanResult.pass.hallName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Authorized Departure</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{scanResult.pass.depDate}</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold">Reason:</span> {scanResult.pass.reason}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-center sm:text-left backdrop-blur-md">
                    Cleared by Student Affairs & CRU Security
                  </span>

                  <button
                    onClick={() => {
                      onLogGateAction(scanResult.pass!, 'CHECK_OUT');
                      setScanResult((prev) =>
                        prev ? { ...prev, statusText: 'Gate checkout recorded successfully!' } : null
                      );
                    }}
                    className="px-4 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Confirm Gate Exit Log</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 space-y-2 backdrop-blur-md">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Departure Denied</span>
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-300">
                  Pass ID <strong>{scanResult.pass?.id}</strong> for <strong>{scanResult.pass?.studentName}</strong> is currently{' '}
                  <strong className="uppercase">{scanResult.pass?.status}</strong>. Official Student Affairs clearance required prior to exit.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gate Audit Logs */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Recent Gate Audit Log</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{gateLogs.length} Entries Recorded</span>
        </div>

        {gateLogs.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No gate actions recorded in current session.</p>
        ) : (
          <div className="space-y-2">
            {gateLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/60 text-xs backdrop-blur-md"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {log.studentName} ({log.matricNo})
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    Pass: {log.passId} &bull; {log.hallName}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold uppercase rounded-lg text-[10px]">
                    {log.action}
                  </span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
