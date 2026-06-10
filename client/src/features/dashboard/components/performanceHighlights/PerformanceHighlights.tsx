import { EllipsisVertical, TrendingUp } from "lucide-react";
import PerformanceHighlightsCard from "@/features/dashboard/components/performanceHighlights/PerformanceHighlightsCard";
import type { PerformanceHighlightDto } from "@shared/types/dto/dashboard/performanceHighlights.dto";
import CardEmptyState from "@/shared/components/CardEmptyState";

type PerformanceHighlightsProps = {
  highlights: PerformanceHighlightDto[];
};

const PerformanceHighlights = ({ highlights }: PerformanceHighlightsProps) => {
  const hasNoPerformanceData = highlights.every(
    (task) => task.stats.tasksCount === 0,
  );

  return (
    <section className="flex flex-col h-full p-4 border rounded-md ">
      <div className="flex flex-col flex-1">
        {hasNoPerformanceData ? (
          <CardEmptyState
            icon={<TrendingUp className="h-5 w-5" />}
            title="Noch keine Team-Highlights"
            description="Highlights entstehen, wenn Aufgaben zugewiesen, bearbeitet oder abgeschlossen werden."
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-xl">Performance Highlights</h3>
              <button>
                <EllipsisVertical strokeWidth={1} fill="black" />
              </button>
            </div>

            {highlights.map((highlight) => (
              <PerformanceHighlightsCard
                key={highlight.type}
                highlight={highlight}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
export default PerformanceHighlights;
