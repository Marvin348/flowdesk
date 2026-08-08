import type { TaskStatusDistributionItem } from "@/features/dashboard/mappers/mapTaskStatusDistribution";

const TaskStatusDistributionCard = ({
  item,
}: {
  item: TaskStatusDistributionItem;
}) => {
  const { label, value, color } = item;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full "
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default TaskStatusDistributionCard;
