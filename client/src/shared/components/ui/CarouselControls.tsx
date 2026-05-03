import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type CarouselControlsProps = {
  prev: () => void;
  next: () => void;
  action?: React.ReactNode;
};

const CarouselControls = ({ prev, next, action }: CarouselControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        className="hover:bg-muted-foreground/5"
        onClick={prev}
      >
        <ChevronLeft />
      </Button>
      {action}
      <Button
        variant="outline"
        size="icon-sm"
        className="hover:bg-muted-foreground/5"
        onClick={next}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
export default CarouselControls;
