import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";
import NotificationList from "@/features/notification/components/inbox/NotificationList";
import NotificationToolbar from "@/features/notification/components/inbox/NotificationToolbar";
import { MoreHorizontal } from "lucide-react";

type NotificationInboxProps = {
  notifications: NotificationDto[];
};

const NotificationInbox = ({ notifications }: NotificationInboxProps) => {
  return (
    <div>
      <NotificationToolbar />
      <section className="overflow-hidden rounded-md border border-border bg-card shadow-xs">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Inbox</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Nach neuester Aktivität sortiert
              </p>
            </div>
            <button
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-card hover:text-foreground"
              aria-label="More notification actions"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>
        <NotificationList notifications={notifications}/>
      </section>
    </div>
  );
};
export default NotificationInbox;
