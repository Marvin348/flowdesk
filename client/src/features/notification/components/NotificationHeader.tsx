import { BellDot } from "lucide-react";

type NotificationHeaderProps = {
  totalItems: number;
  unreadCount: number;
};

const NotificationHeader = ({
  totalItems,
  unreadCount,
}: NotificationHeaderProps) => {
  return (
    <header className="border-b border-border/80 pb-5">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
            <BellDot className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Benachrichtigungen
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Verfolgen Aufgaben, Kommentare, Fälligkeitstermine und
              Aktualisierungen im workspace.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md border border-border bg-card px-3 py-1.5 text-foreground">
            {unreadCount} ungelesen
          </span>
          <span className="rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground">
            {totalItems} total
          </span>
        </div>
      </div>
    </header>
  );
};
export default NotificationHeader;
