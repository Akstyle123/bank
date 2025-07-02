import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './components/HomePage';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientPortal from './components/client/ClientPortal';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppContent() {
  const { currentUser, userType, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentUser) {
    return <HomePage />;
  }

  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  if (userType === 'client') {
    return <ClientPortal />;
  }

  return <HomePage />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </AppProvider>
  );
}

export default App;
