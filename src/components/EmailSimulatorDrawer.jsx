import React from 'react';
import { Mail, X, Copy, Check, ExternalLink, ShieldCheck, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailSimulatorDrawer = () => {
  const { emails, isEmailDrawerOpen, setIsEmailDrawerOpen, verifyOtp, pendingUser, addToast } = useAuth();
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isEmailDrawerOpen) return null;

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addToast('info', 'Code Copied', `OTP code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickVerifyFromEmail = (code) => {
    if (pendingUser) {
      verifyOtp(code);
      setIsEmailDrawerOpen(false);
    } else {
      addToast('warning', 'No Active OTP Session', 'Please initiate signup or login to verify OTP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-l border-white/10 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Simulated Email Inbox
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  {emails.length} Emails
                </span>
              </h3>
              <p className="text-xs text-slate-400">Live preview of generated OTP security emails</p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {emails.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Inbox className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm">No emails received yet.</p>
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className="glass-card p-4 rounded-xl border border-white/10 hover:border-blue-500/40 transition-all space-y-3"
              >
                {/* Email Metadata */}
                <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="text-xs font-semibold text-white">{email.subject}</div>
                    <div className="text-[11px] text-slate-400">
                      From: <span className="text-slate-300">{email.sender}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      To: <span className="text-blue-400 font-medium">{email.to}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 bg-slate-950/60 px-2 py-1 rounded-md border border-white/5">
                    {email.timestamp}
                  </span>
                </div>

                {/* Email Content Body */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-white/5">
                  <p>{email.body}</p>

                  {/* Render OTP callout card if code exists */}
                  {email.code && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Your Security OTP Code</div>
                        <div className="text-2xl font-extrabold font-mono text-white tracking-widest mt-0.5">
                          {email.code}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(email.code, email.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === email.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {pendingUser && pendingUser.otp === email.code && (
                          <button
                            onClick={() => handleQuickVerifyFromEmail(email.code)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer info */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Skovio Virtual SMTP Sandbox</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Sync
          </span>
        </div>
      </div>
    </div>
  );
};
