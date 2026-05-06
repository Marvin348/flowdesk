import ProgressBarCard from "@/features/projects/components/card/ProgressBarCard";
import type { ProjectsWithMeta } from "@/features/projects/types/projectsWithMeta";
import type { Progress } from "@/shared/utils/getProgressResult";
import type { User } from "@shared/types/user";
import { getProjectUserWorkload } from "@/features/users/utils/workload/getProjectUserWorkload";
import CollaboratorsCard from "@/features/users/components/card/CollaboratorsCard";
import OpenTasksCard from "@/features/tasks/components/card/OpenTasksCard";
import CommentsCard from "@/features/comments/components/card/CommentsCard";
import WorkloadCard from "@/features/users/components/workload/WorkloadCard";
import type { ActiveTab } from "@/pages/ProjectDetailsPage";

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
