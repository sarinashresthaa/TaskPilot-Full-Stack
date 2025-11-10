import React, { useState } from "react";
import { GoBell } from "react-icons/go";
import { useLocation } from "react-router-dom";
import { sidebar_items } from "../../constant";
import { useAuth } from "../../lib/auth/authQueries";
import ProfileModal from "./Profile";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import { useUnreadCount } from "../../lib/notificationQueries";
import NotificationBadge from "../Notifications/NotificationBadge";

const Navbar = () => {
  const location = useLocation();
  const { data: authData } = useAuth();
  const headertext = sidebar_items.find(
    (item) => item.href === location.pathname
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = useUnreadCount();

  const user = authData?.user;
  console.log(user);
  return (
    <div className="shadow-md w-full flex items-center px-6 py-2 justify-between">
      <div className="font-semibold text-xl">
        <h1>{headertext.name}</h1>
      </div>
      <div className="inline-flex items-center gap-4">
       <div title="Notifications" className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="flex items-center hover:text-purple-600 transition-colors"
          >
            <GoBell className="text-2xl" />
            <NotificationBadge count={unreadCount} />
          </button>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        <div title="Account" className="relative">
          {/* Profile Icon */}
          <button onClick={() => setIsModalOpen(!isModalOpen)} className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#BA75FF] to-[#943BEC] rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </button>
          {/* Profile Modal */}
          {isModalOpen && <ProfileModal name={user.name} email={user.email} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
