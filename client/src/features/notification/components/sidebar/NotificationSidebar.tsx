import { Bell, Clock3,} from "lucide-react";
import MailboxSidebar from "./MailboxSidebar";

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

        <section className="rounded-md border border-border bg-card p-4 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-foreground">Delivery</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Current notification preferences
              </p>
            </div>
            <Bell className="size-5 text-accent" />
          </div>

          <div className="space-y-3">
            {["Project assignments", "Task reminders", "Comment replies"].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
                >
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    On
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-4 shadow-xs">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Clock3 className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Quiet window
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Muted until tomorrow at 08:00
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Unread</p>
              <p className="mt-1 text-xl font-semibold text-foreground">3</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="mt-1 text-xl font-semibold text-foreground">7</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
};
export default NotificationSidebar;
