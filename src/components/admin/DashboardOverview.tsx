import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PiggyBank, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  Activity,
  CreditCard
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { BarChart, PieChart, LineChart } from '../ui/Chart';

interface DashboardStats {
  totalHolders: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalBalance: number;
  todayTransactions: number;
  todayCollection: number;
  todayPenalty: number;
  pendingRequests: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [filteredActivity, setFilteredActivity] = useState<any[]>([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (filterText.trim() === '') {
      setFilteredActivity(recentActivity);
    } else {
      const filtered = recentActivity.filter(activity =>
        activity.some((field: string) => field.toLowerCase().includes(filterText.toLowerCase()))
      );
      setFilteredActivity(filtered);
    }
  }, [filterText, recentActivity]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [holdersData, bankStatus, logsData] = await Promise.all([
        apiService.readHolders(),
        apiService.getBankStatus(),
        apiService.readLogs()
      ]);
      
      const holders = parseCSVData(holdersData);
      const logs = parseCSVData(logsData);
      
      const totalHolders = holders.length - 1;
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let totalBalance = 0;
      let todayCollection = 0;
      let todayPenalty = 0;
      
      holders.slice(1).forEach((holder: any[]) => {
        totalDeposits += parseFloat(holder[3]) || 0;
        totalWithdrawals += parseFloat(holder[4]) || 0;
        totalBalance += parseFloat(holder[7]) || 0;
      });

      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.slice(1).filter((log: any[]) => {
        const logDate = log[0]?.split(' ')[0];
        return logDate === today;
      });

      todayLogs.forEach((log: any[]) => {
        if (log[1].toLowerCase().includes('collection')) {
          todayCollection += parseFloat(log[2]) || 0;
        }
        if (log[1].toLowerCase().includes('penalty')) {
          todayPenalty += parseFloat(log[2]) || 0;
        }
      });

      setStats({
        totalHolders,
        totalDeposits,
        totalWithdrawals,
        totalBalance,
        todayTransactions: todayLogs.length,
        todayCollection,
        todayPenalty,
        pendingRequests: 0
      });

      setRecentActivity(logs.slice(1));
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSVData = (csvString: string): any[][] => {
    return csvString.split('\n').filter(row => row.trim()).map(row => row.split(', '));
  };

  // Chart data
  const transactionData = [
    { label: 'Deposits', value: stats?.totalDeposits || 0, color: '#10B981' },
    { label: 'Withdrawals', value: stats?.totalWithdrawals || 0, color: '#F59E0B' },
    { label: 'Collections', value: stats?.todayCollection || 0, color: '#3B82F6' },
    { label: 'Penalties', value: stats?.todayPenalty || 0, color: '#EF4444' }
  ];

  const statusData = [
    { label: 'Active', value: stats?.totalHolders || 0, color: '#10B981' },
    { label: 'Pending', value: stats?.pendingRequests || 0, color: '#F59E0B' }
  ];

  const weeklyData = [
    { x: 'Mon', y: 1200 },
    { x: 'Tue', y: 1900 },
    { x: 'Wed', y: 3000 },
    { x: 'Thu', y: 5000 },
    { x: 'Fri', y: 2300 },
    { x: 'Sat', y: 3400 },
    { x: 'Sun', y: 4200 }
  ];

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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl text-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Administrator!</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Here's an overview of your banking operations today.
            </p>
          </div>
          <div className="hidden sm:block">
            <Activity className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Holders</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalHolders || 0}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-xl">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs sm:text-sm">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">Active accounts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalDeposits?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-2 sm:p-3 rounded-xl">
              <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs sm:text-sm">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">All time deposits</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Withdrawals</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalWithdrawals?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-2 sm:p-3 rounded-xl">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs sm:text-sm">
            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 mr-1" />
            <span className="text-orange-600 dark:text-orange-400 font-medium">Total withdrawn</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalBalance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 sm:p-3 rounded-xl">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-1" />
            <span className="text-purple-600 dark:text-purple-400 font-medium">Net balance</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <BarChart 
          data={transactionData} 
          title="Transaction Overview" 
          height={250}
        />
        <PieChart 
          data={statusData} 
          title="Account Status" 
          size={180}
        />
        <LineChart 
          data={weeklyData} 
          title="Weekly Trends" 
          height={250}
          color="#3B82F6"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Filter activities..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
            {filteredActivity.length > 0 ? (
              filteredActivity.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity[1]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity[2]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity[4]}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => alert('Add Holder action')}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors group"
            >
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Add Holder</p>
            </button>

            <button
              onClick={() => alert('Process Deposit action')}
              className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 transition-colors group"
            >
              <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-green-900 dark:text-green-300">Process Deposit</p>
            </button>

            <button
              onClick={() => alert('Withdrawal action')}
              className="p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800 transition-colors group"
            >
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Withdrawal</p>
            </button>

            <button
              onClick={() => alert('View Reports action')}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors group"
            >
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300">View Reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.todayTransactions || 0}</p>
            <p className="text-sm text-blue-800 dark:text-blue-300">Transactions Today</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{stats?.todayCollection?.toLocaleString() || 0}</p>
            <p className="text-sm text-green-800 dark:text-green-300">Today's Collection</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{stats?.todayPenalty?.toLocaleString() || 0}</p>
            <p className="text-sm text-orange-800 dark:text-orange-300">Today's Penalty</p>
          </div>
        </div>
      </div>
    </div>
  );
}