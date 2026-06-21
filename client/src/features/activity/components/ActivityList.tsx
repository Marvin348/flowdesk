import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import ActivityItem from "./ActivityItem";

const ActivityList = ({ activities }: { activities: ActivityDto[] }) => {
  return (
    <section>
      <div>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </section>
  );
};
export default ActivityList;
