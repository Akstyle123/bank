import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ClientDashboard() {
  const { currentUser } = useApp();
  const [accountData, setAccountData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      if (currentUser?.email) {
        const response = await apiService.clientTransactions({
          email: currentUser.email
        });
        // Parse the response to extract account information
        console.log('Account data:', response);
        setRecentTransactions([]);
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-green-100">
          Here's an overview of your account activity and balance.
        </p>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900">₹0.00</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Account Active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-3xl font-bold text-gray-900">₹0.00</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-600 font-medium">All time deposits</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
              <p className="text-3xl font-bold text-gray-900">₹0.00</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-600 font-medium">Total withdrawn</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Charges</p>
              <p className="text-3xl font-bold text-gray-900">₹0.00</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Clock className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600 font-medium">Pending payments</span>
          </div>
        </div>
      </div>

      {/* Account Information & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Account Holder</span>
              <span className="text-sm font-semibold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Holder ID</span>
              <span className="text-sm font-semibold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm font-semibold text-gray-900">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Account Status</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{transaction.amount}</p>
                    <p className="text-xs text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recent activity</p>
                <p className="text-sm">Your transactions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group text-left">
            <CreditCard className="h-6 w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-green-900">View Transactions</p>
            <p className="text-xs text-green-700">Check your transaction history</p>
          </button>
          
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group text-left">
            <Calendar className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-900">Download Statement</p>
            <p className="text-xs text-blue-700">Get your account statement</p>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors group text-left">
            <AlertCircle className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-purple-900">Contact Support</p>
            <p className="text-xs text-purple-700">Get help with your account</p>
          </button>
        </div>
      </div>
    </div>
  );
}