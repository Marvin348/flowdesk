import { BellOff } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <section className="overflow-hidden h-full rounded-md border border-border bg-card shadow-xs">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Inbox</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Nach neuester Aktivität sortiert
            </p>
          </div>
          <div className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground">
            <BellOff className="size-4" />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-90 items-center justify-center px-6 py-12">
        <div className="absolute inset-x-4 top-6 space-y-3 opacity-50">
          <div className="h-12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-11/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-10/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-9/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-8/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-7/12 rounded-md border border-dashed border-border bg-muted/20" />
        </div>

        <div className="relative flex max-w-sm flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-md border  shadow-xs border-accent/20 bg-accent/10">
            <BellOff className="size-6 text-accent" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-foreground">
            Keine Benachrichtigungen
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sobald es neue Aktivitäten in deinem workspace gibt, erscheinen sie
            hier in deiner Inbox.
          </p>
        </div>
      </div>
    </section>
  );
};
export default NotificationEmptyState;
