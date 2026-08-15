import ProjectList from "@/features/projects/components/ProjectList";
import FilterDrawer from "@/features/projects/components/projectPage/FilterDrawer";
import CreateProjectModal from "@/features/projects/components/create/CreateProjectModal";
import { useState } from "react";
import { useProjectsSummary } from "@/features/projects/utils/useProjectsSummary";
import { useProjectsListVM } from "@/features/projects/hooks/vm/useProjectsList";
import { useProjectSummaries } from "@/features/projects/hooks/useProjectSummaries";
import Pagination from "@/shared/components/ui/Pagination";
import { useProjectSearchParams } from "@/features/projects/hooks/searchParams/useProjectSearchParams";
import ProjectPageHeader from "@/features/projects/components/projectPage/header/ProjectPageHeader";
import ProjectListSkeleton from "@/features/projects/components/projectPage/skeleton/ProjectListSkeleton";
import { PAGE_LIMITS, DEFAULT_PAGE } from "@shared/constants/pagination";
import ErrorMessage from "@/shared/components/ErrorMessage";

const ProjectsPage = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const { page, search, cardView, filter, actions } = useProjectSearchParams();

  const summariesInput = {
    search,
    page,
    limit: PAGE_LIMITS.summary,
    filter,
  };

  const { data, isLoading, error } = useProjectSummaries(summariesInput);

  const projects = data?.items ?? [];
  const currentPage = data?.pagination.currentPage ?? DEFAULT_PAGE;
  const totalPages = data?.pagination.totalPages ?? 1;

  const projectsListVM = useProjectsListVM(projects);
  const projectSummary = useProjectsSummary(projectsListVM);

  if (isLoading && !projects.length) return <ProjectListSkeleton />;

  if (error)
    return (
      <ErrorMessage
        message="Etwas ist schief gelaufen"
        className="flex-center text-muted-foreground"
      />
    );

  return (
    <div className="flex flex-col min-h-full">
      <div className="relative">
        <ProjectPageHeader
          createProjectOpen={() => setIsCreateProjectOpen(true)}
          onDrawerOpen={() => setFilterDrawerOpen(true)}
          projectSummary={projectSummary}
        />

        {filterDrawerOpen && (
          <FilterDrawer
            onClose={() => setFilterDrawerOpen(false)}
            isOpen={filterDrawerOpen}
          />
        )}
      </div>

      {!projects.length && (
        <div className="flex-center text-muted-foreground">
          Keine Daten gefunden
        </div>
      )}

      <section
        className={`mt-6 grid  gap-6 mb-6 ${cardView === "card" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
      >
        <ProjectList projects={projectsListVM} />
      </section>

      <div className="mt-auto flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={actions.setPage}
        />
      </div>

      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateProjectOpen(false)}
          isOpen={isCreateProjectOpen}
        />
      )}
    </div>
  );
};
export default ProjectsPage;
