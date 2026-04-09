import ProgressBarCard from "@/components/pages/projectDetailsPage/details/views/overview/ProgressBarCard";
import type { ProjectsWithMeta } from "@/type/view-models/projectsWithMeta";
import type { Progress } from "@/utils/getProgressResult";
import type { User } from "@/type/domain/user";
import { getProjectUserWorkload } from "@/utils/workload/getProjectUserWorkload";
import CollaboratorsCard from "./collaborators/CollaboratorsCard";
import OpenTasksCard from "./tasks/OpenTasksCard";
import CommentsCard from "./comments/CommentsCard";
import WorkloadCard from "./workload/WorkloadCard";
import type { ActiveTab } from "@/pages/ProjectPage";

type OverviewProps = {
  project: ProjectsWithMeta;
  progress: Progress;
  collaborator: User[];
  onCreateTask: () => void;
  inviteOpen: () => void;
  onNavigate: (tab: ActiveTab) => void;
};

const Overview = ({
  project,
  progress,
  collaborator,
  onCreateTask,
  inviteOpen,
  onNavigate,
}: OverviewProps) => {
  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);

  const workloadStats = getProjectUserWorkload(project.tasks);

  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto md:auto-rows-[170px]`}
    >
      <div className="h-full  md:row-span-2">
        <CollaboratorsCard
          collaborators={collaborator}
          inviteOpen={inviteOpen}
          onMore={() => onNavigate("collaborators")}
        />
      </div>

      <div className="h-full md:row-span-2">
        <OpenTasksCard
          tasks={project.tasks}
          onMore={() => onNavigate("list")}
        />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="h-full xl:col-start-3 xl:row-start-2  xl:row-span-3">
        <CommentsCard
          comments={allCommentsPerProject}
          onMore={() => onNavigate("comments")}
        />
      </div>

      <div className="h-full md:col-span-2 xl:row-span-2">
        <WorkloadCard
          stats={workloadStats.slice(0, 4)}
          onCreateTask={onCreateTask}
          variant="compact"
          onMore={() => onNavigate("workload")}
        />
      </div>
    </div>
  );
};
export default Overview;
