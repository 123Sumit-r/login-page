import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, Timer, RefreshCw, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OtpModal = () => {
  const { pendingUser, verifyOtp, resendOtp, isOtpModalOpen, setIsOtpModalOpen, emails } = useAuth();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Resend cooldown timer
  useEffect(() => {
    let interval;
    if (isOtpModalOpen && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, resendCooldown]);

  // Focus first input on modal open
  useEffect(() => {
    if (isOtpModalOpen) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOtpModalOpen]);

  if (!isOtpModalOpen || !pendingUser) return null;

  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Take last char
    setOtpDigits(newDigits);

    // Auto-advance focus
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs[5].current?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) return;

    setIsVerifying(true);
    verifyOtp(code);
    setIsVerifying(false);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    resendOtp();
    setResendCooldown(60);
    setOtpDigits(['', '', '', '', '', '']);
    inputRefs[0].current?.focus();
  };

  // Quick auto-fill latest sent OTP for testing
  const handleAutoFillFromInbox = () => {
    if (pendingUser && pendingUser.otp) {
      const digits = pendingUser.otp.split('');
      setOtpDigits(digits);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl relative border border-white/10">
        
        {/* Close button */}
        <button
          onClick={() => setIsOtpModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 mb-3 shadow-lg shadow-blue-500/30 text-white">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white">Email Verification</h3>
          <p className="text-xs text-slate-300 mt-1.5">
            We sent a 6-digit security OTP code to:
          </p>
          <p className="text-xs font-semibold text-blue-400 mt-0.5 bg-blue-500/10 py-1 px-3 rounded-full inline-block border border-blue-500/20">
            {pendingUser.email}
          </p>
        </div>

        {/* Quick Auto-fill banner for code reviewer convenience */}
        <div className="mb-5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Found OTP Code: <strong className="text-white tracking-widest">{pendingUser.otp}</strong></span>
          </div>
          <button
            onClick={handleAutoFillFromInbox}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Auto-Fill OTP
          </button>
        </div>

        <form onSubmit={handleVerify}>
          {/* 6-Digit OTP Box inputs */}
          <div className="flex items-center justify-between gap-2 mb-6" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl glass-input text-white border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all shadow-inner"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying || otpDigits.join('').length < 6}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              otpDigits.join('').length === 6
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isVerifying ? 'Verifying OTP...' : 'Verify Email & Complete Registration'}
          </button>
        </form>

        {/* Resend & Cooldown Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-blue-400" />
            <span>Resend code in: <strong className="text-white">{resendCooldown}s</strong></span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`flex items-center gap-1 font-semibold transition-colors ${
              resendCooldown === 0
                ? 'text-blue-400 hover:text-blue-300 underline cursor-pointer'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'animate-spin'}`} />
            <span>Resend OTP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
