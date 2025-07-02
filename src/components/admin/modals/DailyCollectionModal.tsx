import React, { useState } from 'react';
import { X, DollarSign, User, FileText } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { showToast } from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface DailyCollectionModalProps {
  onClose: () => void;
  onSuccess: () => void;
  selectedHolder?: {
    holderId: string;
    holderName: string;
    email: string;
    dailyCollection: number;
  } | null;
}

export default function DailyCollectionModal({ onClose, onSuccess, selectedHolder }: DailyCollectionModalProps) {
  const [formData, setFormData] = useState({
    hid: selectedHolder?.holderId || '',
    amount: '',
    collectedBy: '',
    note: ''
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
    
    if (!formData.hid || !formData.amount || !formData.collectedBy) {
      showToast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      showToast.error('Collection amount must be greater than zero');
      return;
    }

    setIsLoading(true);
    const toastId = showToast.loading('Recording daily collection...');

    try {
      const response = await apiService.addDailyCollection(formData);
      showToast.dismiss(toastId);
      
      if (response.includes('collected')) {
        showToast.success(`Daily collection of ₹${formData.amount} recorded successfully`);
        onSuccess();
      } else {
        showToast.error(response);
      }
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error('Failed to record collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Collection</h2>
              <p className="text-sm opacity-90">Record daily collection from holder</p>
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
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">{selectedHolder.holderName}</p>
                  <p className="text-sm text-blue-700">{selectedHolder.holderId}</p>
                  <p className="text-sm text-blue-700">Total Collection: ₹{selectedHolder.dailyCollection.toLocaleString()}</p>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter holder ID (e.g., HID001)"
                  required
                  readOnly={!!selectedHolder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collected By *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="collectedBy"
                  value={formData.collectedBy}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter collector name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this collection..."
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This collection will be recorded for today's date and 
                added to the holder's total collection amount.
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
                className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mt-3 sm:mt-0"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span>Record Collection</span>
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
