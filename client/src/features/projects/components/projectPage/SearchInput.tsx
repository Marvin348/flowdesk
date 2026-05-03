import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useProjectQueryState } from "@/features/projects/hooks/useProjectQueryState";

const SearchInput = () => {
  const { search, actions } = useProjectQueryState();

  const [searchInput, setSearchInput] = useState(search);
  const debounceInput = useDebounce(searchInput, 300);

  useEffect(() => {
    actions.setSearch(debounceInput);
  }, [debounceInput]);

  return (
    <div className="relative">
      <input
        type="text"
        className="search-input"
        placeholder="Suche..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-foreground/70 focus:text-black" />
    </div>
  );
};
export default SearchInput;
