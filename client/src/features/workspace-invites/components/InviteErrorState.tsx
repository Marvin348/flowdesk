import { AlertTriangle, Clock3, MailPlus } from "lucide-react";

const InviteErrorState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8 text-foreground sm:px-8">
      <section
        className="w-full max-w-lg overflow-hidden rounded-md border bg-card shadow-sm"
        role="alert"
      >
        <div className="border-b px-6 py-6 text-center sm:px-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-md border border-error/30 bg-error/10 text-error">
            <AlertTriangle className="size-7" />
          </div>

          <p className="mt-5 text-sm font-medium text-error">
            FlowDesk Invite
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Einladung nicht mehr gültig
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Dieser Einladungslink ist abgelaufen, wurde bereits verwendet oder
            ist ungültig. Bitte fordere eine neue Einladung an.
          </p>
        </div>

        <div className="grid gap-3 bg-muted/30 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Link konnte nicht verifiziert werden</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Aus Sicherheitsgründen können Einladungen nur einmal und nur
                innerhalb ihrer Gültigkeit genutzt werden.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <MailPlus className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Neue Einladung anfordern</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Wende dich an dein Team oder deine Workspace-Administration,
                damit ein frischer Link erstellt werden kann.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InviteErrorState;
