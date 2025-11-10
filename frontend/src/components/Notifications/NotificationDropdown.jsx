import React, { useEffect, useRef } from "react";
import { useNotifications, useMarkAsRead } from "../../lib/notificationQueries";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { data: notifications, isLoading, isError } = useNotifications();
  const markAsRead = useMarkAsRead();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead.mutateAsync(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {notifications && notifications.length > 0 && (
            <span className="text-xs text-gray-500">
              {notifications.filter(n => !n.isRead).length} unread
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}

        {isError && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-500">Failed to load notifications</p>
          </div>
        )}

        {!isLoading && !isError && notifications && notifications.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        )}

        {!isLoading && !isError && notifications && notifications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications && notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
