import type { PerformanceType } from "@shared/types/dto/dashboard/performanceHighlights.dto";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { PROGRESS_STATUS } from "@/shared/constants/progress-status";
import { getStatusFromProgress } from "@shared/utils/getStatusFromProgress";
import type { PerformanceHighlightDto } from "@shared/types/dto/dashboard/performanceHighlights.dto";

const PerformanceHighlightsCard = ({
  highlight,
}: {
  highlight: PerformanceHighlightDto;
}) => {
  const {
    type,
    user: { avatarKey, avatarUrl, name },
    stats,
  } = highlight;

  const getHighlightInformation = (
    type: PerformanceType,
    stats: PerformanceHighlightDto["stats"],
  ) => {
    switch (type) {
      case "overloaded":
        return `${stats.completedCount} Aufgaben erledigt`;

      case "bestProgress":
        return `${stats.progressPercent}% erledigt`;

      case "mostCompleted":
        return `${stats.completedCount} Aufgaben erledigt`;

      case "mostOpenTasks":
        return `${stats.openTasks} offene Aufgaben`;
    }
  };

  const highlightText = getHighlightInformation(type, stats);

  const status = getStatusFromProgress(stats.progressPercent);
  const statusLabel = PROGRESS_STATUS[status].label;
  const statusColor = PROGRESS_STATUS[status].color;
  const statusBgColor = PROGRESS_STATUS[status].bg;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar avatarKey={avatarKey} avatarUrl={avatarUrl} size="sm" />
          <p className="truncate">{name}</p>
        </div>
        <p className="shrink-0">
          <span
            className="flex items-center gap-2 text-sm rounded-full px-2 py-0.5"
            style={{
              color: statusColor,
              backgroundColor: statusBgColor,
            }}
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: statusColor,
              }}
            />
            {statusLabel}
          </span>
        </p>
      </div>

      <p className="text-muted-foreground">{highlightText}</p>
    </div>
  );
};
export default PerformanceHighlightsCard;
