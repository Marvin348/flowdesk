type SortDirection = "asc" | "desc";

type SortState<T> = {
  sortKey: T;
  sortDirection: SortDirection;
};

export const updateSort = <T>(
  value: T,
  setSortedBy: React.Dispatch<React.SetStateAction<SortState<T> | null>>,
) =>
  setSortedBy((prev) => {
    if (prev?.sortKey !== value) {
      return {
        sortKey: value,
        sortDirection: "asc",
      };
    }

    return {
      sortKey: value,
      sortDirection: prev?.sortDirection === "asc" ? "desc" : "asc",
    };
  });
