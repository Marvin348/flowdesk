import ProjectList from "@/components/projects/ProjectList";
import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
const ProjectsPage = () => {
  const projects = useAppStore((state) => state.projects);
  const comments = useAppStore((state) => state.comments);
  const users = useAppStore((state) => state.users);
  const tasks = useAppStore((state) => state.tasks);
  const attachments = useAppStore((state) => state.attachments);

  console.log("projects", projects);
  console.log("comments", comments);
  console.log("users", users);
  console.log("tasks", tasks);
  console.log("attachments", attachments);

  const commentsMap = new Map(comments.map((com) => [com.id, com]));
  const usersMap = new Map(users.map((user) => [user.id, user]));
  const subtasksMap = new Map(tasks.map((task) => [task.id, task]));
  const attachmentsMap = new Map(attachments.map((att) => [att.id, att]));

  console.log(commentsMap);

  const projectsWithMeta: ProjectsWithMeta[] = projects.map((project) => {
    const comments = project.commentIds.map((id) => commentsMap.get(id));
    const users = project.assigneeIds.map((id) => usersMap.get(id));
    const tasks = project.taskIds.map((id) => subtasksMap.get(id));
    const attachments = project.attachmenetIds?.map((id) =>
      attachmentsMap.get(id),
    );

    return {
      ...project,
      comments,
      users,
      tasks,
      attachments,
    };
  });

  console.log("tasksWithMeta", projectsWithMeta);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProjectList projects={projectsWithMeta} />
    </div>
  );
};
export default ProjectsPage;
