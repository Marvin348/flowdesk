import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import ActivityItem from "@/features/activity/components/ActivityItem";

const ActivityList = ({ activities }: { activities: ActivityDto[] }) => {
  return (
    <section>
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </section>
  );
};
export default ActivityList;
