import React, { useState, useEffect } from 'react';
import { ExeatPass } from '../types';
import { CheckCircle2, XCircle, Search, Filter, ShieldCheck, Eye, Trash2, RefreshCw, AlertTriangle, Check, Save, Phone, Paperclip, FileText, Users } from 'lucide-react';

interface AdminConsoleViewProps {
  passes: ExeatPass[];
  signingOfficer: string;
  onUpdateSigningOfficer: (newName: string) => void;
  onUpdateStatus: (passId: string, newStatus: ExeatPass['status'], approvedBy?: string) => void;
  onSelectPass: (pass: ExeatPass) => void;
  onDeletePass?: (passId: string) => void;
  onClearAllData?: () => void;
  onRestoreSampleData?: () => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  passes,
  signingOfficer,
  onUpdateSigningOfficer,
  onUpdateStatus,
  onSelectPass,
  onDeletePass,
  onClearAllData,
  onRestoreSampleData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hallFilter, setHallFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Declined'>('ALL');
  const [officerInput, setOfficerInput] = useState(signingOfficer);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  useEffect(() => {
    setOfficerInput(signingOfficer);
  }, [signingOfficer]);

  const handleSaveOfficer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!officerInput.trim()) return;
    onUpdateSigningOfficer(officerInput.trim());
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  const pendingCount = passes.filter((p) => p.status === 'Pending').length;
  const approvedCount = passes.filter((p) => p.status === 'Approved').length;
  const declinedCount = passes.filter((p) => p.status === 'Declined').length;

  const defaultHalls = ['Faith Hall', 'Grace Hall', 'Hope Hall', 'Joy Hall', 'Peace Hall'];
  const allHalls = Array.from(
    new Set([...defaultHalls, ...passes.map((p) => p.hallName).filter(Boolean)])
  );

  const filteredPasses = passes.filter((pass) => {
    const matchesSearch =
      pass.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHall = hallFilter === 'ALL' || pass.hallName === hallFilter;
    const matchesStatus = statusFilter === 'ALL' || pass.status === statusFilter;

    return matchesSearch && matchesHall && matchesStatus;
  });

  const handleConfirmClear = () => {
    if (onClearAllData) {
      onClearAllData();
    }
    setShowClearConfirmModal(false);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full space-y-6">
      {/* Header & Stats Cards */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-xl p-1 border border-white/40 shadow-sm shrink-0 flex items-center justify-center backdrop-blur-md">
            <img src="/assets/cu-logo.webp" alt="Crawford University Official Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">CRU-CS Student Affairs Console</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review, evaluate, and clear student departmental exeat routing requests with real-time digital pass authorization.
            </p>
          </div>
        </div>

        {/* Controls Header */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Signing Officer Config Form */}
          <form onSubmit={handleSaveOfficer} className="flex flex-wrap items-center gap-1.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-white/30 dark:border-slate-700/60 text-xs flex-1 sm:flex-none">
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0 pl-1">Signing Officer:</span>
            <input
              type="text"
              value={officerInput}
              onChange={(e) => {
                setOfficerInput(e.target.value);
                onUpdateSigningOfficer(e.target.value);
              }}
              className="glass-input text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 font-semibold outline-none focus:ring-2 focus:ring-indigo-500 text-xs flex-1 sm:w-52 min-h-[36px]"
              placeholder="e.g. Dr. O. A. Student Affairs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold text-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1 shrink-0 cursor-pointer min-h-[36px]"
              title="Save Signing Officer Name"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            {showSavedFeedback && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in shrink-0 flex items-center gap-1 px-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </form>

          {onClearAllData && passes.length > 0 && (
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="px-3.5 py-2 bg-red-500/15 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-500/25 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[38px] backdrop-blur-md"
              title="Clear all stored exeat pass records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {onRestoreSampleData && passes.length === 0 && (
            <button
              onClick={onRestoreSampleData}
              className="px-3.5 py-2 bg-indigo-500/15 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[38px] backdrop-blur-md"
              title="Load initial sample exeat passes"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase block">Pending Clearance</span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-900 dark:text-amber-200">{pendingCount}</span>
        </div>
        <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase block">Approved Passes</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">{approvedCount}</span>
        </div>
        <div className="bg-red-500/10 dark:bg-red-950/30 border border-red-500/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold text-red-700 dark:text-red-400 uppercase block">Declined Requests</span>
          <span className="text-xl sm:text-2xl font-extrabold text-red-900 dark:text-red-200">{declinedCount}</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase block">Total System Passes</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{passes.length}</span>
        </div>
      </div>

      {/* Main Console Container */}
      <div className="glass-card rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search student, matric, pass ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 min-h-[38px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 glass-input px-2.5 py-1.5 rounded-xl text-xs flex-1 sm:flex-none">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={hallFilter}
                onChange={(e) => setHallFilter(e.target.value)}
                className="bg-transparent outline-none font-medium text-slate-700 dark:text-slate-200 w-full"
              >
                <option value="ALL" className="dark:bg-slate-900">All Halls</option>
                {allHalls.map((hall) => (
                  <option key={hall} value={hall} className="dark:bg-slate-900">
                    {hall}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 glass-input px-2.5 py-1.5 rounded-xl text-xs flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent outline-none font-medium text-slate-700 dark:text-slate-200 w-full"
              >
                <option value="ALL" className="dark:bg-slate-900">All Statuses</option>
                <option value="Pending" className="dark:bg-slate-900">Pending Only</option>
                <option value="Approved" className="dark:bg-slate-900">Approved Only</option>
                <option value="Declined" className="dark:bg-slate-900">Declined Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile View: Card List (Visible on mobile screens) */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredPasses.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs space-y-3">
              <p>No exeat records matching current query or filters.</p>
              {onRestoreSampleData && (
                <button
                  onClick={onRestoreSampleData}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Sample Data</span>
                </button>
              )}
            </div>
          ) : (
            filteredPasses.map((pass) => {
              const isApproved = pass.status === 'Approved';
              const isPending = pass.status === 'Pending';

              return (
                <div key={pass.id} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                      {pass.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        isApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : isPending
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pass.studentName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{pass.matricNo} &bull; {pass.hallName}</p>
                    
                    {(pass.studentPhone || pass.parentPhone) && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mt-1 space-y-0.5">
                        {pass.studentPhone && <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-indigo-500" /> Student: {pass.studentPhone}</p>}
                        {pass.parentPhone && <p className="flex items-center gap-1"><Users className="w-3 h-3 text-indigo-500" /> Parent: {pass.parentPhone}</p>}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1"><span className="font-semibold">Reason:</span> {pass.reason}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Dep: {pass.depDate} {pass.returnDate ? `| Ret: ${pass.returnDate}` : ''}</p>
                    
                    {pass.letterNote && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-slate-100/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50 mt-1">
                        &ldquo;{pass.letterNote}&rdquo;
                      </p>
                    )}
                    {pass.attachmentName && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                        <Paperclip className="w-3 h-3" /> Letter Attached: <span className="underline">{pass.attachmentName}</span>
                      </div>
                    )}

                    {pass.approvedBy && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                        Signed by: {pass.approvedBy}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onSelectPass(pass)}
                      className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center min-h-[40px]"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onUpdateStatus(pass.id, 'Approved', officerInput || signingOfficer)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer min-h-[40px] ${
                        isApproved
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(pass.id, 'Declined')}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer min-h-[40px]"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>

                    {onDeletePass && (
                      <button
                        onClick={() => onDeletePass(pass.id)}
                        className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center min-h-[40px]"
                        title="Delete Exeat Pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Table (Visible on tablet & desktop screens) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">Pass ID</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Hall</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Departure Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    <p>No exeat records matching current query or filters.</p>
                    {onRestoreSampleData && (
                      <button
                        onClick={onRestoreSampleData}
                        className="mt-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Load Sample Exeat Passes</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredPasses.map((pass) => {
                  const isApproved = pass.status === 'Approved';
                  const isPending = pass.status === 'Pending';

                  return (
                    <tr key={pass.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
                          {pass.id}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{pass.studentName}</div>
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{pass.matricNo}</div>
                        {(pass.studentPhone || pass.parentPhone) && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 space-y-0.5">
                            {pass.studentPhone && <div>Std: {pass.studentPhone}</div>}
                            {pass.parentPhone && <div>Par: {pass.parentPhone}</div>}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 text-xs font-medium">{pass.hallName}</td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 text-xs max-w-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{pass.reason}</div>
                        {pass.letterNote && (
                          <div className="text-[10px] italic text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5" title={pass.letterNote}>
                            &ldquo;{pass.letterNote}&rdquo;
                          </div>
                        )}
                        {pass.attachmentName && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            <Paperclip className="w-3 h-3" /> {pass.attachmentName}
                          </div>
                        )}
                        {pass.approvedBy && (
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            Signed: {pass.approvedBy}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 text-xs font-mono">
                        {pass.depDate}
                        {pass.returnDate && <span className="block text-[10px] text-slate-400">Ret: {pass.returnDate}</span>}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full inline-block ${
                            isApproved
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : isPending
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {pass.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPass(pass)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                            title="View Pass Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onUpdateStatus(pass.id, 'Approved', officerInput || signingOfficer)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer min-h-[36px] ${
                              isApproved
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-sm'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => onUpdateStatus(pass.id, 'Declined')}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer min-h-[36px]"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>

                          {onDeletePass && (
                            <button
                              onClick={() => onDeletePass(pass.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded transition cursor-pointer"
                              title="Delete Exeat Pass"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/40 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-base sm:text-lg">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 backdrop-blur-md">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3>Clear All Exeat Records?</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently clear all <strong>{passes.length}</strong> exeat passes and gate security logs? This action will reset system storage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-500/15 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-500/25 transition cursor-pointer min-h-[40px] border border-slate-500/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/20 cursor-pointer min-h-[40px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Clear All Records</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
