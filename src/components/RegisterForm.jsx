import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterForm = ({ onSwitchToLogin }) => {
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluate password criteria
  const passwordCriteria = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password)
  };

  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!formData.password) return { text: '', color: 'bg-slate-700' };
    switch (strengthScore) {
      case 1:
        return { text: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { text: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { text: 'Good', color: 'bg-blue-500' };
      case 4:
        return { text: 'Excellent', color: 'bg-emerald-500' };
      default:
        return { text: 'Too Short', color: 'bg-rose-500' };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-white/10">
        
        {/* Top Header */}
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Get started</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h2>
          <p className="text-sm text-slate-500 mt-2">Set up your secure Skovio account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Sumit Kumar"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm ${
                  errors.fullName ? 'border-rose-500/80 bg-rose-950/20' : ''
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sumit@skovio.in"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm ${
                  errors.email ? 'border-rose-500/80 bg-rose-950/20' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm ${
                  errors.password ? 'border-rose-500/80 bg-rose-950/20' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.password}
              </p>
            )}

            {/* Password Strength Bar */}
            {formData.password && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Strength:</span>
                  <span className="font-semibold text-white">{strength.text}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 ${
                        step <= strengthScore ? strength.color : 'bg-slate-700/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
                  <div className={`flex items-center gap-1 ${passwordCriteria.minLength ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" /> Min 8 Characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasUpper ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" /> Uppercase Letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" /> At least 1 Number
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" /> Special Symbol
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm ${
                  errors.confirmPassword ? 'border-rose-500/80 bg-rose-950/20' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
              />
              <span className="text-xs text-slate-400">
                I agree to Skovio's <a href="#terms" className="text-blue-400 underline">Terms of Service</a> & <a href="#privacy" className="text-blue-400 underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Generating OTP...</span>
            ) : (
              <>
                <span>Register & Send Email OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch to Login */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Sign in to your account
          </button>
        </div>
      </div>
    </div>
  );
};
