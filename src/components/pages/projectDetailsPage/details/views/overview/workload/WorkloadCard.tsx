import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type UserWorkload } from "@/utils/workload/getUserWorkload";
import Avatar from "@/components/projects/avatar/Avatar";
import { getWorkloadStatus } from "@/utils/workload/ui/getWorkloadStatus";
import { WORKLOAD_STATUS } from "@/constants/workload/workload-status";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import WorkloadTable from "./WorkloadTable";
import OverviewCard from "../ui/OverviewCard";

type WorkloadProps = {
  stats: UserWorkload[];
  onOpen: () => void;
  variant?: "compact" | "full";
};

const WorkloadCard = ({ stats, onOpen, variant }: WorkloadProps) => {
  console.log("stats", stats);

  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Auslastung"
        action={
          <Button onClick={onOpen}>
            <Plus className="text-accent" /> <span>Aufgabe</span>
          </Button>
        }
      />

      <OverviewCardBody>
        <div className="p-4">
          <WorkloadTable stats={stats} variant={variant}/>
        </div>
      </OverviewCardBody>

      <OverviewCardFooter />
    </OverviewCard>
  );
};
export default WorkloadCard;
