import ProjectList from "@/components/projects/ProjectList";
import FilterDrawer from "@/components/projects/query-controls/FilterDrawer";
import FilterPanel from "@/components/projects/query-controls/FilterPanel";
import { useSearchProjects } from "@/hooks/useSearchProjects";
import { useAppStore } from "@/store";
import { useState } from "react";
import { useFilterProjects } from "@/hooks/useFilterProjects";
import { useProjectsSummary } from "@/hooks/useProjectsSummary";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";

const ProjectsPage = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const searchQuery = useAppStore((state) => state.searchQuery);
  const filter = useAppStore((state) => state).filter;

  const projectsWithMeta = useProjectsWithMeta();
  const projectSummary = useProjectsSummary(projectsWithMeta);

  const searchedProjects = useSearchProjects(projectsWithMeta, searchQuery);
  const filteredProjects = useFilterProjects(searchedProjects, filter);

  console.log("projectsWithMeta", projectsWithMeta);

  return (
    <>
      <div className="mb-6">
        <FilterPanel onOpen={() => setFilterDrawerOpen(true)} projectSummary={projectSummary} />
      </div>

      <FilterDrawer
        onClose={() => setFilterDrawerOpen(false)}
        isOpen={filterDrawerOpen}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProjectList projects={filteredProjects} />
      </div>
    </>
  );
};
export default ProjectsPage;
