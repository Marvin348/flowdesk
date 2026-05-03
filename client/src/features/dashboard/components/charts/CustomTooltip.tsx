import type { TaskPriorityItem } from "@/features/dashboard/utils/getTaskPriorityItems";

type CustomTooltipProps = {
  active?: boolean;
  payload?: { payload: TaskPriorityItem }[];
};
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-sm">
      <div className="flex items-center gap-1">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <p className="text-sm font-medium">{data.label}</p>
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        {data.count} Aufgaben
      </p>
    </div>
  );
};
export default CustomTooltip;
