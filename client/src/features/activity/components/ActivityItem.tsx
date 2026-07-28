import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import { ACTIVITY_ICON } from "@/features/activity/constants/activityIcon";
import { formatDate } from "@/shared/utils/formatDate";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import ActivityMessage from "@/features/activity/components/ActivityMessage";

type ActivityItemProps = {
  activity: ActivityDto;
  isLast: boolean;
};

const ActivityItem = ({ activity, isLast }: ActivityItemProps) => {
  const { type, createdAt, metadata, actor } = activity;

  const IconType = ACTIVITY_ICON[type].icon;

  const commentMessage =
    typeof metadata.commentMessage === "string"
      ? metadata.commentMessage
      : null;

  return (
    <article className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 px-4 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:px-5">
      <div className="relative flex justify-center">
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-10 -bottom-5 w-px bg-border"
          />
        )}

        <div className="relative z-10 flex size-9 items-center justify-center rounded-full border bg-background text-accent shadow-xs">
          <IconType className="size-4" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            avatarKey={actor.avatarKey}
            avatarUrl={actor.avatarUrl}
            size="sm"
          />

          <div className="min-w-0 flex-1">
            <div className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {actor.name}
              </span>{" "}
              <ActivityMessage activity={activity} />
            </div>

            <p className="mt-1 text-xs text-muted-foreground sm:hidden">
              {formatDate(createdAt)}
            </p>

            {commentMessage && (
              <div className="mt-4 max-w-2xl rounded-md border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground">
                {commentMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <time
        dateTime={createdAt}
        className="hidden min-w-28 text-right text-xs leading-6 text-muted-foreground sm:block"
      >
        {formatDate(createdAt)}
      </time>
    </article>
  );
};
export default ActivityItem;
