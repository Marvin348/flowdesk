import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";
import { notificationConfig } from "@/features/notification/utils/getNotificationConfig";
import { Circle, MoreHorizontal } from "lucide-react";
import NotificationMessage from "@/features/notification/components/inbox/NotificationMessage";
import { Button } from "@/shared/components/ui/button";
import { notificationColors } from "@/features/notification/utils/notificationColors";
import { cn } from "@/shared/lib/utils";
import {calcTimeAgo} from "@/shared/utils/calcTimeAgo"

type NotificationItemProps = {
  notification: NotificationDto;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const config = notificationConfig[notification.type];
  const colors = notificationColors[config.color];

  const Icon = config.icon;
  const entityLabel = config.entityLabel;
  const label = config.label;

  return (
    <article
      className={`grid gap-4 px-4 py-4 transition hover:bg-muted/30 sm:grid-cols-[auto_minmax(0,1fr)_auto] ${
        notification.isRead ? "bg-card" : "bg-accent/3"
      }`}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-md border",
          colors.background,
        )}
      >
        <Icon className={cn("size-5", colors.icon)} />
      </div>

      <div className="min-w-0">
        <div className="flex items-start gap-2">
          {!notification.isRead && (
            <Circle className="mt-1.5 size-2 fill-accent text-accent" />
          )}
          <NotificationMessage notification={notification} />
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {entityLabel}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{notification.actor?.name}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{label}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {calcTimeAgo(notification.createdAt)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Open notification actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </article>
  );
};
export default NotificationItem;
