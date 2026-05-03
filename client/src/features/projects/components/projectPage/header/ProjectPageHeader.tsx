import { Button } from "@/shared/components/ui/button";
import ProjectToolbar from "@/features/projects/components/projectPage/header/ProjectToolbar";
import ViewToggle from "@/features/projects/components/view-controls/ViewToggle";
import type { ProjectsSummary } from "@/features/projects/utils/useProjectsSummary";

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
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projekte</h2>

        <div className="flex items-center gap-4">
          <div className="hidden sm:inline-block">
            <ViewToggle />
          </div>
          <Button
            className="bg-accent hover:bg-accent/95"
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
    </>
  );
};
export default ProjectPageHeader;
