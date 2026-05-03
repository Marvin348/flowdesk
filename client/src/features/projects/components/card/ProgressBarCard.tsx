import ProgressBar, {
  type Progress,
} from "@/features/projects/components/card/ProgressBar";
import OverviewCardHeader from "../../../../shared/components/ui/overview-card/OverviewCardHeader";

type ProgressBarCardProps = {
  progress: Progress;
};

const ProgressBarCard = ({ progress }: ProgressBarCardProps) => {
  return (
    <>
      <OverviewCardHeader title="Progress" />
      <div className="p-4">
        <ProgressBar progress={progress} />
        <p className="mt-3 text-foreground/90">
          {progress.percent}% Abgeschlossen
        </p>
      </div>
    </>
  );
};
export default ProgressBarCard;
