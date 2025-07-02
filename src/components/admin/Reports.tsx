import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  RefreshCw,
  DollarSign,
  Users,
  PieChart
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function Reports() {
  const [bankStatus, setBankStatus] = useState('');
  const [dailySummary, setDailySummary] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyCollection, setDailyCollection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const [statusData, summaryData] = await Promise.all([
        apiService.getBankStatus(),
        apiService.getSummary()
      ]);
      setBankStatus(statusData);
      setDailySummary(summaryData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDailyCollection = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getDailyCollection(selectedDate);
      setDailyCollection(response);
    } catch (error) {
      console.error('Error loading daily collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const downloadReport = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">View comprehensive banking reports and analytics</p>
        </div>
        <button
          onClick={loadReports}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Status Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Bank Status Overview</h3>
            </div>
            <button
              onClick={() => downloadReport(bankStatus, 'bank-status.csv')}
              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {bankStatus || 'No data available'}
              </pre>
            )}
          </div>
        </div>

        {/* Daily Summary Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Summary</h3>
            </div>
            <button
              onClick={() => downloadReport(dailySummary, 'daily-summary.csv')}
              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {dailySummary || 'No data available'}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Daily Collection Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Collection Report</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={loadDailyCollection}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Load</span>
            </button>
            {dailyCollection && (
              <button
                onClick={() => downloadReport(dailyCollection, `daily-collection-${selectedDate}.csv`)}
                className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Download className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : dailyCollection ? (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {dailyCollection}
            </pre>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a date and click "Load" to view daily collection report</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-blue-400 p-3 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Holders</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-green-400 p-3 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Monthly Growth</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-purple-400 p-3 rounded-lg">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}