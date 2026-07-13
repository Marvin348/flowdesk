import { ArrowRight, CheckCircle2, LogIn, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";

const InviteSuccessPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8 text-foreground sm:px-8">
      <section className="w-full max-w-lg overflow-hidden rounded-md border bg-card shadow-sm">
        <div className="border-b px-6 py-6 text-center sm:px-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="mt-5 text-sm font-medium text-accent">
            FlowDesk Invite
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Einladung erfolgreich angenommen
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Dein Account wurde erstellt und mit dem eingeladenen Workspace
            verbunden. Du kannst dich jetzt mit deinen neuen Zugangsdaten
            einloggen.
          </p>
        </div>

        <div className="grid gap-3 border-b bg-muted/30 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Workspace-Zugang ist bereit</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Deine Einladung wurde verifiziert und deinem Team zugeordnet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm">
            <LogIn className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Nächster Schritt: einloggen</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Danach landest du direkt in deinem FlowDesk Workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <Button asChild size="lg" className="w-full">
            <Link to="/login">
              Zum Login
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default InviteSuccessPage;
