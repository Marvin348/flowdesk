import ProgressBarCard from "@/features/projects/components/card/ProgressBarCard";
import CollaboratorsCard from "@/features/users/components/card/CollaboratorsCard";
import OpenTasksCard from "@/features/tasks/components/card/OpenTasksCard";
import CommentsCard from "@/features/comments/components/card/CommentsCard";
import WorkloadCard from "@/features/users/components/workload/WorkloadCard";
import { useProjectOverview } from "@/features/projects/hooks/details/useProjectOverview";
import { useAppStore } from "@/store";
import { useProjectContext } from "@/features/projects/hooks/useProjectContext";

const ProjectOverviewPage = () => {
  const { projectId } = useProjectContext();

  const openProjectInvite = useAppStore((state) => state.openProjectInvite);

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
          inviteOpen={() => openProjectInvite()}
        />
      </div>

      <div className="h-full md:row-span-2">
        <OpenTasksCard tasks={openTasks} />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="h-full xl:col-start-3 xl:row-start-2  xl:row-span-3">
        <CommentsCard comments={recentComments} />
      </div>

      <div className="h-full md:col-span-2 xl:row-span-2">
        <WorkloadCard
          workload={workload}
          onCreateTask={() => openCreateTask({ projectId })}
        />
      </div>
    </div>
  );
};
export default ProjectOverviewPage;
