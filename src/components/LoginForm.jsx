import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginForm = ({ onSwitchToRegister }) => {
  const { loginUser, setIsForgotPasswordOpen, registerUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    loginUser({
      email: formData.email,
      password: formData.password
    });
    setIsSubmitting(false);
  };

  // Quick Demo Credentials prefill for assessor testing
  const handleQuickDemo = () => {
    const demoEmail = 'sumit@skovio.in';
    const demoPass = 'Skovio@2026';
    
    // Auto fill form
    setFormData({
      email: demoEmail,
      password: demoPass,
      rememberMe: true
    });

    // Also ensure demo user exists in registered list
    registerUser({
      fullName: 'Sumit Kumar',
      email: demoEmail,
      password: demoPass
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-white/10">

        {/* Top Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 mb-3 shadow-lg shadow-indigo-500/30 text-white font-bold">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your Skovio portal</p>
        </div>

        {/* Quick Demo Pre-fill banner */}
        <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
            <span>Assessor Quick Demo Test</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors cursor-pointer"
          >
            Auto-Fill Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
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
          </div>

          {/* Remember Me */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
              />
              <span className="text-xs text-slate-400">Remember me on this browser</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Footer switch to Register */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
};
