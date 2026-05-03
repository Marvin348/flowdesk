import type { UserPerformance } from "@/features/users/utils/getUserPerformance";
import { useState } from "react";

// refactor later in backend

export const usePagination = (teamPerformance: UserPerformance[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const totalPages = Math.ceil(teamPerformance.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pageData = teamPerformance.slice(startIndex, endIndex);

  return { currentPage, setCurrentPage, pageData, totalPages };
};
