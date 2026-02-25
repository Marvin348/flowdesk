import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";
import CommentsList from "@/components/projects/details/comments/CommentsList";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import type { Progress } from "@/utils/getProgressResult";
import type { User } from "@/type/user";

type OverviewProps = {
  project: ProjectsWithMeta;
  progress: Progress;
  collaborator: User[]
};

const Overview = ({ project, progress, collaborator }: OverviewProps) => {
  // console.log("COLLA", project.tasks.flatMap((task) => task.collaborators));

  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[170px]`}
    >
      <div className="border rounded-md h-full row-span-2">
        <CollaboratorsList collaborators={collaborator} />
      </div>

      <div className="border rounded-md h-full row-span-2">
        <OpenTaskList tasks={project.tasks} users={collaborator} />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="border rounded-md h-full row-span-3">
        <CommentsList comments={allCommentsPerProject} />
      </div>
    </div>
  );
};
export default Overview;
