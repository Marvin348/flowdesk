import { Button } from "@/shared/components/ui/button";

const OverviewCardFooter = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="pb-4 px-4">
      <Button
        variant="outline"
        className="w-full hover:bg-muted-foreground/5"
        onClick={onClick}
      >
        Alle Ansehen
      </Button>
    </div>
  );
};
export default OverviewCardFooter;
