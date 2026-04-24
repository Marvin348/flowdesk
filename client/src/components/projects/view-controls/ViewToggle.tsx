import { List, Grid3x3 } from "lucide-react";
import { useProjectQueryState } from "@/hooks/projects/useProjectQueryState";

export type CardView = "card" | "list";

const ViewToggle = () => {
  const { cardView, actions } = useProjectQueryState();

  return (
    <div className="flex border h-8 rounded-md">
      <button
        onClick={() => actions.setCardView("card")}
        className="flex items-center gap-2 px-3
          border border-transparent rounded-l-md -m-px
          data-[state=active]:border-accent"
        data-state={cardView === "card" ? "active" : "inactive"}
      >
        <Grid3x3
          stroke={cardView === "card" ? "#FF8421" : "black"}
          className="size-4"
        />
        Card
      </button>

      <button
        className="flex items-center rounded-r-md gap-2 px-3 border border-transparent -m-px
          data-[state=active]:border-accent"
        onClick={() => actions.setCardView("list")}
        data-state={cardView === "list" ? "active" : "inactive"}
      >
        <List
          stroke={cardView === "list" ? "#FF8421" : "black"}
          className="size-4"
        />
        Liste
      </button>
    </div>
  );
};
export default ViewToggle;
