import { DEFAULT_PAGE, MAX_PAGE_LIMIT } from "@shared/constants/pagination.js";

type ParsePaginationInput = {
  page?: unknown;
  limit?: unknown;
  defaultLimit: number;
};

export const parsePagination = ({
  page,
  limit,
  defaultLimit,
}: ParsePaginationInput) => {
  let currentPage = Number(page);
  let currentLimit = Number(limit);

  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = DEFAULT_PAGE;
  }

  if (isNaN(currentLimit) || currentLimit < 1) {
    currentLimit = defaultLimit;
  }

  if (currentLimit > MAX_PAGE_LIMIT) {
    currentLimit = MAX_PAGE_LIMIT;
  }

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};
