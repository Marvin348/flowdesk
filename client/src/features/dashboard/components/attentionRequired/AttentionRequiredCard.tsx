import { Link } from "react-router";
import type { AttentionRequiredConfig } from "@/features/dashboard/constants/AttentionRequiredConfig";
import AttentionRequiredEmptyCard from "@/features/dashboard/components/attentionRequired/AttentionRequiredEmptyCard";
import { ArrowRight } from "lucide-react";
import type { AttentionRequiredCardItem } from "@/features/dashboard/types/AttentionRequiredCardItem";
import { getAttentionContent } from "@/features/dashboard/utils/getAttentionContent";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";

type AttentionRequiredCardProps = {
  item: AttentionRequiredCardItem;
  config: AttentionRequiredConfig;
};

const AttentionRequiredCard = ({
  item,
  config,
}: AttentionRequiredCardProps) => {
  if (!item) return <AttentionRequiredEmptyCard config={config} />;

  const content = getAttentionContent(item);

  const projectStatusConfig = STATUS_OPTIONS[item.projectStatus];

  return (
    <Link
      key={item.id}
      to={`/project/${item.id}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] h-32 items-start gap-3 rounded-md border bg-background p-3 hover:bg-muted/40"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {config.label}
          </p>
        </div>

        <p className="mt-1 truncate font-medium">{item.title}</p>

        <span
          className="rounded-md px-2 py-0.5 text-xs text-surface-foreground"
          style={{ backgroundColor: projectStatusConfig.color }}
        >
          {projectStatusConfig.label}
        </span>

        <div className="mt-4 text-sm text-muted-foreground">
          <span>{content.secondary}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 text-right">
        <span className="text-sm font-medium">{content.value}</span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
};
export default AttentionRequiredCard;
