import { useProjectWorkload } from "@/features/projects/hooks/details/useProjectWorkload";
import WorkloadTable from "@/features/users/components/workload/WorkloadTable";

type WorkloadViewProps = {
  projectId: string;
};

const WorkloadView = ({ projectId }: WorkloadViewProps) => {
  const { data: workload, isLoading, error } = useProjectWorkload(projectId);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!workload) return <div>Project not found</div>;

  console.log("workload", workload);

  return <WorkloadTable variant="full" stats={workload} />;
};
export default WorkloadView;
