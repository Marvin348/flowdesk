import NotificationItem from "@/features/notification/components/inbox/NotificationItem";
import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";

type NotificationListProps = {
  notifications: NotificationDto[];
};

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
export default NotificationList;
