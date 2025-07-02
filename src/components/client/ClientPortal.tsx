import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ModernNavbar from '../ui/ModernNavbar';
import ClientDashboard from './ClientDashboard';
import ClientTransactions from './ClientTransactions';
import ClientRequests from './ClientRequests';
import ClientSettings from './ClientSettings';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useApp();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Navbar */}
      <ModernNavbar
        title="Client Portal"
        subtitle="Mini Bank - Your Account Dashboard"
        userType="client"
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-auto`}
          style={{ top: '64px' }}
        >
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}