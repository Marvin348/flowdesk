import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useProjectQueryState } from "@/hooks/useProjectQueryState";

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
      <Search
        size={15}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground/70 focus:text-black"
      />
    </div>
  );
};
export default SearchInput;
