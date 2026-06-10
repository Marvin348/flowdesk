import { FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router";

const DashboardZeroState = () => {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-accent border-dashed bg-card px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-md bg-muted text-accent">
          <FolderKanban className="size-8" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground">
          Willkommen in FlowDesk
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Erstelle dein erstes Projekt, um Aufgaben zu planen, dein Team zu
          organisieren und Fortschritt sichtbar zu machen.
        </p>

        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary-foreground duration-200 hover:opacity-90"
        >
          <Plus />
          Erstes Projekt erstellen
        </Link>
      </div>
    </div>
  );
};

export default DashboardZeroState;
