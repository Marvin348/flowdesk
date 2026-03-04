import ProgressBar, {
  type Progress,
} from "@/components/projects/card/ProgressBar";

type ProgressBarCardProps = {
  progress: Progress;
};

const ProgressBarCard = ({ progress }: ProgressBarCardProps) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
        <h4 className="text-lg font-medium">Progress</h4>
      </div>

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
