import { useSearchParams } from "react-router";
import { parseProjectCommentsSort } from "@shared/parsers/parseProjectCommentsSort";
export const useProjectCommentsSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const commentsSort =
    parseProjectCommentsSort(searchParams.get("commentsSort")) ?? "newest";

  const toggleCommentsSort = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const nextValue = commentsSort === "newest" ? "oldest" : "newest";

      params.set("commentsSort", nextValue);

      return params;
    });
  };

  return { commentsSort, toggleCommentsSort };
};
