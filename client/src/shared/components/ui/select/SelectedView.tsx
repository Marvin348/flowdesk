import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FILTER_VIEW_OPTIONS } from "@/features/projects/constants/view-options";
import type { ContentFilter, ProjectViewFilter } from "@/store/slices/filter";

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
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="focus:bg-surface/5"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectedView;
