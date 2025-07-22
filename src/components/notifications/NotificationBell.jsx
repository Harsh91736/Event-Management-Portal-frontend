import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaBell, FaCheckCircle, FaCalendarAlt, FaUser, FaTimesCircle, FaTrash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, handleNotificationClick, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'event', label: 'Events' },
    { id: 'registration', label: 'Registrations' },
    { id: 'alert', label: 'Alerts' }
  ];

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event': return <FaCalendarAlt className="text-blue-500" />;
      case 'registration': return <FaUser className="text-green-500" />;
      case 'alert': return <FaTimesCircle className="text-red-500" />;
      default: return <FaCheckCircle className="text-gray-500" />;
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearNotifications();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-blue-200 transition-colors group"
      >
        <FaBell className="h-6 w-6 transform group-hover:rotate-[15deg] transition-transform duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 transform transition-all duration-300 origin-top">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-gray-500 hover:text-gray-700"
                title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
              >
                {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="border-b px-4 py-2 flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === category.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <FaBell className="text-gray-400 text-4xl mb-2" />
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      handleNotificationClick(notification);
                      setIsOpen(false);
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(notification.createdAt), 'PPpp')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t px-4 py-3 flex justify-between">
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <FaTrash className="mr-1" />
                Clear all
              </button>
              <button
                onClick={() => navigate('/notifications')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
