import { useEffect } from "react";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";

type UsePaginationGuardProps = {
  totalPages: number;
  currentPage: number;
};

export const usePaginationGuard = ({
  totalPages,
  currentPage,
}: UsePaginationGuardProps) => {
  const { actions } = useNotificationSearchParams();

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      actions.setPage(totalPages);
    }
  }, [currentPage, totalPages]);
};
