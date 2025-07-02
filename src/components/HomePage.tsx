import React, { useState } from 'react';
import { Building2, Users, Shield, TrendingUp } from 'lucide-react';
import LoginModal from './auth/LoginModal';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'client'>('admin');

  const handleLoginClick = (type: 'admin' | 'client') => {
    setLoginType(type);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mini Bank</h1>
                <p className="text-sm text-gray-600">Secure Banking Management</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleLoginClick('admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Admin Login
              </button>
              <button
                onClick={() => handleLoginClick('client')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Client Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Banking
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Management</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamlined, secure, and efficient banking operations with real-time analytics, 
            comprehensive account management, and seamless user experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleLoginClick('admin')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
            >
              Access Admin Dashboard
            </button>
            <button
              onClick={() => handleLoginClick('client')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
            >
              Client Portal
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Banking Solution
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage banking operations efficiently and securely
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Account Management</h4>
              <p className="text-gray-600">Complete holder management with automated ID generation and document uploads</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Financial Operations</h4>
              <p className="text-gray-600">Deposits, withdrawals, penalties, and daily collections with real-time updates</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure Access</h4>
              <p className="text-gray-600">Two-factor authentication with OTP verification for all users</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
              <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h4>
              <p className="text-gray-600">Comprehensive reporting and real-time analytics for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Mini Bank</span>
          </div>
          <p className="text-gray-400 mb-4">
            Secure • Reliable • Modern Banking Management System
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Mini Bank. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          type={loginType}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}