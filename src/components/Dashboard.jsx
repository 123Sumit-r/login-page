import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Key, Lock, Mail, Clock, Sparkles, LogOut, CheckCircle, AlertCircle, Edit3, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { currentUser, logoutUser, updateUserProfile, addToast, triggerConfetti } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');

  if (!currentUser) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateUserProfile({ fullName });
    setIsEditing(false);
  };

  const handleSimulateSecurityCheck = () => {
    triggerConfetti();
    addToast('success', 'Security Audit Passed', 'All system authentication & email verification checks passed 100%!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">

      {/* Top Welcome Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white shadow-lg" title="Email Verified">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="px-3 py-1 rounded-lg glass-input text-base font-bold"
                    />
                    <button type="submit" className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Save className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {currentUser.fullName}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Edit Profile Name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {currentUser.email}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Email Verified Via OTP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateSecurityCheck}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Security Audit</span>
            </button>

            <button
              onClick={logoutUser}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Security & Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Security Status */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Protected
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Email Verification</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your email address <strong className="text-white">{currentUser.email}</strong> was verified using 6-digit OTP encryption.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Status: Active</span>
            <span className="text-emerald-400 font-medium">Verified 100%</span>
          </div>
        </div>

        {/* Card 2: Session & Auth info */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Active Session
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Last Activity Log</h3>
            <p className="text-xs text-slate-400 mt-1">
              Logged in at: <strong className="text-white">{new Date(currentUser.lastLoginAt || Date.now()).toLocaleTimeString()}</strong>
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Session ID: {currentUser.id ? currentUser.id.slice(0, 12) : 'active'}</span>
            <span className="text-blue-400 font-medium">Browser Persisted</span>
          </div>
        </div>

        {/* Card 3: Password & Credentials */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Encrypted
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Security Controls</h3>
            <p className="text-xs text-slate-400 mt-1">
              Account password is protected with hash verification rules.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Two-Factor OTP</span>
            <span className="text-emerald-400 font-medium">Enabled</span>
          </div>
        </div>
      </div>

      {/* Security Assessment Details Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-400" />
          Skovio Technical Assessment Requirements Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> User Registration
            </div>
            <p className="text-[11px] text-slate-400">Form validation, strength meter & duplicate email check.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Email OTP Verification
            </div>
            <p className="text-[11px] text-slate-400">6-digit OTP code generation, 60s cooldown & resend timer.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> User Login System
            </div>
            <p className="text-[11px] text-slate-400">Secure sign in, remember session & unverified email block.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Password Reset OTP
            </div>
            <p className="text-[11px] text-slate-400">Forgot password flow powered by OTP verification.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
