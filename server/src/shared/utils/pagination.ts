export const pagination = <T>(items: T[], page: number, limit: number) => {
  let currentPage = page;

  const totalPages = Math.ceil(items.length / limit);

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedItems = items.slice(startIndex, endIndex);

  return { currentPage, totalPages, items: paginatedItems };
};
