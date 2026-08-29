import { Button } from "@/shared/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  NOTIFICATION_ACTIONS,
  type NotificationActionType,
} from "@/features/notification/constants/notificationActions";
import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";
import { usePinNotification } from "@/features/notification/hooks/usePinNotification";
import { useArchiveNotification } from "@/features/notification/hooks/useArchiveNotification";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";
import { useDeleteNotification } from "@/features/notification/hooks/useDeleteNotification";

type NotificationActionsProps = {
  notification: NotificationDto;
};

const NotificationActions = ({ notification }: NotificationActionsProps) => {
  const pinNotification = usePinNotification();
  const archiveNotification = useArchiveNotification();
  const deleteNotification = useDeleteNotification();

  const { view } = useNotificationSearchParams();

  const isPinned = notification.isPinned;
  const isArchived = notification.isArchived;

  const onMutate = (action: NotificationActionType) => {
    if (action === "pinned") {
      return pinNotification.mutate({
        notificationId: notification.id,
        pinned: !isPinned,
      });
    }

    if (action === "archived") {
      return archiveNotification.mutate({
        notificationId: notification.id,
        archived: !isArchived,
      });
    }

    if (action === "delete") {
      return deleteNotification.mutate(notification.id);
    }
  };

  const visibleActions = NOTIFICATION_ACTIONS.filter((action) => {
    if (view === "archive" && action.action === "pinned") {
      return false;
    }

    return true;
  });

  const getActionLabel = (action: NotificationActionType) => {
    if (action === "pinned") {
      return isPinned ? "Entpinnen" : "Anpinnen";
    }

    if (action === "archived") {
      return isArchived ? "Wiederherstellen" : "Archivieren";
    }

    return "Löschen";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open notification actions"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="p-1 w-fit">
        {visibleActions.map(({ icon: Icon, action }) => (
          <DropdownMenuItem
            key={action}
            className="py-2"
            onClick={() => onMutate(action)}
          >
            <Icon className="size-4" />

            {getActionLabel(action)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default NotificationActions;
