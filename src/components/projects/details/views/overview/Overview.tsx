import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";
import CommentsList from "@/components/projects/details/comments/CommentsList";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import type { Progress } from "@/utils/getProgressResult";

type OverviewProps = {
  project: ProjectsWithMeta;
  progress: Progress;
};

const Overview = ({ project, progress }: OverviewProps) => {
  const teamUsers = useUsersByIds(project?.teamUserIds ?? []);

  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[170px]`}
    >
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
  );
};
export default Overview;
