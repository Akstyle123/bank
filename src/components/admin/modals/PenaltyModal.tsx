import React, { useState } from 'react';
import { X, AlertTriangle, User, DollarSign, FileText } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { showToast } from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface PenaltyModalProps {
  onClose: () => void;
  onSuccess: () => void;
  selectedHolder?: {
    holderId: string;
    holderName: string;
    email: string;
    balance: number;
  } | null;
}

export default function PenaltyModal({ onClose, onSuccess, selectedHolder }: PenaltyModalProps) {
  const [formData, setFormData] = useState({
    hid: selectedHolder?.holderId || '',
    pamount: '',
    reason: '',
    email: selectedHolder?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hid || !formData.pamount || !formData.reason || !formData.email) {
      showToast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.pamount) <= 0) {
      showToast.error('Penalty amount must be greater than zero');
      return;
    }

    setIsLoading(true);
    const toastId = showToast.loading('Adding penalty...');

    try {
      const response = await apiService.addPenalty(formData);
      showToast.dismiss(toastId);
      
      if (response.includes('successful')) {
        showToast.success(`Penalty of ₹${formData.pamount} added successfully`);
        onSuccess();
      } else {
        showToast.error(response);
      }
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error('Failed to add penalty. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add Penalty</h2>
              <p className="text-sm opacity-90">Apply penalty charges to account</p>
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
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {selectedHolder && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-red-900">{selectedHolder.holderName}</p>
                  <p className="text-sm text-red-700">{selectedHolder.holderId}</p>
                  <p className="text-sm text-red-700">Current Balance: ₹{selectedHolder.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holder ID *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="hid"
                  value={formData.hid}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter holder ID (e.g., HID001)"
                  required
                  readOnly={!!selectedHolder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penalty Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="pamount"
                  value={formData.pamount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holder Email *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="holder@example.com"
                  required
                  readOnly={!!selectedHolder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Penalty *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Explain the reason for this penalty..."
                  required
                />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This penalty will be added to the holder's penalty balance 
                and a notification email will be sent to the account holder.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mt-3 sm:mt-0"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Apply Penalty</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
