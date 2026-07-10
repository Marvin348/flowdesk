import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type VerificationErrorProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const VerificationError = ({
  title,
  message,
  actionLabel,
  onAction,
}: VerificationErrorProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-6 text-destructive" />
      </div>

      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>

      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
