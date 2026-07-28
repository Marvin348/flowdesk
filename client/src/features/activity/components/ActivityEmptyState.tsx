import { Activity } from "lucide-react";

const ActivityEmptyState = () => {
  return (
    <section className="h-full overflow-hidden rounded-md border border-accent border-dashed bg-card shadow-xs">
      <div className="flex h-full items-center justify-center px-6 py-12 text-center">
        <div className="relative flex max-w-sm flex-col items-center">
          <div className="flex size-14 items-center justify-center rounded-md border border-accent/20 bg-accent/10 shadow-xs">
            <Activity className="size-6 text-accent" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-foreground">
            Noch keine Aktivitäten
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sobald etwas im Workspace passiert, erscheint es hier in deiner
            Aktivitätsübersicht.
          </p>
        </div>
      </div>
    </section>
  );
};
export default ActivityEmptyState;
