import PriorityPieChart from "@/features/dashboard/components/charts/PriorityPieChart";
import type { TaskPriorityItem } from "@/features/dashboard/mappers/mapTaskPriorityItems";
import CardEmptyState from "@/shared/components/CardEmptyState";
import { EllipsisVertical } from "lucide-react";
import { Flag } from "lucide-react";

type PriorityChartSectionProps = {
  priorityItems: TaskPriorityItem[];
};

const PriorityChartSection = ({ priorityItems }: PriorityChartSectionProps) => {
  const hasNoPriorityData = priorityItems.every(
    (priority) => priority.count === 0,
  );

  return (
    <section className="flex flex-col h-full border p-4 rounded-md">
      <div className="flex flex-col flex-1">
        {hasNoPriorityData ? (
          <CardEmptyState
            icon={<Flag className="h-5 w-5" />}
            title="Noch keine Prioritäten"
            description="Sobald Aufgaben Prioritäten haben, zeigt FlowDesk hier die Verteilung nach Wichtigkeit."
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};
export default PriorityChartSection;
