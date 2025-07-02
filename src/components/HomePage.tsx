import React, { useState } from 'react';
import { Building2, Users, Shield, TrendingUp, Sparkles, Zap, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';
import LoginModal from './auth/LoginModal';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'client'>('admin');
  const { actualTheme } = useTheme();

  const handleLoginClick = (type: 'admin' | 'client') => {
    setLoginType(type);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-100 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mini Bank</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure Banking Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
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
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Next-Generation Banking</span>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Modern Banking
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Management</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamlined, secure, and efficient banking operations with real-time analytics, 
            comprehensive account management, and seamless user experience powered by cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => handleLoginClick('admin')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span>Access Admin Dashboard</span>
            </button>
            <button
              onClick={() => handleLoginClick('client')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Client Portal</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">256-bit</div>
              <div className="text-gray-600 dark:text-gray-400">SSL Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Banking Solution
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage banking operations efficiently and securely with modern technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account Management</h4>
              <p className="text-gray-600 dark:text-gray-300">Complete holder management with automated ID generation and document uploads</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Financial Operations</h4>
              <p className="text-gray-600 dark:text-gray-300">Deposits, withdrawals, penalties, and daily collections with real-time updates</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Access</h4>
              <p className="text-gray-600 dark:text-gray-300">Two-factor authentication with OTP verification for all users</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800 hover:shadow-lg transition-shadow">
              <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics & Reports</h4>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive reporting and real-time analytics for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built with Modern Technology
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powered by cutting-edge tools and frameworks for optimal performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Lightning Fast</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimized performance</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Cloud Ready</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scalable infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Bank-Grade Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
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