import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Plus,
  Minus,
  Calculator,
  Search,
  User,
  Mail,
  Phone,
  Eye,
  Edit
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { showToast } from '../ui/Toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';
import PenaltyModal from './modals/PenaltyModal';
import DailyCollectionModal from './modals/DailyCollectionModal';

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
}

export default function FinancialOperations() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedHolder, setSelectedHolder] = useState<Holder | null>(null);
  const [holders, setHolders] = useState<Holder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHolders, setFilteredHolders] = useState<Holder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHolders();
  }, []);

  useEffect(() => {
    filterHolders();
  }, [holders, searchTerm]);

  const loadHolders = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.readHolders();
      const holdersData = parseHoldersData(response);
      setHolders(holdersData);
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
        dailyCollection: parseFloat(values[13]) || 0
      };
    });
  };

  const filterHolders = () => {
    if (!searchTerm.trim()) {
      setFilteredHolders([]);
      return;
    }

    const filtered = holders.filter(holder =>
      holder.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holder.holderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holder.mobile.includes(searchTerm)
    );

    setFilteredHolders(filtered);
  };

  const handleOperationClick = (operationId: string, holder?: Holder) => {
    if (holder) {
      setSelectedHolder(holder);
    }
    setActiveModal(operationId);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedHolder(null);
  };

  const handleOperationSuccess = () => {
    handleModalClose();
    loadHolders(); // Refresh data
  };

  const operations = [
    {
      id: 'deposit',
      title: 'Process Deposit',
      description: 'Add money to account holder balance',
      icon: PiggyBank,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'withdraw',
      title: 'Process Withdrawal',
      description: 'Withdraw money from account holder',
      icon: TrendingDown,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'penalty',
      title: 'Add Penalty',
      description: 'Apply penalty charges to account',
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100'
    },
    {
      id: 'collection',
      title: 'Daily Collection',
      description: 'Record daily collection from holder',
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Operations</h2>
        <p className="text-gray-600">Search for account holders and manage financial transactions</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Find Account Holder</h3>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Holder ID, Name, Email, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : searchTerm && filteredHolders.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredHolders.map((holder) => (
              <div key={holder.holderId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                    {holder.holderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-gray-900">{holder.holderName}</p>
                        <p className="text-sm text-gray-600">{holder.holderId}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{holder.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{holder.mobile}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-green-600 font-medium">Balance: ₹{holder.balance.toLocaleString()}</span>
                      <span className="text-blue-600 font-medium">Daily Collection: ₹{holder.dailyCollection.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        holder.status === 'Final' 
                          ? 'bg-gray-100 text-gray-800'
                          : holder.status === 'To give'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {holder.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {operations.map((operation) => {
                    const Icon = operation.icon;
                    return (
                      <button
                        key={operation.id}
                        onClick={() => handleOperationClick(operation.id, holder)}
                        className={`p-2 rounded-lg ${operation.bgColor} ${operation.textColor} hover:scale-110 transition-all tooltip`}
                        title={operation.title}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm && filteredHolders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No holders found matching your search</p>
            <p className="text-sm">Try searching with a different term</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Start typing to search for account holders</p>
            <p className="text-sm">Search by Holder ID, Name, Email, or Mobile number</p>
          </div>
        )}
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operations.map((operation) => {
          const Icon = operation.icon;
          return (
            <button
              key={operation.id}
              onClick={() => handleOperationClick(operation.id)}
              className={`p-6 rounded-2xl border ${operation.bgColor} ${operation.borderColor} ${operation.hoverColor} transition-all hover:shadow-lg hover:scale-105 text-left group`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-white shadow-sm ${operation.textColor} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {operation.title}
              </h3>
              <p className="text-sm text-gray-600">
                {operation.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Plus className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-600">0</span>
            </div>
            <p className="text-sm text-green-800">Deposits</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Minus className="h-5 w-5 text-orange-600 mr-1" />
              <span className="text-2xl font-bold text-orange-600">0</span>
            </div>
            <p className="text-sm text-orange-800">Withdrawals</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-1" />
              <span className="text-2xl font-bold text-red-600">0</span>
            </div>
            <p className="text-sm text-red-800">Penalties</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calculator className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-2xl font-bold text-blue-600">0</span>
            </div>
            <p className="text-sm text-blue-800">Collections</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'deposit' && (
        <DepositModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}
      {activeModal === 'withdraw' && (
        <WithdrawModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}
      {activeModal === 'penalty' && (
        <PenaltyModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}
      {activeModal === 'collection' && (
        <DailyCollectionModal 
          onClose={handleModalClose} 
          onSuccess={handleOperationSuccess}
          selectedHolder={selectedHolder}
        />
      )}
    </div>
  );
}