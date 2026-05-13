import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import WorkloadCompactTable from "./WorkloadCompactTable";

type WorkloadProps = {
  workload: UserWorkload[];
  onCreateTask: () => void;
  onMore: () => void;
};

const WorkloadCard = ({
  workload,
  onCreateTask,
  onMore,
}: WorkloadProps) => {
  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Auslastung"
        action={
          <Button onClick={onCreateTask} variant="accentOutline">
            <Plus /> <span>Aufgabe</span>
          </Button>
        }
      />

      <OverviewCardBody>
        <div className="p-4 h-full">
          <WorkloadCompactTable workload={workload} />
        </div>
      </OverviewCardBody>

      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default WorkloadCard;
