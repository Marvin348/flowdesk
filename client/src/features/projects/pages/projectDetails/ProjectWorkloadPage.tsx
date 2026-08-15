import { useProjectWorkload } from "@/features/projects/hooks/details/useProjectWorkload";
import WorkloadTable from "@/features/users/components/workload/WorkloadTable";
import { useProjectWorkloadSearchParams } from "@/features/projects/hooks/searchParams/useProjectWorkloadSearchParams";
import Pagination from "@/shared/components/ui/Pagination";
import ProjectWorkloadSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/ProjectWorkloadSkeleton";
import { PAGE_LIMITS, DEFAULT_PAGE } from "@shared/constants/pagination";
import { useProjectContext } from "@/features/projects/hooks/useProjectContext";

const ProjectWorkloadPage = () => {
  const { projectId } = useProjectContext();

  const { page, workloadSort, actions } = useProjectWorkloadSearchParams();

  const input = {
    projectId,
    page,
    limit: PAGE_LIMITS.workload,
    sort: workloadSort,
  };

  const { data, isLoading, error } = useProjectWorkload(input);

  const workload = data?.items ?? [];
  const currentPage = data?.pagination.currentPage ?? DEFAULT_PAGE;
  const totalPages = data?.pagination.totalPages ?? 1;

  if (isLoading && !data) return <ProjectWorkloadSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;

  return (
    <section className="flex flex-1 flex-col">
      <WorkloadTable
        workload={workload}
        hasLoaded={!!data}
        onSort={actions.toggleWorkloadSort}
      />

      <div className="mt-auto pt-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          setPage={actions.setPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
};
export default ProjectWorkloadPage;
