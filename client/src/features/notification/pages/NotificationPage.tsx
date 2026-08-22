import NotificationHeader from "@/features/notification/components/NotificationHeader";
import NotificationContent from "@/features/notification/components/NotificationContent";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";
import NotificationInbox from "@/features/notification/components/inbox/NotificationInbox";
import NotificationSidebar from "@/features/notification/components/sidebar/NotificationSidebar";
import NotificationPagination from "@/features/notification/components/NotificationPagination";
import NotificationInboxSkeleton from "@/features/notification/components/skeleton/NotificationInboxSkeleton";
import NotificationEmptyState from "@/features/notification/components/skeleton/NotificationEmptyState";
import NotificationErrorState from "@/features/notification/components/skeleton/NotificationErrorState";

const NotificationPage = () => {
  const { page } = useNotificationSearchParams();

  const { data, isLoading, isError, refetch } = useNotifications();

  const notifications = data?.items ?? [];

  const unreadCount = data?.unreadCount ?? 0;
  const inboxCount = data?.inboxCount ?? 0;
  const archiveCount = data?.archiveCount ?? 0;

  const pagination = data?.pagination ?? {
    currentPage: page,
    totalPages: 0,
    totalItems: 0,
  };

  const isEmpty = !isLoading && notifications.length === 0;

  return (
    <div>
      <NotificationHeader
        totalItems={pagination.totalItems}
        unreadCount={unreadCount}
      />

      <NotificationContent>
        <div>
          {isLoading ? (
            <NotificationInboxSkeleton />
          ) : isError || !data ? (
            <NotificationErrorState refetch={refetch} />
          ) : isEmpty ? (
            <NotificationEmptyState />
          ) : (
            <>
              <NotificationInbox notifications={notifications} />

              <NotificationPagination
                totalItems={pagination.totalItems}
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
              />
            </>
          )}
        </div>

        <NotificationSidebar
          inboxCount={inboxCount}
          archiveCount={archiveCount}
        />
      </NotificationContent>
    </div>
  );
};

export default NotificationPage;
