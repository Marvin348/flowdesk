import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { type UserWorkload } from "@/features/users/utils/workload/getProjectUserWorkload";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import WorkloadTable from "./WorkloadTable";
import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";

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
