import { Button } from "@/components/ui/button";
import type { View } from "@/pages/ProjectsPage";
import { List, Grid3x3 } from "lucide-react";

type ViewToggleProps = {
  value: View;
  onChange: (next: View) => void;
};

const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  return (
    <div>
      <Button
        onClick={() => onChange("card")}
        variant="outline"
        className="mr-2"
        data-state={value === "card" ? "active" : "inactive"}
      >
        <Grid3x3 stroke={value === "card" ? "#FF8421" : "black"} />
        Card
      </Button>

      <Button
        onClick={() => onChange("list")}
        variant="outline"
        data-state={value === "list" ? "active" : "inactive"}
      >
        <List stroke={value === "list" ? "#FF8421" : "black"} />
        Liste
      </Button>
    </div>
  );
};
export default ViewToggle;
