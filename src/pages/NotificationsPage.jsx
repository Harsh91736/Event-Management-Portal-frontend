import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

function NotificationsPage() {
  const { notifications, markAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`${notification.read ? 'text-gray-800' : 'text-black font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
