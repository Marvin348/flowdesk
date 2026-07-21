import ProgressBarCard from "@/features/projects/components/card/ProgressBarCard";
import CollaboratorsCard from "@/features/users/components/card/CollaboratorsCard";
import OpenTasksCard from "@/features/tasks/components/card/OpenTasksCard";
import CommentsCard from "@/features/comments/components/card/CommentsCard";
import WorkloadCard from "@/features/users/components/workload/WorkloadCard";
import type { ActiveTab } from "@/features/projects/types/activeTab";
import { useProjectOverview } from "@/features/projects/hooks/details/useProjectOverview";
import { useAppStore } from "@/store";

type OverviewProps = {
  inviteOpen: () => void;
  onNavigate: (tab: ActiveTab) => void;
  projectId: string;
};

const Overview = ({ inviteOpen, onNavigate, projectId }: OverviewProps) => {
  const { data, error } = useProjectOverview(projectId);
  const openCreateTask = useAppStore((state) => state.openCreateTask);

  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!data) return <div>Project not found</div>;

  const { progress, collaborators, openTasks, recentComments, workload } = data;

  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto md:auto-rows-[170px]`}
    >
      <div className="h-full md:row-span-2">
        <CollaboratorsCard
          collaborators={collaborators}
          inviteOpen={inviteOpen}
          onMore={() => onNavigate("collaborators")}
        />
      </div>

      <div className="h-full md:row-span-2">
        <OpenTasksCard tasks={openTasks} onMore={() => onNavigate("list")} />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="h-full xl:col-start-3 xl:row-start-2  xl:row-span-3">
        <CommentsCard
          comments={recentComments}
          onMore={() => onNavigate("comments")}
        />
      </div>

      <div className="h-full md:col-span-2 xl:row-span-2">
        <WorkloadCard
          workload={workload}
          onCreateTask={() => openCreateTask(projectId)}
          onMore={() => onNavigate("workload")}
        />
      </div>
    </div>
  );
};
export default Overview;
