import ProjectList from "@/components/pages/projectsPage/ProjectList";
import FilterDrawer from "@/components/pages/projectsPage/query-controls/FilterDrawer";
import FilterPanel from "@/components/pages/projectsPage/query-controls/FilterPanel";
import ViewToggle from "@/components/projects/view-controls/ViewToggle";
import CreateProjectModal from "@/components/pages/projectsPage/create/CreateProjectModal";
import { useState } from "react";
import { useProjectsSummary } from "@/hooks/useProjectsSummary";
import { useProjectsListVM } from "@/domain/projects/useProjectsList";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProjectSummaries } from "@/queries/projects/useProjectSummaries";
import Pagination from "@/components/pagination/Pagination";
import { useProjectQueryState } from "@/hooks/projects/useProjectQueryState";

const ProjectsPage = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { page, search, cardView, filter, actions } = useProjectQueryState();

  const summariesInput = {
    search,
    page,
    limit: 9,
    filter,
  };

  const { data, isLoading, error } = useProjectSummaries(summariesInput);

  const projects = data?.items ?? [];
  const currentPage = page;
  const totalPages = data?.totalPages ?? 1;

  const projectsListVM = useProjectsListVM(projects);
  const projectSummary = useProjectsSummary(projectsListVM);

  if (isLoading && !projects.length)
    return (
      <div className="flex-center">
        <Spinner className="size-8 text-accent" />
      </div>
    );

  if (error)
    return (
      <div className="flex-center text-muted-foreground">
        Etwas ist schief gelaufen
      </div>
    );

  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projekte</h2>

        <div className="flex items-center gap-4">
          <div className="hidden sm:inline-block">
            <ViewToggle />
          </div>
          <Button
            className="bg-accent hover:bg-accent/95"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Neues Projekt
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="mb-6">
          <FilterPanel
            onOpen={() => setFilterDrawerOpen(true)}
            projectSummary={projectSummary}
          />
        </div>

        {!projects.length && (
          <div className="flex-center text-muted-foreground">
            Keine Daten gefunden
          </div>
        )}

        {filterDrawerOpen && (
          <FilterDrawer
            onClose={() => setFilterDrawerOpen(false)}
            isOpen={filterDrawerOpen}
          />
        )}
      </div>

      <section
        className={`grid  gap-6 mb-6 ${cardView === "card" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
      >
        <ProjectList projects={projectsListVM} />
      </section>

      {projects.length > 0 && totalPages > 1 && (
        <div className="mt-auto flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={actions.setPage}
          />
        </div>
      )}

      {isModalOpen && (
        <CreateProjectModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};
export default ProjectsPage;
