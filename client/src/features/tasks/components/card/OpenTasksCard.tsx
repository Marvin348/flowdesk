import OverviewCard from "../../../../shared/components/ui/overview-card/OverviewCard";
import OverviewCardHeader from "../../../../shared/components/ui/overview-card/OverviewCardHeader";
import OverviewCardBody from "../../../../shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "../../../../shared/components/ui/overview-card/OverviewCardFooter";
import { useState } from "react";
import OpenTask from "./OpenTask";
import CarouselControls from "@/shared/components/ui/CarouselControls";
import type { TaskWithMeta } from "@/features/tasks/types/taskWithMeta";

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
          <OpenTask task={taskItem} />
        </div>
      </OverviewCardBody>
      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default OpenTasksCard;
