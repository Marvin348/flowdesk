import {
  Folders,
  ClipboardClock,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

const ICON_LOOKUP = {
  projects: { icon: Folders, color: "#FFD580" },
  totalTasks: { icon: ClipboardList, color: "#DAB1DA" },
  openTasks: { icon: ClipboardClock, color: "#ADD8E6" },
  completionRate: { icon: TrendingUp, color: "#90EE90" },
};

import type { StatCardItem } from "@/features/dashboard/utils/mapDashboardStatCards";

const DashboardStatCard = ({ stat }: { stat: StatCardItem }) => {
  const Icon = ICON_LOOKUP[stat.iconKey].icon;

  return (
    <div className="flex items-center justify-center gap-3 border-r last:border-none">
      <div className="flex flex-col gap-2 truncate">
        <div className="flex items-center gap-4">
          <Icon className="shrink-0 text-surface/90" />
          <p className="font-medium text-2xl">
            {stat.id === "rate" ? `${stat.value}%` : stat.value}
          </p>
        </div>
        <p className="text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  );
};
export default DashboardStatCard;
