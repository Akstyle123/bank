import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface Message {
  messageId: string;
  timestamp: string;
  subject: string;
  message: string;
  sender: string;
  priority: 'Low' | 'Normal' | 'High';
  seen: boolean;
  attachments?: string[];
}

interface Notification {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  seen: boolean;
  priority: 'Low' | 'Normal' | 'High';
}

interface MessageContextType {
  messages: Message[];
  notifications: Notification[];
  unreadCount: number;
  notificationCount: number;
  isLoading: boolean;
  sendMessage: (data: any) => Promise<boolean>;
  markMessagesSeen: () => Promise<void>;
  markNotificationsSeen: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshMessages = async () => {
    try {
      setIsLoading(true);
      // Implement message fetching logic here
      // const response = await apiService.getInbox({ email: currentUser?.email, role: 'client' });
      // setMessages(response.inbox || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      // Implement notification fetching logic here
      // const response = await apiService.getClientNotifications({ hid: currentUser?.hid });
      // setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const sendMessage = async (data: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Implement message sending logic here
      // const response = await apiService.clientRequest(data);
      await refreshMessages();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesSeen = async () => {
    try {
      // Implement mark messages as seen logic here
      // await apiService.markClientNotificationsSeen({ hid: currentUser?.hid });
      setUnreadCount(0);
      await refreshMessages();
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const markNotificationsSeen = async () => {
    try {
      // Implement mark notifications as seen logic here
      setNotificationCount(0);
      await refreshNotifications();
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
    }
  };

  useEffect(() => {
    const unseenMessages = messages.filter(m => !m.seen).length;
    setUnreadCount(unseenMessages);
  }, [messages]);

  useEffect(() => {
    const unseenNotifications = notifications.filter(n => !n.seen).length;
    setNotificationCount(unseenNotifications);
  }, [notifications]);

  return (
    <MessageContext.Provider value={{
      messages,
      notifications,
      unreadCount,
      notificationCount,
      isLoading,
      sendMessage,
      markMessagesSeen,
      markNotificationsSeen,
      refreshMessages,
      refreshNotifications
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}