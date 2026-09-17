import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { ExeatPass } from '../types';
import { Shield, X, Printer, Download, CheckCircle2, Clock, Loader2, Phone, Users, Paperclip, FileText, QrCode, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';

interface PassDetailModalProps {
  pass: ExeatPass | null;
  onClose: () => void;
}

export const PassDetailModal: React.FC<PassDetailModalProps> = ({ pass, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!pass) return null;

  const isApproved = pass.status === 'Approved';

  const handleCopyPassId = () => {
    navigator.clipboard.writeText(pass.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById('printablePass');
    if (!element) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `CRU-CS-CLEAR-${pass.id}-${pass.studentName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download pass image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/40 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header Bar */}
        <div className="bg-slate-950/90 text-white p-4 px-5 sm:px-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">Official Crawford University Exeat Pass</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div id="printablePass" className="p-4 sm:p-6 space-y-5 sm:space-y-6 relative bg-gradient-to-b from-indigo-50/40 via-white to-indigo-50/20 dark:from-slate-900 dark:to-slate-900">
          {/* Institutional Header */}
          <div className="text-center border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 flex items-center justify-center mx-auto mb-2 shadow-sm border border-white/50 dark:border-slate-700 rounded-2xl overflow-hidden p-1 backdrop-blur-md">
              <img
                src="/assets/cu-logo.webp"
                alt="Crawford University Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">CRAWFORD UNIVERSITY</h2>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Directorate of Student Affairs & Hall Operations
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Automated Clearance & Gate Token</p>
          </div>

          {/* Status Badge & Pass ID */}
          <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Pass Serial ID</span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-indigo-700 dark:text-indigo-400">{pass.id}</span>
            </div>
            <div>
              <span
                className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full flex items-center gap-1 backdrop-blur-md ${
                  isApproved
                    ? 'bg-emerald-500/20 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                }`}
              >
                {isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {pass.status}
              </span>
            </div>
          </div>

          {/* Student Info Details */}
          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm space-y-3 text-xs backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Student Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{pass.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Matriculation No</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{pass.matricNo}</span>
              </div>
            </div>

            {(pass.studentPhone || pass.parentPhone) && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700 font-mono">
                {pass.studentPhone && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-indigo-500" /> Student Phone
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{pass.studentPhone}</span>
                  </div>
                )}
                {pass.parentPhone && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-500" /> Parent Phone
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{pass.parentPhone}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Hall of Residence</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{pass.hallName}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Departure Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{pass.depDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Reason for Exeat</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{pass.reason}</span>
            </div>

            {pass.returnDate && (
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Expected Return Date</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{pass.returnDate}</span>
              </div>
            )}

            {(pass.letterNote || pass.attachmentName) && (
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700 space-y-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-500" /> Attached Letter & Remarks
                </span>
                {pass.letterNote && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                    &ldquo;{pass.letterNote}&rdquo;
                  </p>
                )}
                {pass.attachmentName && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-500/15 dark:bg-indigo-950/60 p-2 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Supporting Document: {pass.attachmentName}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QR Token Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-md space-y-3 text-center backdrop-blur-md">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-500" />
                <span>Gate Scan Token QR</span>
              </span>
              {isApproved ? (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Active Gate Code
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" /> Pending Approval
                </span>
              )}
            </div>

            <div className={`p-3 bg-white rounded-xl border ${isApproved ? 'border-emerald-300 shadow-sm ring-2 ring-emerald-500/20' : 'border-slate-200'} transition-all`}>
              <QRCodeSVG
                value={pass.id}
                size={140}
                level="H"
                includeMargin={true}
                imageSettings={isApproved ? {
                  src: "/assets/cu-logo.webp",
                  x: undefined,
                  y: undefined,
                  height: 28,
                  width: 28,
                  excavate: true,
                } : undefined}
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono w-full justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">{pass.id}</span>
              <button
                type="button"
                onClick={handleCopyPassId}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-sans font-semibold flex items-center gap-1 text-[11px] transition cursor-pointer"
                title="Copy Pass Serial ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 max-w-xs">
              {isApproved
                ? 'Present this high-density QR code at the Crawford University Main Gate Scanner for instant clearance.'
                : 'QR Token generated in preview mode. Gate clearance activates automatically upon Student Affairs approval.'}
            </p>
          </div>

          {/* Authorization Footer */}
          <div className="text-center text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-3 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Authorized by: {pass.approvedBy || 'Student Affairs Operational Desk'}
            </p>
            <p className="text-slate-400 dark:text-slate-500">
              This digital pass is cryptographically validated and non-transferable.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3 sm:p-4 border-t border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer min-h-[44px] flex items-center justify-center backdrop-blur-md"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download Image Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
