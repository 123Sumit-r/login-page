import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { OtpModal } from './components/OtpModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ToastContainer } from './components/Toast';

const MainContent = () => {
  const { currentUser, verificationComplete, setVerificationComplete } = useAuth();
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login'
  const visibleTab = verificationComplete ? 'login' : activeTab;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center items-center">
        {currentUser ? (
          <Dashboard />
        ) : (
          <div className="w-full max-w-md mx-auto">
            
            {/* Tab Selector */}
            <div className="flex items-center justify-center p-1 bg-white rounded-lg border border-slate-200 w-full mb-6 shadow-sm">
              <button
                onClick={() => { setVerificationComplete(false); setActiveTab('register'); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  visibleTab === 'register'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  visibleTab === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                User Sign In
              </button>
            </div>

            {/* Tab Content */}
            {visibleTab === 'register' ? (
              <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
            ) : (
              <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
            )}
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <OtpModal />
      <ForgotPasswordModal />
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Skovio Technical Assessment • Built for Internship Submission</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Candidate: <strong className="text-white">Sumit Kumar</strong></span>
            <span className="text-slate-600">•</span>
            <a href="mailto:info@skovio.in" className="text-blue-400 hover:underline">info@skovio.in</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
