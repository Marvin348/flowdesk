import type { TaskStatusDistributionItem } from "@/features/dashboard/utils/mapTaskStatusDistributionToItems";

const TaskStatusDistributionCard = ({
  item,
}: {
  item: TaskStatusDistributionItem;
}) => {
  return (
    <div
      style={{
        width: item.value ? `${item.value}%` : "100%",
      }}
    >
      <div
        className="mt-6"
        style={{
          borderLeft: `2px solid ${item.color}`,
        }}
      >
        <div className="px-4 pb-2">
          <p className="mb-2 text-muted-foreground">{item.label}</p>
          <p className="font-semibold text-lg">{item.value}%</p>
        </div>

        <div
          className="h-8 rounded-r-md"
          style={{
            background: item.color,
            opacity: 0.3,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TaskStatusDistributionCard;
