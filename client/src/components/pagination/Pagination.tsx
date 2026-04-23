import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setPage: (value: number) => void;
};

const Pagination = ({ currentPage, totalPages, setPage }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const prevPage = () => setPage(Math.max(currentPage - 1, 1));
  const nextPage = () => setPage(Math.min(currentPage + 1, totalPages));
  const selectedPage = (pageNumber: number) => setPage(pageNumber);

  return (
    <div className="flex items-center">
      <Button
        size="icon-sm"
        variant="outline"
        className="hover:bg-surface/5 text-muted-foreground duration-200"
        onClick={() => prevPage()}
        disabled={currentPage === 1}
      >
        <ArrowLeft />
      </Button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`size-8 rounded-md text-muted-foreground transition duration-200 hover:bg-surface/5 ${currentPage === pageNumber && "font-medium text-surface"}`}
          onClick={() => selectedPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <Button
        size="icon-sm"
        variant="outline"
        className="hover:bg-surface/5 text-muted-foreground duration-200"
        onClick={() => nextPage()}
        disabled={currentPage === totalPages}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};
export default Pagination;
