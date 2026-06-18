import { MailCheck, ShieldCheck, Timer } from "lucide-react";
import { Spinner } from "@/shared/components/ui/spinner";

const InviteLoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8 text-foreground sm:px-8">
      <section
        className="w-full max-w-lg overflow-hidden rounded-md border bg-card shadow-sm"
        aria-live="polite"
      >
        <div className="border-b px-6 py-6 text-center sm:px-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-accent">
            <Spinner className="size-7" />
          </div>

          <p className="mt-5 text-sm font-medium text-accent">FlowDesk Invite</p>
          <h1 className="mt-2 text-2xl font-semibold">
            Einladung wird geprüft...
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Wir prüfen, ob dieser Einladungslink noch gültig ist und zu deinem
            Workspace passt.
          </p>
        </div>

        <div className="grid gap-3 bg-muted/30 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Token wird verifiziert</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Der Link wird sicher mit dem Server abgeglichen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <Timer className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Gültigkeit wird geprüft</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Abgelaufene oder bereits verwendete Einladungen werden erkannt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Einladung wird vorbereitet</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Danach kannst du deinen Zugang für den Workspace einrichten.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InviteLoadingState;
