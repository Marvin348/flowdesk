import { ListChecks } from "lucide-react";

type Progress = {
  total: number;
  completed: number;
  percent: number;
};

type ProgressBarProps = {
  progress: Progress;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-0.5 text-muted-foreground">
          <ListChecks size={15} />
          {progress.completed}/{progress.total}
        </span>

        <span className="flex items-center gap-0.5 text-muted-foreground">
          {progress.percent}%
        </span>
      </div>
      <div className="bg-gray-200 h-2 rounded-full">
        <div
          style={{ width: `${progress.percent}%` }}
          className="bg-accent h-2 rounded-full"
        ></div>
      </div>
    </>
  );
};
export default ProgressBar;
