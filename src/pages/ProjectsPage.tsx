import ProjectList from "@/components/projects/ProjectList";
import FilterDrawer from "@/components/projects/query-controls/FilterDrawer";
import FilterPanel from "@/components/projects/query-controls/FilterPanel";
import { useSearchProjects } from "@/hooks/useSearchProjects";
import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { useState } from "react";
import { useFilterProjects } from "@/hooks/useFilterProjects";
import { useProjectsSummary } from "@/hooks/useProjectsSummary";

const ProjectsPage = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const projects = useAppStore((state) => state.projects);
  const comments = useAppStore((state) => state.comments);
  const users = useAppStore((state) => state.users);
  const tasks = useAppStore((state) => state.tasks);
  const attachments = useAppStore((state) => state.attachments);

  const searchQuery = useAppStore((state) => state.searchQuery);
  const filter = useAppStore((state) => state).filter;

  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const commentsMap = new Map(comments.map((com) => [com.id, com]));
  const usersMap = new Map(users.map((user) => [user.id, user]));
  const subtasksMap = new Map(tasks.map((task) => [task.id, task]));
  const attachmentsMap = new Map(attachments.map((att) => [att.id, att]));


  const projectsWithMeta: ProjectsWithMeta[] = projects.map((project) => {
    const comments = project.commentIds.map((id) => commentsMap.get(id));
    const users = project.assigneeIds.map((id) => usersMap.get(id));
    const tasks = project.taskIds.map((id) => subtasksMap.get(id));
    const attachments = project.attachmenetIds?.map((id) =>
      attachmentsMap.get(id),
    );

    const badge = badgeByProjectId[project.id];

    return {
      ...project,
      comments,
      users,
      tasks,
      attachments,
      badge,
    };
  });

  const projectSummary = useProjectsSummary(projectsWithMeta);

  const searchedProjects = useSearchProjects(projectsWithMeta, searchQuery);
  const filteredProjects = useFilterProjects(searchedProjects, filter);

  console.log("tasksWithMeta", projectsWithMeta);
  console.log("badgeByProjectId", badgeByProjectId);

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
