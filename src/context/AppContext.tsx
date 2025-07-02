import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
  email: string;
  name?: string;
  hid?: string;
}

interface AppContextType {
  currentUser: User | null;
  userType: 'admin' | 'client' | null;
  isLoading: boolean;
  login: (email: string, password: string, type: 'admin' | 'client') => Promise<string>;
  verifyOTP: (email: string, otp: string, type: 'admin' | 'client') => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, type: 'admin' | 'client') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'admin' | 'client' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('bankUser');
    const storedType = localStorage.getItem('bankUserType');
    
    if (storedUser && storedType) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(storedType as 'admin' | 'client');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: 'admin' | 'client'): Promise<string> => {
    try {
      const action = type === 'admin' ? 'login' : 'clientLogin';
      const response = await apiService.login(email, password, action);
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const verifyOTP = async (email: string, otp: string, type: 'admin' | 'client'): Promise<boolean> => {
    try {
      const action = type === 'admin' ? 'verifyOTP' : 'clientVerifyOTP';
      const response = await apiService.verifyOTP(email, otp, action);
      
      if (response === 'Login successful.') {
        const user = { email };
        setCurrentUser(user);
        setUserType(type);
        
        // Store session
        localStorage.setItem('bankUser', JSON.stringify(user));
        localStorage.setItem('bankUserType', type);
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      if (currentUser && userType) {
        const action = userType === 'admin' ? 'logout' : 'clientLogout';
        await apiService.logout(currentUser.email, action);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setUserType(null);
      localStorage.removeItem('bankUser');
      localStorage.removeItem('bankUserType');
    }
  };

  const setUser = (user: User, type: 'admin' | 'client') => {
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem('bankUser', JSON.stringify(user));
    localStorage.setItem('bankUserType', type);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userType,
      isLoading,
      login,
      verifyOTP,
      logout,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}