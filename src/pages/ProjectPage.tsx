import { data, useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import { getProgressResult } from "@/utils/getProgressResult";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";
import CommentsList from "@/components/projects/details/comments/CommentsList";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import { useProjects } from "@/queries/useProjects";

const ProjectPage = () => {
  const { id } = useParams();

  if (!id) return;

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  if (!project) return;

  const progress = getProgressResult(project.tasks, project.tasks);

  const teamUsers = useUsersByIds(project.teamUserIds);

  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);
  console.log("allCommentsPerProject", allCommentsPerProject);
  console.log("teamUsers", teamUsers);
  console.log("projectTasks", project.tasks);
  console.log("project", project);

  // const fetchExample = async () => {
  //   const res = await fetch("http://localhost:30001/projects");
  //   const data = await res.json();

  //   return data;
  // };

  // fetchExample().then((data) => console.log("data", data));

  const { data, isLoading, error } = useProjects();
  console.log("projectsssss", data);

  return (
    <>
      <div>
        <ProjectDetailsHeader project={project} />
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[170px]">
        <div className="border rounded-md h-full row-span-2">
          <CollaboratorsList collaborators={teamUsers} />
        </div>

        <div className="border rounded-md h-full row-span-2">
          <OpenTaskList tasks={project.tasks} users={teamUsers} />
        </div>

        <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
          <ProgressBarCard progress={progress} />
        </div>

        <div className="border rounded-md h-full row-span-3">
          <CommentsList comments={allCommentsPerProject} />
        </div>
      </div>
    </>
  );
};
export default ProjectPage;
