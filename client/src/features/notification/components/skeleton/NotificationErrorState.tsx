import { AlertTriangle, RefreshCw } from "lucide-react";

const NotificationErrorState = ({ refetch }: { refetch: () => void }) => {
  return (
    <section
      className="h-full overflow-hidden rounded-md border border-border bg-card shadow-xs"
      role="alert"
    >
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Inbox</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Benachrichtigungen konnten nicht geladen werden
            </p>
          </div>
          <div className="inline-flex size-8 items-center justify-center rounded-md text-error">
            <AlertTriangle className="size-4" />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-90 items-center justify-center px-6 py-12">
        <div className="absolute inset-x-4 top-6 space-y-3 opacity-60">
          <div className="h-12 rounded-md border border-dashed border-error/20 bg-error/5" />
          <div className="mx-auto h-12 w-11/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-10/12 rounded-md border border-dashed border-error/20 bg-error/5" />
          <div className="mx-auto h-12 w-9/12 rounded-md border border-dashed border-border bg-muted/20" />
          <div className="mx-auto h-12 w-8/12 rounded-md border border-dashed border-error/20 bg-error/5" />
        </div>

        <div className="relative flex max-w-sm flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-md border border-error/30 bg-error/10 text-error shadow-xs">
            <AlertTriangle className="size-6" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-foreground">
            Inbox gerade nicht erreichbar
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Deine Benachrichtigungen konnten nicht geladen werden. Versuch es
            gleich nochmal, meistens ist es nur ein kurzer Moment.
          </p>

          <button
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground"
            onClick={() => refetch()}
          >
            <RefreshCw className="size-3.5" />
            Seite neu laden
          </button>
        </div>
      </div>
    </section>
  );
};
export default NotificationErrorState;
