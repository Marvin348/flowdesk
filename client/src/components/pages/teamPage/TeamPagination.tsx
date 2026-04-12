import CarouselControls from "@/components/ui/CarouselControls";

type TeamPaginationProps = {
  currentPage: number;
  totalPages: number;
  prev: () => void;
  next: () => void;
};

const TeamPagination = ({
  currentPage,
  totalPages,
  prev,
  next,
}: TeamPaginationProps) => {
  return (
    <div>
      <CarouselControls
        prev={prev}
        next={next}
        action={`${currentPage}/${totalPages}`}
      />
    </div>
  );
};
export default TeamPagination;
