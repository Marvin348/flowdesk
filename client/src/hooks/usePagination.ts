import type { TeamPerformance } from "@/utils/performance/getUserPerformance";
import { useState } from "react";

export const usePagination = (teamPerformance: TeamPerformance[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const totalPages = Math.ceil(teamPerformance.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pageData = teamPerformance.slice(startIndex, endIndex);

  return { currentPage, setCurrentPage, pageData, totalPages };
};
