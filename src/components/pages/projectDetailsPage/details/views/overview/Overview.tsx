import ProgressBarCard from "@/components/pages/projectDetailsPage/details/views/overview/ProgressBarCard";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import type { Progress } from "@/utils/getProgressResult";
import type { User } from "@/type/user";
import { getUserWorkload } from "@/utils/workload/getUserWorkload";
import CollaboratorsCard from "./collaborators/CollaboratorsCard";
import OpenTasksCard from "./tasks/OpenTasksCard";
import CommentsCard from "./comments/CommentsCard";
import WorkloadCard from "./workload/WorkloadCard";

type OverviewProps = {
  project: ProjectsWithMeta;
  progress: Progress;
  collaborator: User[];
  onOpen: () => void;
  inviteOpen: () => void;
};

const Overview = ({
  project,
  progress,
  collaborator,
  onOpen,
  inviteOpen,
}: OverviewProps) => {
  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);

  const workloadStats = getUserWorkload(project.tasks);

  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto md:auto-rows-[170px]`}
    >
      <div className="h-full  md:row-span-2">
        <CollaboratorsCard
          collaborators={collaborator}
          inviteOpen={inviteOpen}
        />
      </div>

      <div className="h-full md:row-span-2">
        <OpenTasksCard tasks={project.tasks} users={collaborator} />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="h-full xl:col-start-3 xl:row-start-2  xl:row-span-3">
        <CommentsCard comments={allCommentsPerProject} />
      </div>

      <div className="h-full md:col-span-2 xl:row-span-2">
        <WorkloadCard
          stats={workloadStats.slice(0, 4)}
          onOpen={onOpen}
          variant="compact"
        />
      </div>
    </div>
  );
};
export default Overview;
