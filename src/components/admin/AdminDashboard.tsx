import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  Settings,
  Bell,
  LogOut,
  User,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardOverview from './DashboardOverview';
import HolderManagement from './HolderManagement';
import FinancialOperations from './FinancialOperations';
import Reports from './Reports';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useApp();

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl hidden md:flex">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-600">Mini Bank Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm min-h-screen transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
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

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
