import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Saved accounts
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('skovia_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skovia_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Pending OTP verification session for signup or login fallback
  const [pendingUser, setPendingUser] = useState(null);
  
  // Pending password reset session
  const [resetSession, setResetSession] = useState(null);

  // Modals state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

  // Virtual Email Inbox
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('skovia_inbox');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome-001',
        to: 'info@skovio.in',
        subject: 'Welcome to Skovio Security Assessment',
        sender: 'Skovio Team <info@skovio.in>',
        body: 'Thank you for testing our Login & Registration System with Email OTP Verification. All generated OTPs will appear here live.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        code: null,
        isRead: false
      }
    ];
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem('skovia_users', JSON.stringify(users));
  }, [users]);

  // Sync current user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skovia_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skovia_active_user');
    }
  }, [currentUser]);

  // Sync inbox
  useEffect(() => {
    localStorage.setItem('skovia_inbox', JSON.stringify(emails));
  }, [emails]);

  // Helper to trigger toast
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to generate 6-digit OTP code
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send simulated email
  const sendSimulatedEmail = (toEmail, subject, code, type = 'verification') => {
    const newEmail = {
      id: 'email-' + Date.now(),
      to: toEmail,
      sender: 'Skovio Security <noreply@skovio.in>',
      subject: subject,
      body: type === 'verification' 
        ? `Your Skovio verification code is ${code}. It will expire in 10 minutes. Do not share this OTP with anyone.`
        : `Use security code ${code} to reset your Skovio account password.`,
      code: code,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setEmails(prev => [newEmail, ...prev]);

    // Show persistent notification trigger
    addToast('info', '📬 New Email Received', `OTP sent to ${toEmail}. Open virtual inbox to view code.`);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 1. REGISTER USER
  const registerUser = ({ fullName, email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check existing email
    const existing = users.find(u => u.email === normalizedEmail);
    if (existing && existing.isVerified) {
      addToast('error', 'Registration Failed', 'An account with this email address already exists.');
      return false;
    }

    const code = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    const pendingData = {
      fullName,
      email: normalizedEmail,
      password,
      otp: code,
      otpExpiry: expiry,
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    setPendingUser(pendingData);
    sendSimulatedEmail(normalizedEmail, 'Skovio Email Verification Code', code, 'verification');
    setIsOtpModalOpen(true);
    return true;
  };

  // 2. VERIFY OTP
  const verifyOtp = (enteredCode) => {
    if (!pendingUser) {
      addToast('error', 'Session Expired', 'No pending OTP verification session found.');
      return false;
    }

    if (Date.now() > pendingUser.otpExpiry) {
      addToast('error', 'OTP Expired', 'The verification code has expired. Please request a new one.');
      return false;
    }

    if (enteredCode !== pendingUser.otp) {
      setPendingUser(prev => ({ ...prev, attempts: (prev.attempts || 0) + 1 }));
      addToast('error', 'Invalid Code', 'The 6-digit OTP code entered is incorrect.');
      return false;
    }

    // Success! Create or update user
    const newUser = {
      id: 'user-' + Date.now(),
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setUsers(prev => {
      const filtered = prev.filter(u => u.email !== pendingUser.email);
      return [...filtered, newUser];
    });

    setCurrentUser(newUser);
    setPendingUser(null);
    setIsOtpModalOpen(false);

    triggerConfetti();
    addToast('success', 'Verification Successful!', `Welcome to Skovio, ${newUser.fullName}! Your email is verified.`);
    return true;
  };

  // 3. RESEND OTP
  const resendOtp = () => {
    if (!pendingUser) return false;

    const newCode = generateOtp();
    const newExpiry = Date.now() + 10 * 60 * 1000;

    setPendingUser(prev => ({
      ...prev,
      otp: newCode,
      otpExpiry: newExpiry,
      attempts: 0
    }));

    sendSimulatedEmail(pendingUser.email, 'Skovio Email Verification Code (Resent)', newCode, 'verification');
    addToast('success', 'OTP Resent', `A new 6-digit code was sent to ${pendingUser.email}`);
    return true;
  };

  // 4. LOGIN USER
  const loginUser = ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);

    if (!user) {
      addToast('error', 'Login Failed', 'No account found with this email address.');
      return false;
    }

    if (user.password !== password) {
      addToast('error', 'Login Failed', 'Incorrect password. Please try again.');
      return false;
    }

    if (!user.isVerified) {
      // Re-trigger OTP verification for unverified account
      const code = generateOtp();
      const expiry = Date.now() + 10 * 60 * 1000;
      setPendingUser({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        otp: code,
        otpExpiry: expiry
      });
      sendSimulatedEmail(user.email, 'Skovio Email Verification Code', code, 'verification');
      setIsOtpModalOpen(true);
      addToast('warning', 'Email Unverified', 'Please verify your email address to complete login.');
      return false;
    }

    const updatedUser = {
      ...user,
      lastLoginAt: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    triggerConfetti();
    addToast('success', 'Welcome Back!', `Logged in successfully as ${user.fullName}`);
    return true;
  };

  // 5. LOGOUT
  const logoutUser = () => {
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'You have been safely signed out.');
  };

  // 6. FORGOT PASSWORD - REQUEST OTP
  const requestPasswordReset = (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);

    if (!user) {
      addToast('error', 'Reset Failed', 'No registered user found with this email address.');
      return false;
    }

    const code = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000;

    setResetSession({
      email: normalizedEmail,
      otp: code,
      otpExpiry: expiry
    });

    sendSimulatedEmail(normalizedEmail, 'Skovio Password Reset Code', code, 'reset');
    addToast('info', 'Reset Code Sent', `Password reset instructions sent to ${normalizedEmail}`);
    return true;
  };

  // 7. FORGOT PASSWORD - VERIFY & UPDATE
  const confirmPasswordReset = (enteredCode, newPassword) => {
    if (!resetSession) {
      addToast('error', 'Error', 'No active password reset session.');
      return false;
    }

    if (Date.now() > resetSession.otpExpiry) {
      addToast('error', 'Expired OTP', 'The password reset OTP has expired. Please try again.');
      return false;
    }

    if (enteredCode !== resetSession.otp) {
      addToast('error', 'Invalid Code', 'The entered reset OTP code is incorrect.');
      return false;
    }

    // Update password
    setUsers(prev => prev.map(u => {
      if (u.email === resetSession.email) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    setResetSession(null);
    setIsForgotPasswordOpen(false);
    addToast('success', 'Password Updated!', 'Your password was updated. You can now log in with your new password.');
    return true;
  };

  // 8. UPDATE USER PROFILE
  const updateUserProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addToast('success', 'Profile Updated', 'Your user profile details have been saved.');
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        pendingUser,
        resetSession,
        emails,
        toasts,
        isOtpModalOpen,
        isForgotPasswordOpen,
        isEmailDrawerOpen,
        setIsOtpModalOpen,
        setIsForgotPasswordOpen,
        setIsEmailDrawerOpen,
        registerUser,
        verifyOtp,
        resendOtp,
        loginUser,
        logoutUser,
        requestPasswordReset,
        confirmPasswordReset,
        updateUserProfile,
        addToast,
        removeToast,
        triggerConfetti
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
