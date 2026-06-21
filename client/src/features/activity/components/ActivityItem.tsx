import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import { ACTIVITY_ICON } from "@/features/activity/constants/activityIcon";
import { formatDate } from "@/shared/utils/formatDate";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import ActivityMessage from "./ActivityMessage";

type ActivityItemProps = {
  activity: ActivityDto;
  isLast: boolean;
};

const ActivityItem = ({ activity, isLast }: ActivityItemProps) => {
  const { type, entityType, createdAt, metadata, actor } = activity;

  const IconType = ACTIVITY_ICON[entityType];

  const commentMessage =
    typeof metadata.message === "string" ? metadata.message : null;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full bg-accent/20 text-accent">
          <IconType className="size-4" />
        </div>

        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      <div className="flex min-w-0 flex-1 items- gap-3 pb-6">
        <div className="shrink-0 pt-0.5">
          <Avatar avatarKey={actor.avatarKey} size="sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <p className="font-medium">{actor.name}</p>
            <p className="text-muted-foreground">
              <ActivityMessage activity={activity} />
            </p>

            <span className="text-muted-foreground">·</span>

            <p className="text-muted-foreground">{formatDate(createdAt)}</p>
          </div>

          {commentMessage && (
            <div className="mt-2 w-fit rounded-md border bg-card p-3 text-sm text-muted-foreground">
              {commentMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ActivityItem;
