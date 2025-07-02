import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Mail, 
  Phone,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ClientRequests() {
  const { currentUser } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: currentUser?.email || '',
    mobile: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.clientRequest(formData);
      if (response.includes('successfully')) {
        setSuccess('Your request has been sent successfully. Our support team will contact you soon.');
        setFormData({
          name: '',
          email: currentUser?.email || '',
          mobile: '',
          message: ''
        });
      } else {
        setError(response);
      }
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Support & Requests</h2>
        <p className="text-gray-600">Get help with your account or send a message to our support team</p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Message</h3>
          <p className="text-gray-600 text-sm">Send a message to our support team for assistance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Support</h3>
          <p className="text-gray-600 text-sm">Call our support hotline for immediate assistance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 text-sm">Send an email to support@minibank.com</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Send Support Request</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your mobile number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your issue or request in detail..."
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Our support team typically responds within 24 hours. 
              For urgent matters, please call our support hotline.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Request Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
        
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No recent requests</p>
          <p className="text-sm">Your support requests will appear here</p>
        </div>
      </div>
    </div>
  );
}