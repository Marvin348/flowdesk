import type { CardView } from "@/features/projects/components/view-controls/ViewToggle";
import type { ContentFilter } from "@shared/types/filter/contentFilter";
import type { Priority } from "@shared/types/priority";
import type { StatusBase } from "@shared/types/StatusBase";
import { useSearchParams } from "react-router";
import {
  parseCardViewParam,
  parsePriorityParam,
  parseStatusParam,
  parseHasAttachmentsParam,
} from "@/features/projects/utils/projectQueryParsers";

export const useProjectQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const cardViewParams = searchParams.get("cardView");
  const priorityParams = searchParams.get("priority");
  const statusParams = searchParams.get("status");
  const hasAttachmentsParams = searchParams.get("hasAttachments");

  const cardView: CardView = parseCardViewParam(cardViewParams);
  const priority: Priority | undefined = parsePriorityParam(priorityParams);
  const status: StatusBase | undefined = parseStatusParam(statusParams);
  const hasAttachments = parseHasAttachmentsParam(hasAttachmentsParams);

  const setQueryParam = (key: string, value?: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      if (key !== "page") {
        params.set("page", "1");
      }

      return params;
    });
  };

  const filter: ContentFilter = {
    priority,
    status,
    hasAttachments,
  };

  const toggleFilter = <K extends keyof ContentFilter>(
    key: K,
    value: ContentFilter[K],
  ) => {
    const nextValue = filter[key] === value ? undefined : value;

    setQueryParam(key, nextValue === undefined ? undefined : String(nextValue));
  };

  const setPage = (newPage: number) => setQueryParam("page", String(newPage));
  const setSearch = (value: string) => setQueryParam("search", value);

  const setCardView = (value: CardView) => {
    if (value === "card") {
      setQueryParam("cardView", undefined);
    } else {
      setQueryParam("cardView", value);
    }
  };

  const resetFilters = () =>
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.delete("priority");
      params.delete("status");
      params.delete("hasAttachments");
      params.set("page", "1");

      return params;
    });

  return {
    page,
    search,
    cardView,
    filter,
    actions: {
      setPage,
      setSearch,
      setCardView,
      resetFilters,
      toggleFilter,
    },
  };
};
