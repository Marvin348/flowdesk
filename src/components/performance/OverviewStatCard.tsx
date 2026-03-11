import type { StatCardItem } from "@/utils/performance/getTeamStatCards";
import {
  UserRoundCheck,
  ClipboardList,
  TrendingUp,
  Folder,
} from "lucide-react";

const ICON_LOOKUP = {
  users: { icon: UserRoundCheck, color: "#FFD580" },
  openTasks: { icon: ClipboardList, color: "#ADD8E6" },
  efficiency: { icon: TrendingUp, color: "#90EE90" },
  allTasks: { icon: Folder, color: "#DAB1DA" },
};

const OverviewStatCard = ({ stats }: { stats: StatCardItem }) => {
  const Icon = ICON_LOOKUP[stats.iconKey].icon;
  const iconColor = ICON_LOOKUP[stats.iconKey].color;

  return (
    <div className="flex items-center gap-3 border-r pl-6 last:border-none">
      <div
        style={{ backgroundColor: iconColor }}
        className="shrink-0 flex items-center justify-center p-2 size-11 rounded-full"
      >
        <Icon className="text-surface/80" />
      </div>

      <div>
        <p className="text-muted-foreground">{stats.label}</p>
        <p className="font-medium text-lg">
          {stats.id === "rate" ? `${stats.value}%` : stats.value}
        </p>
      </div>
    </div>
  );
};
export default OverviewStatCard;
