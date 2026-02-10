import { Search } from "lucide-react";
import { useAppStore } from "@/store";

const SearchInput = () => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  console.log(searchQuery)

  return (
    <div className="relative">
      <input
        type="text"
        className=" w-full h-8 border rounded-md pl-8 pr-4 focus:none"
        placeholder="Suche Projekte"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search
        size={15}
        className="absolute top-2 bottom-2 left-2 text-foreground/70 focus:text-black"
      />
    </div>
  );
};
export default SearchInput;
