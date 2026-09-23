import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [resetSession, setResetSession] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('skovia_access_token')) return;
    authApi.getCurrentUser().then(setCurrentUser).catch(() => localStorage.removeItem('skovia_access_token'));
  }, []);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 5000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(toast => toast.id !== id));
  const triggerConfetti = () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  const registerUser = async ({ fullName, email, password }) => {
    try {
      setVerificationComplete(false);
      await authApi.register({ name: fullName, email, password });
      setPendingUser({ fullName, email: email.toLowerCase().trim() });
      setIsOtpModalOpen(true);
      addToast('success', 'Registration Started', 'A verification OTP was sent to your email.');
      return true;
    } catch (error) {
      addToast('error', 'Registration Failed', error.message);
      return false;
    }
  };

  const verifyOtp = async (enteredCode) => {
    if (!pendingUser) return false;
    try {
      await authApi.verifyOtp({ email: pendingUser.email, otp: enteredCode });
      setPendingUser(null); setIsOtpModalOpen(false); setVerificationComplete(true); triggerConfetti();
      addToast('success', 'Verification Successful', 'Your email is verified. You can now sign in.');
      return true;
    } catch (error) { addToast('error', 'Verification Failed', error.message === 'Invalid OTP.' || error.message === 'OTP has expired.' ? 'Invalid or expired OTP.' : error.message); return false; }
  };

  const resendOtp = async () => {
    if (!pendingUser) return false;
    try { await authApi.resendOtp({ email: pendingUser.email }); addToast('success', 'OTP Resent', 'A new verification code was sent to your email.'); return true; }
    catch (error) { addToast('error', 'Unable to Resend OTP', error.message); return false; }
  };

  const loginUser = async ({ email, password }) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('skovia_access_token', response.token); setCurrentUser(response.user); triggerConfetti();
      addToast('success', 'Welcome Back', `Logged in successfully as ${response.user.name}`); return true;
    } catch (error) { addToast('error', 'Login Failed', error.message); return false; }
  };

  const logoutUser = () => { localStorage.removeItem('skovia_access_token'); setCurrentUser(null); addToast('info', 'Logged Out', 'You have been safely signed out.'); };

  const requestPasswordReset = async (email) => {
    try { await authApi.forgotPassword({ email }); setResetSession({ email: email.toLowerCase().trim() }); addToast('success', 'Reset Code Sent', 'Password reset instructions were sent to your email.'); return true; }
    catch (error) { addToast('error', 'Reset Failed', error.message); return false; }
  };

  const confirmPasswordReset = async (enteredCode, newPassword) => {
    if (!resetSession) return false;
    try { await authApi.resetPassword({ email: resetSession.email, otp: enteredCode, newPassword }); setResetSession(null); setIsForgotPasswordOpen(false); addToast('success', 'Password Updated', 'Your password was updated. You can now log in.'); return true; }
    catch (error) { addToast('error', 'Password Reset Failed', error.message); return false; }
  };

  const updateUserProfile = async ({ fullName }) => {
    try {
      const user = await authApi.updateProfile({ name: fullName });
      setCurrentUser(user);
      addToast('success', 'Profile Updated', 'Your profile details have been saved.');
      return true;
    } catch (error) {
      addToast('error', 'Profile Update Failed', error.message);
      return false;
    }
  };

  return <AuthContext.Provider value={{ currentUser, pendingUser, verificationComplete, resetSession, emails: [], toasts, isOtpModalOpen, isForgotPasswordOpen, isEmailDrawerOpen, setIsOtpModalOpen, setIsForgotPasswordOpen, setIsEmailDrawerOpen, setVerificationComplete, registerUser, verifyOtp, resendOtp, loginUser, logoutUser, requestPasswordReset, confirmPasswordReset, updateUserProfile, addToast, removeToast, triggerConfetti }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};