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

import type { StatCardItem } from "@/utils/dashboard/mapDashboardStatCards";

const DashboardStatCard = ({ stat }: { stat: StatCardItem }) => {
  const Icon = ICON_LOOKUP[stat.iconKey].icon;

  return (
    <div className="flex items-center gap-3 border-r pl-6 last:border-none">
      <div
        className="shrink-0 flex items-center justify-center p-2 size-11 border rounded-full"
      >
        <Icon className="text-accent"/>
      </div>

      <div>
        <p className="text-muted-foreground">{stat.label}</p>
        <p className="font-medium text-lg">
          {stat.id === "rate" ? `${stat.value}%` : stat.value}
        </p>
      </div>
    </div>
  );
};
export default DashboardStatCard;
