import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MobileNavbar from '../ui/MobileNavbar';
import ClientDashboard from './ClientDashboard';
import ClientTransactions from './ClientTransactions';
import ClientRequests from './ClientRequests';
import ClientSettings from './ClientSettings';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useApp();

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
      {/* Mobile-Friendly Navbar */}
      <MobileNavbar
        title="Client Portal"
        subtitle="Mini Bank - Your Account Dashboard"
        userType="client"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="p-4 md:p-6 pb-20 lg:pb-6">
        {renderContent()}
      </main>
    </div>
  );
}