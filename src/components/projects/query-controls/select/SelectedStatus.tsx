import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/constants/status-options";
import type { ContentFilter } from "@/store/slices/ui-state/filter";
import type { TaskStatus } from "@/type/taskStatus";

type SelectedStatusProps = {
  setFilter: (value: ContentFilter) => void;
  value?: TaskStatus;
};

const SelectedStatus = ({ setFilter, value }: SelectedStatusProps) => {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(value) =>
        setFilter({ status: value === "" ? undefined : (value as TaskStatus) })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wähle einen Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="z-60">
          <SelectLabel>Status</SelectLabel>
          {Object.values(STATUS_OPTIONS).map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              onClick={() => setFilter({ status: opt.value })}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectedStatus;
