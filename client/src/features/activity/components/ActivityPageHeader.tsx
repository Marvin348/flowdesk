import ActivityToolbar from "@/features/activity/components/ActivityToolbar";
import { Activity } from "lucide-react";

const ActivityPageHeader = () => {
  return (
    <header className="mb-6 border-b border-border/80">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
            <Activity className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">
              Aktivität
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
              Verfolge Aufgaben, Dateien, Projekte und Teamänderungen an einem
              zentralen Ort.
            </p>
          </div>
        </div>

        <div>
          <ActivityToolbar />
        </div>
      </div>
    </header>
  );
};
export default ActivityPageHeader;
