import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type UserWorkload } from "@/utils/workload/getProjectUserWorkload";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import WorkloadTable from "./WorkloadTable";
import OverviewCard from "../ui/OverviewCard";

type WorkloadProps = {
  stats: UserWorkload[];
  onCreateTask: () => void;
  variant?: "compact" | "full";
  onMore: () => void;
};

const WorkloadCard = ({
  stats,
  onCreateTask,
  variant,
  onMore,
}: WorkloadProps) => {
  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Auslastung"
        action={
          <Button onClick={onCreateTask}>
            <Plus className="text-accent" /> <span>Aufgabe</span>
          </Button>
        }
      />

      <OverviewCardBody>
        <div className="p-4">
          <WorkloadTable stats={stats} variant={variant} />
        </div>
      </OverviewCardBody>

      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default WorkloadCard;
