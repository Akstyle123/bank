import React, { useState } from 'react';
import { X, Mail, Lock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LoginModalProps {
  type: 'admin' | 'client';
  onClose: () => void;
}

export default function LoginModal({ type, onClose }: LoginModalProps) {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, verifyOTP } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password, type);
      if (response.includes('OTP sent')) {
        setStep('otp');
      } else {
        setError(response);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await verifyOTP(email, otp, type);
      if (success) {
        onClose();
      } else {
        setError('Invalid OTP or OTP has expired.');
      }
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = type === 'admin';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r ${
          isAdmin ? 'from-blue-600 to-indigo-600' : 'from-green-600 to-emerald-600'
        } text-white rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isAdmin ? 'bg-blue-500' : 'bg-green-500'}`}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isAdmin ? 'Admin Login' : 'Client Login'}
              </h2>
              <p className="text-sm opacity-90">
                {step === 'login' ? 'Enter your credentials' : 'Enter verification code'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isAdmin 
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' 
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                } flex items-center justify-center space-x-2`}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPVerification} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  OTP has been sent to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Check your email and enter the 6-digit code below
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isAdmin 
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' 
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                } flex items-center justify-center space-x-2`}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}