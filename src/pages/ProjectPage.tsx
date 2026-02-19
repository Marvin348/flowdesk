import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import ProgressBar from "@/components/projects/card/ProgressBar";
import { getProgressResult } from "@/utils/getProgressResult";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";
import CommentsList from "@/components/projects/details/comments/CommentsList";

const ProjectPage = () => {
  const { id } = useParams();

  if (!id) return;

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  if (!project) return;

  const progress = getProgressResult(project.taskIds, project.tasks);

  console.log(project);
  return (
    <>
      <div>
        <ProjectDetailsHeader project={project} />
      </div>

      <div
        className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[170px]"
      >
        <div className="border rounded-md h-full row-span-2">
          <CollaboratorsList users={project.users} />
        </div>

        <div className="border rounded-md h-full row-span-2">
          <OpenTaskList tasks={project.tasks} users={project.users} />
        </div>

        <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
          <ProgressBarCard progress={progress} />
        </div>

        <div className="border rounded-md h-full row-span-3">
          <CommentsList comments={project.comments} />
        </div>
      </div>
    </>
  );
};
export default ProjectPage;
