import type { TeamMemberDto } from "@shared/types/dto/user.js";

export const pagination = (
  items: TeamMemberDto[],
  page: number,
  limit: number,
) => {
  let currentPage = page;

  const totalPages = Math.ceil(items.length / limit);

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedItems = items.slice(startIndex, endIndex);

  return { currentPage, totalPages, items: paginatedItems };
};
