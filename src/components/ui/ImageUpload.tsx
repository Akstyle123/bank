import React, { useState, useRef } from 'react';
import { Upload, X, Image, File, Camera } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  preview?: boolean;
  className?: string;
}

export default function ImageUpload({
  onUpload,
  maxFiles = 5,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxSize = 10,
  preview = true,
  className = ''
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.name.toLowerCase().endsWith(type);
      });

      if (!isValidType) {
        alert(`File ${file.name} is not a supported format.`);
        return;
      }

      validFiles.push(file);

      // Create preview for images
      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const updatedFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onUpload(updatedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <Image className="h-8 w-8 text-gray-400" />
            <File className="h-8 w-8 text-gray-400" />
          </div>
          
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Drop files here or click to upload
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Support for images, PDFs, and documents up to {maxSize}MB
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={openFileDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Choose Files</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                // Trigger camera on mobile devices
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  handleFiles(target.files);
                };
                input.click();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>Camera</span>
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {/* Preview or Icon */}
                <div className="flex-shrink-0">
                  {file.type.startsWith('image/') && previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <File className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}