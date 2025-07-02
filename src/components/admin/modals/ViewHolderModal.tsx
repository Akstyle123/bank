import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { apiService } from '../../../services/apiService';

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

interface Transaction {
  id: string;
  date: string;
  time?: string;
  type: string;
  holderId?: string;
  holderName?: string;
  amount: number;
  charges?: number;
  collectedBy?: string;
  description: string;
}

interface ViewHolderModalProps {
  holder: Holder;
  onClose: () => void;
}

export default function ViewHolderModal({ holder, onClose }: ViewHolderModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.clientTransactions({ hid: holder.holderId });
        console.log('Transaction API response:', response);
        // Parse CSV-like response similar to holders parsing
        const lines = response.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setTransactions([]);
          setLoading(false);
          return;
        }



const data = lines.slice(1).map(line => {
  const values = line.split(',').map(v => v.trim());

  if (values.length === 6 && values[0].startsWith('P')) {
    // Penalty
    return {
      id: values[0],
      date: values[1],
      time: values[2],
      type: 'Penalty',
      holderId: values[3],
      amount: parseFloat(values[4]) || 0,
      description: values[5],
    };
  } else if (values.length === 7) {
    // Withdraw
    return {
      id: values[0],
      date: values[1],
      time: values[2],
      type: 'Withdraw',
      holderId: values[3],
      amount: parseFloat(values[4]) || 0,
      charges: parseFloat(values[5]) || 0,
      description: values[6],
    };
  } else if (values.length === 6 && !isNaN(Date.parse(values[0]))) {
    // Daily Collection (first value is likely date)
    return {
      id: `${values[0]}-${values[1]}`,
      date: values[0],
      type: 'Daily Collection',
      holderId: values[1],
      holderName: values[2],
      amount: parseFloat(values[3]) || 0,
      collectedBy: values[4],
      description: values[5],
    };
  } else if (values.length === 6) {
    // Deposit
    return {
      id: values[0],
      date: values[1],
      time: values[2],
      type: 'Deposit',
      holderId: values[3],
      amount: parseFloat(values[4]) || 0,
      description: values[5],
    };
  }

  return null;
}).filter(Boolean) as Transaction[];




        setTransactions(data);
      } catch (err) {
        setError('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [holder.holderId]);




  // Group transactions by type
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const key = tx.type || 'Other';
    if (!acc[key]) 
    acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  console.log('Grouped Transactions:', groupedTransactions);

  // Separate transactions by category
  // const deposits = groupedTransactions['Deposit'] || [];
  // const withdraws = groupedTransactions['Withdraw'] || [];
  // const penalties = groupedTransactions['Penalty'] || [];
  // const dailyCollections = groupedTransactions['Daily Collection'] || [];

  const renderTable = (type: string, txs: Transaction[]) => {
    let headers: string[] = [];
    switch (type) {
      case 'Deposit':
        headers = ['Transaction ID', 'Date', 'Time', 'Holder ID', 'Amount Deposited', 'Description'];
        break;
      case 'Penalty':
        headers = ['Transaction ID', 'Date', 'Time', 'Holder ID', 'Amount Deposited', 'Description'];
        break;
      case 'Withdraw':
        headers = ['Transaction ID', 'Date', 'Time', 'Holder ID', 'Amount Withdrawn', 'Amount Charges', 'Description'];
        break;
      case 'Daily Collection':
        headers = ['Date', 'Holder ID', 'Holder Name', 'Amount', 'Collected By', 'Description'];
        break;
      default:
        headers = ['Date', 'Amount', 'Description'];
    }

    return (
      <div key={type} className="mb-6">
        <h4 className="text-lg font-semibold mb-2">{type}</h4>
        <div className="overflow-x-auto border rounded-lg max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {headers.map(header => (
                  <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {txs.map(tx => (
                <tr key={tx.id}>
                  {type === 'Deposit' ? (
                    <>
                      <td className="px-4 py-2">{tx.id}</td>
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">{tx.time || ''}</td>
                      <td className="px-4 py-2">{tx.holderId || ''}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                    </>
                  ) : type === 'Penalty' ? (
                    <>
                      <td className="px-4 py-2">{tx.id}</td>
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">{tx.time || ''}</td>
                      <td className="px-4 py-2">{tx.holderId || ''}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                    </> 

                  ) : type === 'Withdraw' ? (
                    <>
                      <td className="px-4 py-2">{tx.id}</td>
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">{tx.time || ''}</td>
                      <td className="px-4 py-2">{tx.holderId || ''}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">₹{tx.charges}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                    </>
                  ) : type === 'Daily Collection' ? (
                    <>
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">{tx.holderId || ''}</td>
                      <td className="px-4 py-2">{tx.holderName || ''}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">{tx.collectedBy}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">₹{tx.amount}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-auto max-h-[90vh] p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Holder Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close holder details"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-6 mb-6">
          {holder.profileUrl ? (
            <img
              src={holder.profileUrl}
              alt={holder.holderName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {holder.holderName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{holder.holderName}</h3>
            <p className="text-gray-600">Holder ID: {holder.holderId}</p>
            <p className="text-gray-600">Status: {holder.status}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{holder.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{holder.mobile}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">Joined: {holder.joiningDate}</span>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">Contact No: {holder.contactNo}</span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-700">Total Deposit</h4>
            </div>
            <p className="text-green-900 font-bold text-lg">₹{holder.totalDeposit.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-700">Withdrawals</h4>
            </div>
            <p className="text-red-900 font-bold text-lg">₹{holder.withdraw.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-700">Charges</h4>
            </div>
            <p className="text-yellow-900 font-bold text-lg">₹{holder.charges.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-purple-700">Balance</h4>
            </div>
            <p className="text-purple-900 font-bold text-lg">₹{holder.balance.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg col-span-full">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-700">Daily Collection</h4>
            </div>
            <p className="text-blue-900 font-bold text-lg">₹{holder.dailyCollection.toLocaleString()}</p>
          </div>
        </div>

        {/* Documents */}
        {holder.documentUrl && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
            <a
              href={holder.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Document
            </a>
          </div>
        )}

        {/* Transactions */}

        <div>
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          {loading && <p>Loading transactions...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && transactions.length === 0 && <p>No transactions found for this holder.</p>}
          {!loading && !error && Object.entries(groupedTransactions).map(([type, txs]) => renderTable(type, txs))}
        </div>
        </div>
        </div>
        
    


      
  );
}
