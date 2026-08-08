import type { DashboardUrgentTaskDto } from "@shared/types/dto/dashboard/dashboardUrgentTasks.dto";
import AttentionRequired from "@/features/dashboard/components/attentionRequired/AttentionRequired";
import UrgentTasks from "@/features/dashboard/components/urgentTasks/UrgentTasks";
import type { DashboardAttentionRequiredDto } from "@shared/types/dto/dashboard/dashboardAttentionRequired.dto";
import TaskStatusDistribution from "@/features/dashboard/components/statusDistribution/TaskStatusDistribution";
import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution";
import type { TaskStatusDistributionDto } from "@shared/types/dto/dashboard/taskStatusDistribution.dto";

type DashboardFocusAreaProps = {
  urgentTasks: DashboardUrgentTaskDto;
  attentionRequired: DashboardAttentionRequiredDto;
  taskStatusDistribution: TaskStatusDistributionDto;
};

const DashboardFocusArea = ({
  urgentTasks,
  attentionRequired,
  taskStatusDistribution,
}: DashboardFocusAreaProps) => {
  const taskStatusItems = mapTaskStatusDistribution(taskStatusDistribution);

  return (
    <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <UrgentTasks urgentTasks={urgentTasks} />
      <div className="flex h-full flex-col gap-6">
        <TaskStatusDistribution statusItems={taskStatusItems} />
        <AttentionRequired attentionRequired={attentionRequired} />
      </div>
    </section>
  );
};
export default DashboardFocusArea;
