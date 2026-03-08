import OverviewCard from "../ui/OverviewCard";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import { useState } from "react";
import OpenTask from "./OpenTask";
import CarouselControls from "@/components/ui/CarouselControls";
import type { TaskWithMeta } from "@/type/taskWithMeta";

type OpenTasksCardProps = {
  tasks: TaskWithMeta[];
  onMore: () => void;
};

const OpenTasksCard = ({ tasks, onMore }: OpenTasksCardProps) => {
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
          <OpenTask task={taskItem}/>
        </div>
      </OverviewCardBody>
      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default OpenTasksCard;
