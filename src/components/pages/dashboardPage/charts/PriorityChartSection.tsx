import PriorityPieChart from "@/components/pages/dashboardPage/charts/PriorityPieChart";
import type { TaskPriorityItem } from "@/utils/dashboard/getTaskPriorityItems";
import { Ellipsis } from "lucide-react";

type PriorityChartSectionProps = {
  priorityItems: TaskPriorityItem[];
};

const PriorityChartSection = ({ priorityItems }: PriorityChartSectionProps) => {
  return (
    <div className="border p-4 rounded-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-xl">Aufgabenpriorität</h3>
          <p className="text-muted-foreground">
            Aufgeteilt nach Prioritätsstufen
          </p>
        </div>
        <button>
          <Ellipsis />
        </button>
      </div>

      <div className="">
        <PriorityPieChart data={priorityItems} />
      </div>
    </div>
  );
};
export default PriorityChartSection;
