import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaBell,
  FaTasks,
  FaProjectDiagram,
  FaComment
} from "react-icons/fa";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'task_assigned':
      case 'task_updated':
        return <FaTasks className="text-blue-500" />;
      case 'task_completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'task_overdue':
      case 'deadline_reminder':
        return <FaExclamationCircle className="text-red-500" />;
      case 'project_invitation':
      case 'project_update':
        return <FaProjectDiagram className="text-purple-500" />;
      case 'comment_mention':
      case 'comment_reply':
        return <FaComment className="text-yellow-500" />;
      case 'welcome_message':
        return <FaBell className="text-indigo-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1 text-xl">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {getTimeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
