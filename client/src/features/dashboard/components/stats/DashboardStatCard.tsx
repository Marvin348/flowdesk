import type { StatCardItem } from "@/features/dashboard/mappers/mapDashboardStatCards";
import { CARD_META } from "@/features/dashboard/constants/StatCardMeta";

type DashboardStatCardProps = {
  stat: StatCardItem;
  isPrimary?: boolean;
};

const DashboardStatCard = ({ stat, isPrimary = false }: DashboardStatCardProps) => {
  const meta = CARD_META[stat.id];
  const cardSizeClass = isPrimary ? "min-h-32" : "min-h-28";
  const valueSizeClass = isPrimary ? "text-4xl" : "text-3xl";

  return (
    <article
      className={`flex ${cardSizeClass} flex-col justify-between rounded-md border p-4 ${meta.cardClassName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {meta.eyebrow}
          </p>
          <h2 className="mt-1 text-sm font-medium text-foreground">
            {stat.label}
          </h2>
        </div>
      </div>

      <p className={`mt-6 font-semibold leading-none ${valueSizeClass} ${meta.valueClassName}`}>
        {stat.value}
      </p>
    </article>
  );
};
export default DashboardStatCard;
