import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";
import { Button } from "@/shared/components/ui/button";

type NotificationPaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

const NotificationPagination = ({
  totalItems,
  totalPages,
  currentPage,
}: NotificationPaginationProps) => {
  const { actions } = useNotificationSearchParams();

  const prevPage = () => actions.setPage(Math.max(currentPage - 1, 1));
  const nextPage = () => actions.setPage(Math.min(currentPage + 1, totalPages));

  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span>
          {currentPage}-{totalPages}
        </span>{" "}
        von <span>{totalItems}</span> Benachrichtigungen
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          aria-label="Previous page"
          onClick={() => prevPage()}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          aria-label="Next page"
          onClick={() => nextPage()}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
export default NotificationPagination;
