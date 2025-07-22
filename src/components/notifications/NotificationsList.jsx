import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { format } from 'date-fns';

function NotificationsList() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No notifications</p>
      ) : (
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''
                }`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(notification.createdAt), 'PPp')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsList;
