import React, { useState } from 'react';
import { X, Camera, Upload, User, Save } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { showToast } from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface ProfileImageModalProps {
  holder: {
    holderId: string;
    holderName: string;
    profileUrl?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileImageModal({ holder, onClose, onSuccess }: ProfileImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(holder.profileUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast.error('Please select an image file');
      return;
    }

    setIsLoading(true);
    const toastId = showToast.loading('Uploading profile image...');

    try {
      const response = await apiService.uploadFile(selectedFile, 'holder', {
        holderId: holder.holderId,
        holderName: holder.holderName,
        type: 'profile'
      });

      showToast.dismiss(toastId);
      
      if (response.includes('successfully')) {
        showToast.success('Profile image uploaded successfully');
        onSuccess();
      } else {
        showToast.error(response);
      }
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error('Failed to upload profile image');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Profile Image</h2>
              <p className="text-sm opacity-90">{holder.holderName}</p>
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
          {/* Current/Preview Image */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={holder.holderName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
                  {holder.holderName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {holder.holderId} - {holder.holderName}
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Profile Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="profile-upload"
                />
                <label
                  htmlFor="profile-upload"
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to select image or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {selectedFile && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedFile.name}
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The profile image will be visible in the account holder list 
                and will be associated with this holder's account.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}