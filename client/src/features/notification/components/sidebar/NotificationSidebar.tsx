import { Bell, Clock3, UserRoundPlus } from "lucide-react";
const NotificationSidebar = () => {
  return (
    <div className="h-full">
      <aside className="flex h-full flex-col space-y-6">
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

        <section className="flex-1 rounded-md border border-border bg-card p-4 shadow-xs">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <UserRoundPlus className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Most active
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                People behind recent updates
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {["Mara Hoffmann", "Jonas Weber", "Nina Scholz"].map(
              (person, index) => (
                <div key={person} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-surface text-xs font-medium text-white">
                    {person
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{person}</p>
                    <p className="text-xs text-muted-foreground">
                      {4 - index} updates this week
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </aside>
    </div>
  );
};
export default NotificationSidebar;
