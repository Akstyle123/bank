import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MobileNavbar from '../ui/MobileNavbar';
import DashboardOverview from './DashboardOverview';
import HolderManagement from './HolderManagement';
import FinancialOperations from './FinancialOperations';
import Reports from './Reports';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useApp();

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
      {/* Mobile-Friendly Navbar */}
      <MobileNavbar
        title="Admin Dashboard"
        subtitle="Mini Bank Management System"
        userType="admin"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">
        {renderContent()}
      </main>
    </div>
  );
}