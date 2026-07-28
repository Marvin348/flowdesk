import { useUnreadNotificationCount } from "@/features/notification/hooks/useUnreadNotificationCount";

const NotificationSidebarBadge = () => {
  const {
    data: unreadCount,
    isLoading,
    isError,
  } = useUnreadNotificationCount();

  if (isLoading || isError || !unreadCount) return null;

  return (
    <span className="ml-auto min-w-5 rounded-full bg-accent/10 px-1.5 py-0.5 text-center text-sm font-medium text-accent">
      {unreadCount > 99 ? "+99" : unreadCount}
    </span>
  );
};
export default NotificationSidebarBadge;
