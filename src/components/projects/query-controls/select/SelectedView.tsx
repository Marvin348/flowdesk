import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILTER_VIEW_OPTIONS } from "@/constants/filter/view-options";
import type {
  ContentFilter,
  ProjectViewFilter,
} from "@/store/slices/ui-state/filter";

type SelectedViewProps = {
  value?: ProjectViewFilter;
  setFilter: (value: ContentFilter) => void;
};

const SelectedView = ({ value, setFilter }: SelectedViewProps) => {

  return (
    <Select
      value={value ?? ""}
      onValueChange={(value) =>
        setFilter({
          view: value === "" ? undefined : (value as ProjectViewFilter),
        })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wähle eine Eigenschaft" />
      </SelectTrigger>
      <SelectContent className="z-60">
        <SelectGroup>
          <SelectLabel>Eigenschaften</SelectLabel>
          {Object.values(FILTER_VIEW_OPTIONS).map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectedView;
