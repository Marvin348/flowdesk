import { Button } from "@/shared/components/ui/button";
import ProjectToolbar from "@/features/projects/components/projectPage/header/ProjectToolbar";
import ViewToggle from "@/features/projects/components/view-controls/ViewToggle";
import type { ProjectsSummary } from "@/features/projects/utils/useProjectsSummary";
import { Folders } from "lucide-react";

type ProjectPageHeaderProps = {
  onDrawerOpen: () => void;
  projectSummary: ProjectsSummary;
  createProjectOpen: () => void;
};

const ProjectPageHeader = ({
  onDrawerOpen,
  projectSummary,
  createProjectOpen,
}: ProjectPageHeaderProps) => {
  return (
    <header>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
            <Folders className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">
              Projekte
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
              Verfolge Aufgaben, Kommentare, Fälligkeitstermine und
              Aktualisierungen im workspace.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 text-sm sm:w-auto md:justify-end">
          <div className="hidden sm:inline-block">
            <ViewToggle />
          </div>
          <Button
            className="w-full bg-accent hover:bg-accent/95 sm:w-auto"
            size="sm"
            onClick={createProjectOpen}
          >
            Neues Projekt
          </Button>
        </div>
      </div>

      <ProjectToolbar
        onDrawerOpen={onDrawerOpen}
        projectSummary={projectSummary}
      />
    </header>
  );
};
export default ProjectPageHeader;
