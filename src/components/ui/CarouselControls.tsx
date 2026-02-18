import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarouselControlsProps = {
  prev: () => void;
  next: () => void;
};

const CarouselControls = ({ prev, next }: CarouselControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        className="hover:bg-muted-foreground/5"
        onClick={prev}
      >
        <ChevronLeft />
      </Button>
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
