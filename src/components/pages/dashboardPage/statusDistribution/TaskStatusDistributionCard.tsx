import type { TaskStatusDistributionItem } from "@/utils/dashboard/mapTaskStatusDistributionToItems";

const TaskStatusDistributionCard = ({
  item,
}: {
  item: TaskStatusDistributionItem;
}) => {
  return (
    <div className="flex-1">
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
            width: `${item.value}%`,
            opacity: 0.5,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TaskStatusDistributionCard;
