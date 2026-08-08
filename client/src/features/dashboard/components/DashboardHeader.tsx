import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { formatDate } from "@/shared/utils/formatDate";
import { CalendarDays, Home } from "lucide-react";

const DashboardHeader = () => {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <section className="mb-6 border-b border-border/80 pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
            <Home className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
              Übersicht
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Hallo {user.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Dein aktueller Überblick über Projekte, Aufgaben und Bereiche,
              die gerade Aufmerksamkeit brauchen.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>{formatDate(new Date().toString())}</span>
        </div>
      </div>
    </section>
  );
};
export default DashboardHeader;
