import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExeatPass, StudentUser } from '../types';
import { Send, QrCode, FileText, CheckCircle2, Clock, XCircle, Calendar, User, Building, ExternalLink, Search, Download, Edit3, List, Phone, Users, Paperclip, UploadCloud, FileCheck, Trash2, GraduationCap, BookOpen, LogIn, LogOut, Filter } from 'lucide-react';

interface StudentPortalViewProps {
  passes: ExeatPass[];
  currentUser?: StudentUser | null;
  onSubmitRequest: (newPass: Omit<ExeatPass, 'id' | 'status' | 'createdAt'>) => void;
  onSelectPass: (pass: ExeatPass) => void;
  onNavigateToAuth?: () => void;
  onLogout?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  passes,
  currentUser,
  onSubmitRequest,
  onSelectPass,
  onNavigateToAuth,
  onLogout,
}) => {
  const [studentName, setStudentName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [hallName, setHallName] = useState('Faith Hall');
  const [isCustomHall, setIsCustomHall] = useState(false);
  const [customHallName, setCustomHallName] = useState('');
  const [reason, setReason] = useState('');
  const [depDate, setDepDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [letterNote, setLetterNote] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentData, setAttachmentData] = useState('');
  const [letterMode, setLetterMode] = useState<'write' | 'upload'>('write');
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Approved' | 'Pending' | 'Declined'>('ALL');
  const [myRequestsOnly, setMyRequestsOnly] = useState(!!currentUser);

  // Sync state with logged in student user
  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.studentName || '');
      setMatricNo(currentUser.matricNo || '');
      setStudentPhone(currentUser.studentPhone || '');
      setParentPhone(currentUser.parentPhone || '');
      if (currentUser.hallName) {
        setHallName(currentUser.hallName);
      }
      setMyRequestsOnly(true);
    }
  }, [currentUser]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHallName = isCustomHall ? customHallName.trim() : hallName;
    if (!studentName || !matricNo || !reason || !depDate || !finalHallName) return;

    onSubmitRequest({
      studentName,
      matricNo,
      level: currentUser?.level,
      courseOfStudy: currentUser?.courseOfStudy,
      hallName: finalHallName,
      studentPhone: studentPhone.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined,
      reason,
      depDate,
      returnDate: returnDate || undefined,
      letterNote: letterNote.trim() || undefined,
      attachmentName: attachmentName || undefined,
      attachmentData: attachmentData || undefined,
    });

    // Reset Form (keep logged-in user info)
    if (currentUser) {
      setStudentName(currentUser.studentName);
      setMatricNo(currentUser.matricNo);
      setStudentPhone(currentUser.studentPhone || '');
      setParentPhone(currentUser.parentPhone || '');
    } else {
      setStudentName('');
      setMatricNo('');
      setStudentPhone('');
      setParentPhone('');
    }
    setReason('');
    setDepDate('');
    setReturnDate('');
    setLetterNote('');
    setAttachmentName('');
    setAttachmentData('');
  };

  const filteredPasses = passes.filter((p) => {
    // If filtering by "My Requests Only" when user is logged in
    if (myRequestsOnly && currentUser) {
      if (p.matricNo.toLowerCase() !== currentUser.matricNo.toLowerCase()) {
        return false;
      }
    }

    const matchesSearch =
      p.studentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.matricNo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full space-y-6">
      {/* Header Banner */}
      <div className="glass-panel bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-indigo-900/90 text-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-400/30">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-xl p-1 shrink-0 flex items-center justify-center shadow-md border border-white/40 backdrop-blur-md">
            <img src="/assets/cu-logo.webp" alt="Crawford University Official Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">CRU Student Exeat Portal</h2>
            <p className="text-xs text-indigo-200 dark:text-indigo-300 mt-0.5 sm:mt-1">
              Submit clearance requests & obtain instant verified digital gate passes upon Hall Master & Student Affairs approval.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-indigo-400/30 text-xs font-medium text-indigo-100 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Queue-Free Digital Processing</span>
        </div>
      </div>

      {/* Authenticated User Status Banner / Guest Prompt */}
      {currentUser ? (
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{currentUser.studentName}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-lg">
                  Matric: {currentUser.matricNo}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.level}</span> &bull; {currentUser.courseOfStudy} &bull; <span className="font-medium">{currentUser.hallName || 'Faith Hall'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onNavigateToAuth}
              className="px-3 py-1.5 bg-white/60 dark:bg-slate-800/80 hover:bg-white text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[36px]"
            >
              My Profile
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">Student Account Sign In / Sign Up Available</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sign up with your matric number, level, and course of study to auto-fill exeat requests instantly.</p>
            </div>
          </div>

          <button
            onClick={onNavigateToAuth}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-md text-xs flex items-center gap-1.5 cursor-pointer min-h-[38px] shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Sign Up</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left: Exeat Request Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl sticky top-20 sm:top-24 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
              <FileText className="w-5 h-5" />
              <h3 className="text-base sm:text-lg text-slate-900 dark:text-white">New Exeat Request</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submit your exeat routing details for departmental clearance.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  placeholder="e.g. Samuel Araoyinbo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Matric Number</label>
                <input
                  type="text"
                  required
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  placeholder="e.g. 210101001"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-indigo-500" /> Hall of Residence
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomHall(!isCustomHall);
                      if (!isCustomHall && !customHallName) {
                        setCustomHallName('');
                      }
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {isCustomHall ? (
                      <>
                        <List className="w-3 h-3" /> Select Standard Hall
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3 h-3" /> Type Custom Hall
                      </>
                    )}
                  </button>
                </div>

                {isCustomHall ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={customHallName}
                      onChange={(e) => setCustomHallName(e.target.value)}
                      className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                      placeholder="e.g. Paul Hall, Daniel Hall, Off-Campus, etc."
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Enter your official hall or residence name.</p>
                  </div>
                ) : (
                  <select
                    value={hallName}
                    onChange={(e) => {
                      if (e.target.value === 'OTHER_CUSTOM') {
                        setIsCustomHall(true);
                      } else {
                        setHallName(e.target.value);
                      }
                    }}
                    className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  >
                    <option value="Faith Hall" className="dark:bg-slate-900">Faith Hall (Male)</option>
                    <option value="Grace Hall" className="dark:bg-slate-900">Grace Hall (Female)</option>
                    <option value="Hope Hall" className="dark:bg-slate-900">Hope Hall (Male)</option>
                    <option value="Joy Hall" className="dark:bg-slate-900">Joy Hall (Female)</option>
                    <option value="Peace Hall" className="dark:bg-slate-900">Peace Hall (Male)</option>
                    <option value="OTHER_CUSTOM" className="dark:bg-slate-900">+ Type Other / Custom Hall Name...</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-indigo-500" /> Student Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                    placeholder="e.g. 08012345678"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-500" /> Parent Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                    placeholder="e.g. 08029876543"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Reason for Exeat</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  placeholder="e.g. Medical Appointment"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> Departure
                  </label>
                  <input
                    type="date"
                    required
                    value={depDate}
                    onChange={(e) => setDepDate(e.target.value)}
                    className="glass-input w-full px-2.5 py-2 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Expected Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="glass-input w-full px-2.5 py-2 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  />
                </div>
              </div>

              {/* Exeat Letter & Supporting Document Attachment Section */}
              <div className="border border-white/40 dark:border-slate-800 rounded-xl p-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/50 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-500" /> Exeat Letter & Document
                  </span>
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setLetterMode('write')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                        letterMode === 'write'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                      }`}
                    >
                      Write Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => setLetterMode('upload')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                        letterMode === 'upload'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                      }`}
                    >
                      Upload Document
                    </button>
                  </div>
                </div>

                {letterMode === 'write' ? (
                  <div>
                    <textarea
                      rows={3}
                      value={letterNote}
                      onChange={(e) => setLetterNote(e.target.value)}
                      placeholder="Write an explanation letter / note to Hall Master & Student Affairs..."
                      className="glass-input w-full px-3 py-2 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Formal explanation for clearance consideration.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {!attachmentName ? (
                      <label className="border-2 border-dashed border-indigo-400/40 dark:border-indigo-500/40 hover:border-indigo-500 rounded-xl p-3 text-center block cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition">
                        <UploadCloud className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Click to upload letter/document</span>
                        <span className="text-[10px] text-slate-400 block">PDF, Image, or DOC (Max 5MB)</span>
                        <input type="file" accept=".pdf,image/*,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-indigo-500/15 border border-indigo-500/30 backdrop-blur-md rounded-xl text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{attachmentName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachmentName('');
                            setAttachmentData('');
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition cursor-pointer shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Exeat Request</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active Requests & Dynamic Digital Pass Tokens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/40 dark:border-slate-800/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  My Exeat Passes & Digital Gate Tokens
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your official Crawford University digital exeat clearance passes.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setMyRequestsOnly(!myRequestsOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] border ${
                      myRequestsOnly
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-white/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-white'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{myRequestsOnly ? 'My Passes' : 'All Student Passes'}</span>
                  </button>
                )}

                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pass ID..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="glass-input pl-8 pr-3 py-2 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-40 min-h-[38px]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="glass-input px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 font-medium min-h-[38px]"
                >
                  <option value="ALL" className="dark:bg-slate-900">All Status</option>
                  <option value="Approved" className="dark:bg-slate-900">Approved</option>
                  <option value="Pending" className="dark:bg-slate-900">Pending</option>
                  <option value="Declined" className="dark:bg-slate-900">Declined</option>
                </select>
              </div>
            </div>

            {/* Passes List */}
            {filteredPasses.length === 0 ? (
              <div className="p-6 sm:p-8 text-center bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700/80">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No exeat passes found matching criteria.</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Fill out the request form on the left to generate your pass.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPasses.map((pass) => {
                  const isApproved = pass.status === 'Approved';
                  const isPending = pass.status === 'Pending';
                  const isDeclined = pass.status === 'Declined';

                  return (
                    <div
                      key={pass.id}
                      className={`p-4 sm:p-5 border rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md ${
                        isApproved
                          ? 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20'
                          : isPending
                          ? 'border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20'
                          : 'border-red-500/30 bg-red-500/10 dark:bg-red-950/20'
                      }`}
                    >
                      <div className="space-y-2 text-center sm:text-left flex-1 w-full">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          {isApproved && (
                            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 backdrop-blur-md">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {isPending && (
                            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-1 backdrop-blur-md">
                              <Clock className="w-3 h-3" /> Pending Approval
                            </span>
                          )}
                          {isDeclined && (
                            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-red-500/20 border border-red-500/30 text-red-800 dark:text-red-300 flex items-center gap-1 backdrop-blur-md">
                              <XCircle className="w-3 h-3" /> Declined
                            </span>
                          )}
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-500/15 border border-slate-500/20 rounded-lg text-slate-700 dark:text-slate-300 backdrop-blur-md">
                            {pass.id}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{pass.studentName}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">{pass.matricNo} &bull; {pass.hallName}</p>
                          {(pass.studentPhone || pass.parentPhone) && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              {pass.studentPhone && <span>Student: {pass.studentPhone}</span>}
                              {pass.studentPhone && pass.parentPhone && <span> &bull; </span>}
                              {pass.parentPhone && <span>Parent: {pass.parentPhone}</span>}
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                          <p><span className="font-semibold text-slate-700 dark:text-slate-200">Reason:</span> {pass.reason}</p>
                          <p><span className="font-semibold text-slate-700 dark:text-slate-200">Departure:</span> {pass.depDate} {pass.returnDate ? ` (Return: ${pass.returnDate})` : ''}</p>
                          {pass.letterNote && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-white/50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mt-1 backdrop-blur-sm">
                              &ldquo;{pass.letterNote}&rdquo;
                            </p>
                          )}
                          {pass.attachmentName && (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                              <Paperclip className="w-3 h-3" /> Attached Letter: <span className="underline">{pass.attachmentName}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-1">
                          <button
                            onClick={() => onSelectPass(pass)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer p-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Digital Pass</span>
                          </button>
                          <button
                            onClick={() => onSelectPass(pass)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-950/60 hover:bg-emerald-500/25 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition cursor-pointer min-h-[36px] backdrop-blur-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Pass</span>
                          </button>
                        </div>
                      </div>

                      {/* QR Token Container */}
                      <div className="flex flex-col items-center justify-center p-3 bg-white/95 dark:bg-white rounded-xl border border-white/60 shadow-md shrink-0 w-full sm:w-auto backdrop-blur-md">
                        <QRCodeSVG value={pass.id} size={88} level="M" />
                        <span className="text-[10px] font-mono text-slate-800 mt-1.5 font-extrabold tracking-tight">
                          GATE TOKEN
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
