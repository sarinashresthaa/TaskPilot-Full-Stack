import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./auth/authQueries";

// Fetch all notifications for the current user
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data.notifications;
    },
    // Enable polling every 5 seconds
    refetchInterval: 5000,
    // Don't refetch when window is not focused
    refetchIntervalInBackground: false,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
    staleTime: 0, // Always consider data stale so it refetches
  });
};

// Mark a notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const res = await api.patch(`/notifications/${notificationId}/read`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate notifications query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Get count of unread notifications
export const useUnreadCount = () => {
  const { data: notifications } = useNotifications();

  if (!notifications) return 0;

  return notifications.filter(notification => !notification.isRead).length;
};
