import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Search, 
  Menu, 
  X, 
  User,
  Settings,
  LogOut,
  Shield,
  MessageSquare,
  Home,
  CreditCard,
  FileText,
  Users,
  PiggyBank,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useMessages } from '../../context/MessageContext';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import MessagePanel from './MessagePanel';

interface MobileNavbarProps {
  title: string;
  subtitle?: string;
  userType: 'admin' | 'client';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onMenuToggle?: () => void;
}

export default function MobileNavbar({ 
  title, 
  subtitle, 
  userType, 
  activeTab,
  onTabChange,
  onMenuToggle
}: MobileNavbarProps) {
  const { currentUser, logout } = useApp();
  const { unreadCount, notificationCount } = useMessages();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const isAdmin = userType === 'admin';

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'holders', label: 'Holders', icon: Users },
    { id: 'operations', label: 'Operations', icon: PiggyBank },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clientTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'requests', label: 'Support', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <>
      {/* Main Navbar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${
                  isAdmin 
                    ? 'from-blue-600 to-indigo-600' 
                    : 'from-green-600 to-emerald-600'
                }`}>
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle for Mobile */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Desktop Search */}
              <div className="hidden sm:flex flex-1 max-w-xs">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <ThemeToggle />
              
              {/* Messages */}
              <button 
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`p-1.5 rounded-lg ${
                    isAdmin ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                  }`}>
                    <Shield className={`h-4 w-4 ${
                      isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-32">
                      {currentUser?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isAdmin ? 'Admin' : 'Client'}
                    </p>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {currentUser?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isAdmin ? 'Administrator' : 'Account Holder'}
                      </p>
                    </div>
                    
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="pb-4 sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange?.(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? `${isAdmin ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 lg:hidden z-30">
        <nav className="flex justify-around py-2">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `${isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Message Panel */}
      <MessagePanel 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
      />
    </>
  );
}