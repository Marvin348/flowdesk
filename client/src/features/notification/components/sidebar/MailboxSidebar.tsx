import { Button } from "@/shared/components/ui/button";
import { Inbox, Archive } from "lucide-react";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";

type MailboxSidebarProps = {
  inboxCount: number;
  archiveCount: number;
};

const MailboxSidebar = ({ inboxCount, archiveCount }: MailboxSidebarProps) => {
  const {
    view,
    actions: { setNotificationView },
  } = useNotificationSearchParams();

  return (
    <section className="rounded-md border border-border bg-card p-3 shadow-xs">
      <div className="mb-3 px-1">
        <h2 className="text-sm font-medium text-foreground">Mailbox</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Aktive und archivierte Updates
        </p>
      </div>

      <div className="grid gap-1">
        <Button
          variant="mailbox"
          data-state={view === "inbox" ? "active" : "inactive"}
          className="flex w-full items-center justify-between rounded-md"
          onClick={() => setNotificationView("inbox")}
        >
          <span className="flex items-center gap-2">
            <Inbox className="size-4" />
            Inbox
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {inboxCount}
          </span>
        </Button>

        <Button
          variant="mailbox"
          data-state={view === "archive" ? "active" : "inactive"}
          className="flex w-full items-center justify-between rounded-md"
          onClick={() => setNotificationView("archive")}
        >
          <span className="flex items-center gap-2">
            <Archive className="size-4" />
            Archiv
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {archiveCount}
          </span>
        </Button>
      </div>
    </section>
  );
};
export default MailboxSidebar;

// className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
