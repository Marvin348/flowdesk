import { Spinner } from "@/shared/components/ui/spinner";

const VerificationPending = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Spinner className="size-8 text-accent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
export default VerificationPending;
