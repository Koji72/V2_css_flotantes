import React, { useEffect } from 'react';
import { useStore } from '../store';
import type { Notification } from '../store';

const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  // Auto-dismiss notifications after their duration
  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 3000; // Default duration: 3 seconds
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            notification-item
            min-w-[280px] max-w-md
            p-4 rounded-lg shadow-lg
            transform transition-all duration-300 ease-in-out
            animate-slide-in
            ${notification.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${notification.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${notification.type === 'info' ? 'bg-blue-600 text-white' : ''}
          `}
          onClick={() => removeNotification(notification.id)}
          role="alert"
        >
          <div className="flex items-center gap-2">
            <span className="notification-icon">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✕'}
              {notification.type === 'info' && 'ℹ'}
            </span>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter; 