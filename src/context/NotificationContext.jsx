import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationContext = createContext();
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketUrl = import.meta.env.VITE_API_BASE_URL
    ? new URL(import.meta.env.VITE_API_BASE_URL).origin.replace('/api/v1', '')
    : 'http://localhost:8000';

  // Add sound notification
  const notificationSound = new Audio('/notification.mp3'); // Add a sound file to public folder

  const playNotificationSound = () => {
    try {
      notificationSound.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let socketInstance = null;

    const initializeSocket = async () => {
      if (!user) return;

      try {
        socketInstance = io(socketUrl, {
          auth: { token: localStorage.getItem('authToken') },
          transports: ['polling', 'websocket'],
          upgrade: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          socketInstance.emit('join', { userId: user.id });
        });

        socketInstance.on('notification', (notification) => {
          if (mounted && notification?.message) {
            setNotifications(prev => [{
              ...notification,
              id: notification.id || Date.now(),
              createdAt: notification.createdAt || new Date().toISOString(),
              read: false
            }, ...prev]);
            setUnreadCount(prev => prev + 1);
            playNotificationSound();
            toast(notification.message, {
              action: {
                label: "View",
                onClick: () => handleNotificationClick(notification)
              },
            });
          }
        });

        // Add event-specific notifications
        socketInstance.on('eventUpdated', (data) => {
          toast.info(`Event "${data.title}" has been updated`);
          playNotificationSound();
        });

        socketInstance.on('registrationConfirmed', (data) => {
          toast.success(`Registration confirmed for "${data.eventTitle}"`);
          playNotificationSound();
        });

        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
          toast.error('Connection error occurred');
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user, socketUrl]);

  const markAsRead = (notificationId) => {
    if (!notificationId) return;

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    // Add navigation logic based on notification type
    if (notification.type === 'event') {
      navigate(`/events/${notification.eventId}`);
    } else if (notification.type === 'registration') {
      navigate('/registrations');
    }
    markAsRead(notification.id);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        clearNotifications,
        connected: socket?.connected || false,
        handleNotificationClick
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
