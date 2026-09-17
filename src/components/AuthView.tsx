import React, { useState } from 'react';
import { StudentUser } from '../types';
import { User, LogIn, UserPlus, GraduationCap, BookOpen, Key, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Phone, Building, Sparkles, LogOut } from 'lucide-react';

interface AuthViewProps {
  users: StudentUser[];
  currentUser: StudentUser | null;
  onSignUp: (newUser: StudentUser) => void;
  onLogin: (matricNo: string, password: string) => boolean;
  onLogout: () => void;
  onNavigateToPortal: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  users,
  currentUser,
  onSignUp,
  onLogin,
  onLogout,
  onNavigateToPortal,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpMatric, setSignUpMatric] = useState('');
  const [signUpLevel, setSignUpLevel] = useState('300 Level');
  const [signUpCourse, setSignUpCourse] = useState('B.Sc. Computer Science');
  const [customCourse, setCustomCourse] = useState('');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [signUpHall, setSignUpHall] = useState('Faith Hall');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpParentPhone, setSignUpParentPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Login Form States
  const [loginMatric, setLoginMatric] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanMatric = signUpMatric.trim();
    if (!signUpName.trim() || !cleanMatric || !signUpPassword) {
      setErrorMessage('Please fill in all required fields (Name, Matric Number, and Password).');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Check if Matric No already exists
    const existing = users.find((u) => u.matricNo.toLowerCase() === cleanMatric.toLowerCase());
    if (existing) {
      setErrorMessage(`Matric Number ${cleanMatric} is already registered. Please log in instead.`);
      return;
    }

    const finalCourse = isCustomCourse ? customCourse.trim() : signUpCourse;

    const newUser: StudentUser = {
      id: `USER-${cleanMatric}`,
      studentName: signUpName.trim(),
      matricNo: cleanMatric,
      level: signUpLevel,
      courseOfStudy: finalCourse || 'General Studies',
      hallName: signUpHall,
      studentPhone: signUpPhone.trim() || undefined,
      parentPhone: signUpParentPhone.trim() || undefined,
      password: signUpPassword,
      createdAt: new Date().toISOString(),
    };

    onSignUp(newUser);
    setSuccessMessage(`Account created successfully for ${newUser.studentName}! Redirecting to Student Exeat Portal...`);
    setTimeout(() => {
      onNavigateToPortal();
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginMatric.trim() || !loginPassword) {
      setErrorMessage('Please enter both your Matric Number and Password.');
      return;
    }

    const success = onLogin(loginMatric.trim(), loginPassword);
    if (success) {
      setSuccessMessage('Authentication successful! Welcome back.');
      setTimeout(() => {
        onNavigateToPortal();
      }, 800);
    } else {
      setErrorMessage('Invalid Matric Number or Password. Please check your credentials or try quick demo login below.');
    }
  };

  const handleQuickDemoLogin = (user: StudentUser) => {
    setLoginMatric(user.matricNo);
    setLoginPassword(user.password || 'password123');
    onLogin(user.matricNo, user.password || 'password123');
    setSuccessMessage(`Logged in as ${user.studentName}`);
    setTimeout(() => {
      onNavigateToPortal();
    }, 800);
  };

  // If already logged in, show user profile card
  if (currentUser) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 w-full space-y-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-lg backdrop-blur-md">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Authenticated Student Profile
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentUser.studentName}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Matric No: {currentUser.matricNo}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs backdrop-blur-md">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase block text-[10px]">Academic Level</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentUser.level}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase block text-[10px]">Course of Study</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentUser.courseOfStudy}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase block text-[10px]">Hall of Residence</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentUser.hallName || 'Not Specified'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToPortal}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20 text-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            >
              <span>Proceed to Exeat Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-5 py-3 bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border border-red-500/30 font-semibold rounded-2xl transition text-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer backdrop-blur-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12 w-full space-y-6">
      {/* Header Banner */}
      <div className="glass-panel bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-indigo-900/90 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-3 border border-indigo-400/30">
        <div className="w-12 h-12 bg-white/95 rounded-2xl p-1 mx-auto flex items-center justify-center shadow-md border border-white/40 backdrop-blur-md">
          <img src="/assets/cu-logo.webp" alt="Crawford University Official Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">CRU Student Account Portal</h2>
        <p className="text-xs sm:text-sm text-indigo-200 max-w-md mx-auto">
          Sign up with your academic details or sign in to automate exeat requests and access your digital gate pass token history.
        </p>

        {/* Tab Switcher */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex p-1 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                authMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account (Sign Up)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                authMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Login)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/40 dark:border-slate-800/80 shadow-2xl space-y-6">
        {authMode === 'signup' ? (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <span>Student Academic Registration</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 1</span>
            </div>

            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="e.g. Samuel Araoyinbo"
                className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
              />
            </div>

            {/* Matriculation Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Matriculation Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={signUpMatric}
                onChange={(e) => setSignUpMatric(e.target.value)}
                placeholder="e.g. 210101001"
                className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white font-mono rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
              />
            </div>

            {/* Academic Level & Course of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={signUpLevel}
                  onChange={(e) => setSignUpLevel(e.target.value)}
                  className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                >
                  <option value="100 Level" className="dark:bg-slate-900">100 Level</option>
                  <option value="200 Level" className="dark:bg-slate-900">200 Level</option>
                  <option value="300 Level" className="dark:bg-slate-900">300 Level</option>
                  <option value="400 Level" className="dark:bg-slate-900">400 Level</option>
                  <option value="500 Level" className="dark:bg-slate-900">500 Level</option>
                  <option value="Postgraduate" className="dark:bg-slate-900">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Course of Study <span className="text-red-500">*</span>
                </label>
                {isCustomCourse ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      placeholder="e.g. B.Sc. Software Engineering"
                      className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCourse(false)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 underline font-medium cursor-pointer"
                    >
                      Choose from list instead
                    </button>
                  </div>
                ) : (
                  <select
                    value={signUpCourse}
                    onChange={(e) => {
                      if (e.target.value === 'OTHER_CUSTOM_COURSE') {
                        setIsCustomCourse(true);
                      } else {
                        setSignUpCourse(e.target.value);
                      }
                    }}
                    className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                  >
                    <option value="B.Sc. Computer Science" className="dark:bg-slate-900">B.Sc. Computer Science</option>
                    <option value="B.Sc. Software Engineering" className="dark:bg-slate-900">B.Sc. Software Engineering</option>
                    <option value="B.Sc. Information Technology" className="dark:bg-slate-900">B.Sc. Information Technology</option>
                    <option value="B.Sc. Cyber Security" className="dark:bg-slate-900">B.Sc. Cyber Security</option>
                    <option value="B.Sc. Mass Communication" className="dark:bg-slate-900">B.Sc. Mass Communication</option>
                    <option value="B.Sc. Business Administration" className="dark:bg-slate-900">B.Sc. Business Administration</option>
                    <option value="B.Sc. Accounting" className="dark:bg-slate-900">B.Sc. Accounting</option>
                    <option value="B.Sc. Economics" className="dark:bg-slate-900">B.Sc. Economics</option>
                    <option value="B.Sc. Biochemistry" className="dark:bg-slate-900">B.Sc. Biochemistry</option>
                    <option value="B.Sc. Microbiology" className="dark:bg-slate-900">B.Sc. Microbiology</option>
                    <option value="B.Sc. International Relations" className="dark:bg-slate-900">B.Sc. International Relations</option>
                    <option value="OTHER_CUSTOM_COURSE" className="dark:bg-slate-900">+ Type Other / Custom Course...</option>
                  </select>
                )}
              </div>
            </div>

            {/* Hall of Residence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" /> Default Hall of Residence
              </label>
              <select
                value={signUpHall}
                onChange={(e) => setSignUpHall(e.target.value)}
                className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
              >
                <option value="Faith Hall" className="dark:bg-slate-900">Faith Hall (Male)</option>
                <option value="Grace Hall" className="dark:bg-slate-900">Grace Hall (Female)</option>
                <option value="Hope Hall" className="dark:bg-slate-900">Hope Hall (Male)</option>
                <option value="Joy Hall" className="dark:bg-slate-900">Joy Hall (Female)</option>
                <option value="Peace Hall" className="dark:bg-slate-900">Peace Hall (Male)</option>
                <option value="Off-Campus" className="dark:bg-slate-900">Off-Campus</option>
              </select>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> Student Phone
                </label>
                <input
                  type="text"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="e.g. 08031234567"
                  className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white font-mono rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> Parent Phone
                </label>
                <input
                  type="text"
                  value={signUpParentPhone}
                  onChange={(e) => setSignUpParentPhone(e.target.value)}
                  placeholder="e.g. 08029876543"
                  className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white font-mono rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-500" /> Create Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-500" /> Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/25 text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px] mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Continue</span>
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LogIn className="w-5 h-5 text-indigo-500" />
                <span>Student Login</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Matriculation Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={loginMatric}
                onChange={(e) => setLoginMatric(e.target.value)}
                placeholder="e.g. 210101001"
                className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white font-mono rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-500" /> Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full px-3.5 py-2.5 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/25 text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px] mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Student Portal</span>
            </button>

            {/* Quick Demo Accounts Helper */}
            {users.length > 0 && (
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Student Login (1-Click)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(u)}
                      className="p-2.5 bg-white/40 dark:bg-slate-800/40 hover:bg-indigo-500/15 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl text-left transition flex flex-col cursor-pointer backdrop-blur-md"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{u.studentName}</span>
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{u.level}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        Matric: {u.matricNo} &bull; {u.courseOfStudy}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
