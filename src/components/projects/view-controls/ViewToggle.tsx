import type { View } from "@/pages/ProjectsPage";
import { List, Grid3x3 } from "lucide-react";

type ViewToggleProps = {
  value: View;
  onChange: (next: View) => void;
};

const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  return (
    <div className="flex border h-8 rounded-md">
      <button
        onClick={() => onChange("card")}
        className="flex items-center gap-2 px-3
          border border-transparent rounded-l-md -m-px
          data-[state=active]:border-accent"
        data-state={value === "card" ? "active" : "inactive"}
      >
        <Grid3x3
          stroke={value === "card" ? "#FF8421" : "black"}
          className="size-4"
        />
        Card
      </button>

      <button
        className="flex items-center rounded-r-md gap-2 px-3 border border-transparent -m-px
          data-[state=active]:border-accent"
        onClick={() => onChange("list")}
        data-state={value === "list" ? "active" : "inactive"}
      >
        <List
          stroke={value === "list" ? "#FF8421" : "black"}
          className="size-4"
        />
        Liste
      </button>
    </div>
  );
};
export default ViewToggle;
