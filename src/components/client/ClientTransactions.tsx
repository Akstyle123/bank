import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ClientTransactions() {
  const { currentUser } = useApp();
  const [transactions, setTransactions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    if (!currentUser?.email) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.clientTransactions({
        email: currentUser.email
      });
      setTransactions(response);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTransactions = () => {
    if (!transactions) return;
    
    const blob = new Blob([transactions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${currentUser?.email}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600">View all your account transactions and activity</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadTransactions}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={downloadTransactions}
            disabled={!transactions}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="deposits">Deposits</option>
              <option value="withdrawals">Withdrawals</option>
              <option value="penalties">Penalties</option>
              <option value="collections">Collections</option>
            </select>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">₹0.00</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
              <p className="text-2xl font-bold text-orange-600">₹0.00</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className="text-2xl font-bold text-blue-600">₹0.00</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : transactions ? (
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {transactions}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                Your transaction history will appear here once you start using your account.
              </p>
              <button
                onClick={loadTransactions}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Refresh Transactions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}