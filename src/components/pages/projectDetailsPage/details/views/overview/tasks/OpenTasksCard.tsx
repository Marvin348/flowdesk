import OverviewCard from "../ui/OverviewCard";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import type { Task } from "@/type/task";
import type { User } from "@/type/user";
import { useState } from "react";
import OpenTask from "./OpenTask";
import CarouselControls from "@/components/ui/CarouselControls";

type OpenTasksCardProps = {
  tasks: Task[];
  users: User[];
};

const OpenTasksCard = ({ tasks, users }: OpenTasksCardProps) => {
  const [index, setIndex] = useState(0);
  const taskItem = tasks[index];

  if (!taskItem) return null;

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, tasks.length - 1));

  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Offene Aufgaben"
        action={<CarouselControls prev={prev} next={next} />}
      />
      <OverviewCardBody>
        <div className="p-4">
          <OpenTask task={taskItem} users={users} />
        </div>
      </OverviewCardBody>
      <OverviewCardFooter />
    </OverviewCard>
  );
};
export default OpenTasksCard;
