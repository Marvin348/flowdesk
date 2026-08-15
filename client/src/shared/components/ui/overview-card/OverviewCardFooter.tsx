import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";

const OverviewCardFooter = ({ to }: { to: string }) => {
  return (
    <div className="pb-4 px-4">
      <Button
        asChild
        variant="outline"
        className="w-full hover:bg-muted-foreground/5"
      >
        <Link to={to}>Alle Ansehen</Link>
      </Button>
    </div>
  );
};
export default OverviewCardFooter;
