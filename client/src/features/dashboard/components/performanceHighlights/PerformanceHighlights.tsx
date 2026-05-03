import type { PerformanceHighlight } from "@/features/dashboard/utils/getPerformanceHighlights";
import { EllipsisVertical } from "lucide-react";
import PerformanceHighlightsCard from "@/features/dashboard/components/performanceHighlights/PerformanceHighlightsCard";

type PerformanceHighlightsProps = {
  highlights: PerformanceHighlight[];
};

const PerformanceHighlights = ({ highlights }: PerformanceHighlightsProps) => {
  return (
    <section className="p-4 border rounded-md h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xl">Performance Highlights</h3>
        <button>
          <EllipsisVertical strokeWidth={1} fill="black" />
        </button>
      </div>

      <div className="mt-4">
        {highlights.map((highlight) => (
          <PerformanceHighlightsCard
            key={highlight.type}
            highlight={highlight}
          />
        ))}
      </div>

      {!highlights.length && (
        <p className="text-center text-muted-foreground">
          Keine Daten gefunden
        </p>
      )}
    </section>
  );
};
export default PerformanceHighlights;
