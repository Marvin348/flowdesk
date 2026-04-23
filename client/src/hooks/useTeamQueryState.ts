import { useSearchParams } from "react-router";

export const useTeamQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

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

  const setPage = (value: number) => setQueryParam("page", String(value));
  const setSearch = (value: string) => setQueryParam("search", value);

  return { page, search, actions: { setPage, setSearch } };
};
