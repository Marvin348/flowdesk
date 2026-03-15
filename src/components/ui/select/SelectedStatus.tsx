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
import type { ContentFilter } from "@/store/slices/filter";
import type { StatusBase } from "@/type/domain/StatusBase";

type SelectedStatusProps = {
  setFilter: (value: ContentFilter) => void;
  value?: StatusBase;
};

const SelectedStatus = ({ setFilter, value }: SelectedStatusProps) => {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(value) =>
        setFilter({ status: value === "" ? undefined : (value as StatusBase) })
      }
    >
      <SelectTrigger className="w-full text-surface/80">
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
