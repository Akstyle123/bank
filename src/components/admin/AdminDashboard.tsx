import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ModernNavbar from '../ui/ModernNavbar';
import DashboardOverview from './DashboardOverview';
import HolderManagement from './HolderManagement';
import FinancialOperations from './FinancialOperations';
import Reports from './Reports';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'holders', label: 'Account Holders', icon: Users },
    { id: 'operations', label: 'Financial Operations', icon: PiggyBank },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'holders':
        return <HolderManagement />;
      case 'operations':
        return <FinancialOperations />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Modern Navbar */}
      <ModernNavbar
        title="Admin Dashboard"
        subtitle="Mini Bank Management System"
        userType="admin"
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-auto`}
          style={{ top: '64px' }}
        >
          <nav className="p-4 space-y-2 overflow-y-auto h-full">
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
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm'
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
        <main className="flex-1 p-4 md:p-6 overflow-auto lg:ml-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}