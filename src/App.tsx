import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageProvider } from './context/MessageContext';
import HomePage from './components/HomePage';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientPortal from './components/client/ClientPortal';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppContent() {
  const { currentUser, userType, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
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
    <ThemeProvider>
      <AppProvider>
        <MessageProvider>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </MessageProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;