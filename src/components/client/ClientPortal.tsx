import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Bell,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ClientDashboard from './ClientDashboard';
import ClientTransactions from './ClientTransactions';
import ClientRequests from './ClientRequests';
import ClientSettings from './ClientSettings';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser, logout } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'requests', label: 'Support', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ClientDashboard />;
      case 'transactions':
        return <ClientTransactions />;
      case 'requests':
        return <ClientRequests />;
      case 'settings':
        return <ClientSettings />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
                <p className="text-sm text-gray-600">Mini Bank - Your Account Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
                  <p className="text-xs text-gray-500">Account Holder</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}