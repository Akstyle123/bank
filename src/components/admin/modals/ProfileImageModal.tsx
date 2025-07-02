import React, { useState } from 'react';
import { X, Camera, Upload, User, Save } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { showToast } from '../../ui/Toast';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ProfileManager from '../../ui/ProfileManager';

interface ProfileImageModalProps {
  holder: {
    holderId: string;
    holderName: string;
    email?: string;
    profileUrl?: string;
    documentUrl?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileImageModal({ holder, onClose, onSuccess }: ProfileImageModalProps) {
  const [profileUrl, setProfileUrl] = useState(holder.profileUrl || '');
  const [documentUrl, setDocumentUrl] = useState(holder.documentUrl || '');

  const handleProfileUpdate = (url: string) => {
    setProfileUrl(url);
    showToast.success('Profile updated successfully');
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleDocumentUpdate = (url: string) => {
    setDocumentUrl(url);
    showToast.success('Document updated successfully');
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Profile Management</h2>
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
          <ProfileManager
            userType="holder"
            userId={holder.holderId}
            userName={holder.holderName}
            userEmail={holder.email}
            currentProfileUrl={profileUrl}
            currentDocumentUrl={documentUrl}
            onProfileUpdate={handleProfileUpdate}
            onDocumentUpdate={handleDocumentUpdate}
          />

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Profile images and documents are automatically saved to Google Drive 
              and linked to the holder's account. All uploads are logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}