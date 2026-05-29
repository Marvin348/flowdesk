import type { TaskPriorityItem } from "@/features/dashboard/mappers/mapTaskPriorityItems";


const CustomLegend = ({ data }: { data: TaskPriorityItem[] }) => {
  return (
    <div className="grid grid-cols-2 gap-1">
      {data.map((entry) => (
        <div key={entry.id} className="flex items-center gap-2">
          <span
            className="shrink-0 size-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></span>
          <p className=" text-muted-foreground">
            {entry.label}:
            <span className="ml-1 font-semibold text-muted-foreground">
              {entry.count}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};
export default CustomLegend;
