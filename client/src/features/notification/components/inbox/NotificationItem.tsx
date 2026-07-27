import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";
import { notificationConfig } from "@/features/notification/utils/getNotificationConfig";
import { Circle, MoreHorizontal, Check } from "lucide-react";
import NotificationMessage from "@/features/notification/components/inbox/NotificationMessage";
import { Button } from "@/shared/components/ui/button";
import { notificationColors } from "@/features/notification/utils/notificationColors";
import { cn } from "@/shared/lib/utils";
import { calcTimeAgo } from "@/shared/utils/calcTimeAgo";
import { useMarkNotificationAsRead } from "@/features/notification/hooks/useMarkNotificationAsRead";

type NotificationItemProps = {
  notification: NotificationDto;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { mutate, isPending, isError } = useMarkNotificationAsRead();

  const config = notificationConfig[notification.type];
  const colors = notificationColors[config.color];

  const Icon = config.icon;
  const entityLabel = config.entityLabel;
  const label = config.label;

  return (
    <article
      className={`group grid gap-4 p-4 transition border-b last:border-none sm:grid-cols-[auto_minmax(0,1fr)_auto] hover:bg-muted/30 ${
        notification.isRead ? "bg-card" : "bg-accent/3"
      }`}
    >
      <div
        className={cn(
          "flex shrink-0 size-10 items-center justify-center rounded-md border",
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
        <div className="flex items-center gap-1">
          {!notification.isRead && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Als gelesen markieren"
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:inline-flex group-focus-within:inline-flex"
              disabled={isPending}
              onClick={() => mutate(notification.id)}
            >
              <Check className="size-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            aria-label="Open notification actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};
export default NotificationItem;
