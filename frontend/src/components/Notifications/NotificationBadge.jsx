import React from "react";

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;

  // Cap the display at 99+
  const displayCount = count > 99 ? "99+" : count;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
