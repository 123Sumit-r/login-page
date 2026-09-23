import React, { useState, useEffect, useRef } from 'react';
import { Timer, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OtpModal = () => {
  const { pendingUser, verifyOtp, resendOtp, isOtpModalOpen, setIsOtpModalOpen } = useAuth();

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

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (isVerifying || code.length < 6) return;

    setIsVerifying(true);
    try {
      const verified = await verifyOtp(code);
      if (verified) setOtpDigits(['', '', '', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isVerifying) return;
    const resent = await resendOtp();
    if (resent) {
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30">
      <div className="glass-panel auth-card w-full max-w-md p-6 sm:p-8 relative">
        
        {/* Close button */}
        <button
          onClick={() => setIsOtpModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Account setup</p>
          <h3 className="text-2xl font-bold text-slate-900">Verify your email</h3>
          <p className="text-sm text-slate-500 mt-2">
            We sent a 6-digit security OTP code to:
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {pendingUser.email}
          </p>
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
                className="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg glass-input border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying || otpDigits.join('').length < 6}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              otpDigits.join('').length === 6
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isVerifying ? 'Verifying OTP...' : 'Verify Email & Complete Registration'}
          </button>
        </form>

        {/* Resend & Cooldown Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
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
