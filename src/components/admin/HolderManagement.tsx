import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Mail, 
  Phone,
  User,
  Calendar,
  DollarSign,
  Upload,
  Download,
  Trash2,
  Camera,
  FileText,
  PiggyBank,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { showToast } from '../ui/Toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import AddHolderModal from './modals/AddHolderModal';
import ProfileImageModal from './modals/ProfileImageModal';
import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';
import PenaltyModal from './modals/PenaltyModal';
import DailyCollectionModal from './modals/DailyCollectionModal';
import ViewHolderModal from './modals/ViewHolderModal';

interface Holder {
  joiningDate: string;
  holderId: string;
  holderName: string;
  contactNo: string;
  totalDeposit: number;
  withdraw: number;
  charges: number;
  balance: number;
  status: string;
  mobile: string;
  email: string;
  dailyCollection: number;
  profileUrl?: string;
  documentUrl?: string;
}

export default function HolderManagement() {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [filteredHolders, setFilteredHolders] = useState<Holder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedHolder, setSelectedHolder] = useState<Holder | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    loadHolders();
  }, []);

  useEffect(() => {
    filterHolders();
  }, [holders, searchTerm, statusFilter]);

  const loadHolders = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.readHolders();
      const holdersData = parseHoldersData(response);
      setHolders(holdersData);
      showToast.success('Holders data loaded successfully');
    } catch (error) {
      showToast.error('Failed to load holders data');
      console.error('Error loading holders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseHoldersData = (csvString: string): Holder[] => {
    const lines = csvString.split('\n').filter(line => line.trim());
    const headers = lines[0].split(', ');
    
    return lines.slice(1).map(line => {
      const values = line.split(', ');
      return {
        joiningDate: values[0] || '',
        holderId: values[1] || '',
        holderName: values[2] || '',
        contactNo: values[9] || '',
        totalDeposit: parseFloat(values[3]) || 0,
        withdraw: parseFloat(values[4]) || 0,
        charges: parseFloat(values[6]) || 0,
        balance: parseFloat(values[7]) || 0,
        status: values[8] || '',
        mobile: values[9] || '',
        email: values[10] || '',
        dailyCollection: parseFloat(values[13]) || 0,
        profileUrl: values[12] || '',
        documentUrl: values[14] || ''
      };
    });
  };

  const filterHolders = () => {
    let filtered = holders;

    if (searchTerm) {
      filtered = filtered.filter(holder =>
        holder.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holder.holderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holder.mobile.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(holder => holder.status === statusFilter);
    }

    setFilteredHolders(filtered);
  };

  const handleAddHolder = () => {
    setShowAddModal(true);
  };

  const handleHolderAdded = () => {
    setShowAddModal(false);
    loadHolders();
  };

  const handleProfileImage = (holder: Holder) => {
    setSelectedHolder(holder);
    setShowProfileModal(true);
  };

  const handleFinancialOperation = (operation: string, holder: Holder) => {
    setSelectedHolder(holder);
    setActiveModal(operation);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedHolder(null);
    setShowProfileModal(false);
  };

  const handleOperationSuccess = () => {
    handleModalClose();
    loadHolders();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Joining Date', 'Holder ID', 'Name', 'Email', 'Mobile', 'Total Deposit', 'Withdrawals', 'Balance', 'Daily Collection', 'Status'],
      ...filteredHolders.map(holder => [
        holder.joiningDate,
        holder.holderId,
        holder.holderName,
        holder.email,
        holder.mobile,
        holder.totalDeposit,
        holder.withdraw,
        holder.balance,
        holder.dailyCollection,
        holder.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast.success('Holders data exported successfully');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Holders</h2>
          <p className="text-gray-600">Manage customer accounts and information</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleAddHolder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Holder</span>
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
                placeholder="Search by name, ID, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="To give">To Give</option>
              <option value="To take">To Take</option>
              <option value="Final">Final</option>
            </select>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Holders</p>
              <p className="text-2xl font-bold text-gray-900">{holders.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-green-600">
                {holders.filter(h => h.status !== 'Final').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{holders.reduce((sum, h) => sum + h.balance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Collections</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{holders.reduce((sum, h) => sum + h.dailyCollection, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Holders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Account Holders ({filteredHolders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holder Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHolders.map((holder, index) => (
                <tr key={holder.holderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        {holder.profileUrl ? (
                          <img 
                            src={holder.profileUrl} 
                            alt={holder.holderName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {holder.holderName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <button
                          onClick={() => handleProfileImage(holder)}
                          className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{holder.holderName}</div>
                        <div className="text-sm text-gray-500">{holder.holderId}</div>
                        <div className="text-xs text-gray-400">Joined: {holder.joiningDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {holder.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {holder.mobile}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposits:</span>
                        <span className="font-medium text-green-600">₹{holder.totalDeposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Withdrawals:</span>
                        <span className="font-medium text-red-600">₹{holder.withdraw.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Collection:</span>
                        <span className="font-medium text-blue-600">₹{holder.dailyCollection.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-900 font-medium">Balance:</span>
                        <span className={`font-bold ${holder.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{holder.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      holder.status === 'Final' 
                        ? 'bg-gray-100 text-gray-800'
                        : holder.status === 'To give'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {holder.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleFinancialOperation('deposit', holder)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                        title="Deposit"
                      >
                        <PiggyBank className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleFinancialOperation('withdraw', holder)}
                        className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Withdraw"
                      >
                        <TrendingDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleFinancialOperation('penalty', holder)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Add Penalty"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleFinancialOperation('collection', holder)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Daily Collection"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert('View holder details functionality not implemented yet')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Holder"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHolder(holder);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Holder"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHolders.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No holders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding a new account holder'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddHolderModal
          onClose={() => setShowAddModal(false)}
          onHolderAdded={handleHolderAdded}
        />
      )}

      {showProfileModal && selectedHolder && (
        <ProfileImageModal
          holder={selectedHolder}
          onClose={handleModalClose}
          onSuccess={handleOperationSuccess}
        />
      )}

      {activeModal === 'deposit' && selectedHolder && (
        <DepositModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}

      {activeModal === 'withdraw' && selectedHolder && (
        <WithdrawModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}

      {activeModal === 'penalty' && selectedHolder && (
        <PenaltyModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}

      {activeModal === 'collection' && selectedHolder && (
        <DailyCollectionModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}

      {showAddModal && selectedHolder && (
        <ViewHolderModal
          holder={selectedHolder}
          onClose={() => {
            setShowAddModal(false);
            setSelectedHolder(null);
          }}
        />
      )}
    </div>
  );
}
