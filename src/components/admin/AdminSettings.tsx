import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Key,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('admins');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'admins', label: 'Admin Management', icon: Users },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiService.addAdmin(newAdmin);
      setMessage(response);
      if (response.includes('successfully')) {
        setNewAdmin({ email: '', password: '' });
        setShowAddAdmin(false);
      }
    } catch (error) {
      setMessage('Failed to add admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdminManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Admin Management</h3>
        <button
          onClick={() => setShowAddAdmin(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {showAddAdmin && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Add New Administrator</h4>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter secure password"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowAddAdmin(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Add Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-semibold text-gray-900">Current Administrators</h4>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Admin list will be displayed here</p>
            <p className="text-sm">Use the API to fetch current admin list</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Key className="h-5 w-5 text-orange-600" />
          </div>
          <h4 className="text-md font-semibold text-gray-900">OTP Settings</h4>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">OTP Expiry Time</p>
              <p className="text-sm text-gray-600">Currently set to 5 minutes</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Send security alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Settings className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="text-md font-semibold text-gray-900">Bank Configuration</h4>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Bank Name</p>
              <p className="text-sm text-gray-600">MINI BANK</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Support Email</p>
              <p className="text-sm text-gray-600">support@minibank.com</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto Backup</p>
              <p className="text-sm text-gray-600">Daily backup of all data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'admins':
        return renderAdminManagement();
      case 'security':
        return renderSecuritySettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderAdminManagement();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}