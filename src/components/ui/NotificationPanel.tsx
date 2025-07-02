import React, { useEffect } from 'react';
import { X, Bell, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, notificationCount, markNotificationsSeen, refreshNotifications } = useMessages();

  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen, refreshNotifications]);

  const handleMarkAllSeen = () => {
    markNotificationsSeen();
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'Normal':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
      case 'Low':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/50';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notificationCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {notificationCount > 0 && (
                <button
                  onClick={handleMarkAllSeen}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.seen ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          !notification.seen 
                            ? 'font-medium text-gray-900 dark:text-white' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === 'High' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : notification.priority === 'Normal'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                      </div>
                      {!notification.seen && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}