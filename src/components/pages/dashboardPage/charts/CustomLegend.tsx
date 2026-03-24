import type { TaskPriorityItem } from "@/utils/dashboard/getTaskPriorityItems";

const CustomLegend = ({ data }: { data: TaskPriorityItem[] }) => {
  return (
    <div className="grid grid-cols-2 gap-1">
      {data.map((entry) => (
        <div key={entry.id} className="flex items-center gap-2">
          <span
            className="size-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></span>
          <p className=" text-muted-foreground">
            {entry.label}:<span className="ml-1 font-semibold text-surface/90">{entry.count}</span>
          </p>
        </div>
      ))}
    </div>
  );
};
export default CustomLegend;
