import PriorityPieChart from "@/features/dashboard/components/charts/PriorityPieChart";
import type { TaskPriorityItem } from "@/features/dashboard/utils/getTaskPriorityItems";
import { EllipsisVertical } from "lucide-react";

type PriorityChartSectionProps = {
  priorityItems: TaskPriorityItem[];
};

const PriorityChartSection = ({ priorityItems }: PriorityChartSectionProps) => {
  return (
    <section className="border p-4 rounded-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-xl">Aufgabenpriorität</h3>
          <p className="text-muted-foreground">
            Aufgeteilt nach Prioritätsstufen
          </p>
        </div>
        <button>
          <EllipsisVertical strokeWidth={1} fill="black" />
        </button>
      </div>

      <div>
        <PriorityPieChart data={priorityItems} />
      </div>
    </section>
  );
};
export default PriorityChartSection;
