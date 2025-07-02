import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  User, 
  FileText, 
  X, 
  Save, 
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { showToast } from './Toast';
import LoadingSpinner from './LoadingSpinner';

interface ProfileManagerProps {
  userType: 'admin' | 'holder';
  userId: string;
  userName: string;
  userEmail?: string;
  currentProfileUrl?: string;
  currentDocumentUrl?: string;
  onProfileUpdate?: (url: string) => void;
  onDocumentUpdate?: (url: string) => void;
  className?: string;
}

export default function ProfileManager({
  userType,
  userId,
  userName,
  userEmail,
  currentProfileUrl,
  currentDocumentUrl,
  onProfileUpdate,
  onDocumentUpdate,
  className = ''
}: ProfileManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'profile' | 'document' | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'profile' | 'document') => {
    setUploadType(type);
    if (type === 'profile') {
      profileInputRef.current?.click();
    } else {
      documentInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'document') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === 'profile') {
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select a valid image file for profile picture');
        return;
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size must be less than 5MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }

    await uploadFile(file, type);
  };

  const uploadFile = async (file: File, type: 'profile' | 'document') => {
    setIsUploading(true);
    const toastId = showToast.loading(`Uploading ${type}...`);

    try {
      let response;

      if (userType === 'admin') {
        if (type === 'profile') {
          response = await apiService.uploadAdminProfile(file, userEmail || userId);
        } else {
          response = await apiService.uploadAdminDocument(file, userEmail || userId);
        }
      } else {
        if (type === 'profile') {
          response = await apiService.uploadHolderProfile(file, userId, userName);
        } else {
          response = await apiService.uploadHolderDocument(file, userId, userName);
        }
      }

      showToast.dismiss(toastId);

      if (response.success) {
        showToast.success(`${type === 'profile' ? 'Profile picture' : 'Document'} uploaded successfully`);
        
        if (type === 'profile' && onProfileUpdate) {
          onProfileUpdate(response.url);
        } else if (type === 'document' && onDocumentUpdate) {
          onDocumentUpdate(response.url);
        }
        
        setShowPreview(false);
        setPreviewUrl(null);
      } else {
        showToast.error(response.message || `Failed to upload ${type}`);
      }
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(`Failed to upload ${type}. Please try again.`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadType(null);
    }
  };

  const handleCameraCapture = (type: 'profile' | 'document') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        handleFileChange({ target: { files: [file] } } as any, type);
      }
    };
    input.click();
  };

  const ProfileImage = () => (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg">
        {currentProfileUrl ? (
          <img
            src={currentProfileUrl}
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold ${currentProfileUrl ? 'hidden' : ''}`}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
      
      {/* Upload Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFileSelect('profile')}
            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            title="Upload from device"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleCameraCapture('profile')}
            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            title="Take photo"
          >
            <Camera className="h-4 w-4" />
          </button>
          {currentProfileUrl && (
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              title="View full size"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && uploadType === 'profile' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-full flex items-center justify-center">
          <LoadingSpinner size="small" color="white" />
        </div>
      )}
    </div>
  );

  const DocumentSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Documents
        </h4>
        <button
          onClick={() => handleFileSelect('document')}
          disabled={isUploading}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50"
        >
          {isUploading && uploadType === 'document' ? (
            <LoadingSpinner size="small" />
          ) : (
            'Upload'
          )}
        </button>
      </div>
      
      {currentDocumentUrl ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Document</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded document</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={currentDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="View document"
            >
              <Eye className="h-4 w-4" />
            </a>
            <a
              href={currentDocumentUrl}
              download
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Download document"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No document uploaded</p>
          <button
            onClick={() => handleFileSelect('document')}
            className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            Upload Document
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'profile')}
        className="hidden"
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,image/*"
        onChange={(e) => handleFileChange(e, 'document')}
        className="hidden"
      />

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <ProfileImage />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{userId}</p>
          {userEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => handleFileSelect('profile')}
              disabled={isUploading}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50"
            >
              {currentProfileUrl ? 'Change Photo' : 'Add Photo'}
            </button>
            <button
              onClick={() => handleCameraCapture('profile')}
              disabled={isUploading}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium disabled:opacity-50"
            >
              Take Photo
            </button>
          </div>
        </div>
      </div>

      {/* Document Section */}
      <DocumentSection />

      {/* Preview Modal */}
      {showPreview && (previewUrl || currentProfileUrl) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl max-h-full">
            <button
              onClick={() => {
                setShowPreview(false);
                setPreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewUrl || currentProfileUrl}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}