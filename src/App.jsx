import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { OtpModal } from './components/OtpModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { EmailSimulatorDrawer } from './components/EmailSimulatorDrawer';
import { ToastContainer } from './components/Toast';

const MainContent = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login'

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      
      {/* Background glowing spheres */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />
      <div className="bg-glow-3" />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex flex-col justify-center items-center">
        {currentUser ? (
          <Dashboard />
        ) : (
          <div className="w-full max-w-md mx-auto">
            
            {/* Tab Selector */}
            <div className="flex items-center justify-center p-1 bg-slate-900/80 rounded-2xl border border-white/10 w-full mb-6">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                User Sign In
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'register' ? (
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
      <EmailSimulatorDrawer />
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-xs text-slate-400 relative z-10">
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
