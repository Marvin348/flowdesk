import MailboxSidebar from "@/features/notification/components/sidebar/MailboxSidebar";
import NotificationQuickFilter from "@/features/notification/components/sidebar/NotificationQuickFilter";
import NotificationSettingsViewCard from "@/features/notification/components/settings/NotificationSettingsViewCard";

type NotificationSidebarProps = {
  inboxCount: number;
  archiveCount: number;
};

const NotificationSidebar = ({
  inboxCount,
  archiveCount,
}: NotificationSidebarProps) => {
  return (
    <div className="h-full">
      <aside className="flex h-full flex-col space-y-6">
        <MailboxSidebar inboxCount={inboxCount} archiveCount={archiveCount} />
        <NotificationQuickFilter />
        <NotificationSettingsViewCard />
      </aside>
    </div>
  );
};
export default NotificationSidebar;
 