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
import type { StatusBase } from "@shared/types/StatusBase";

type SelectedStatusProps = {
  onChange: (value: StatusBase) => void;
  value?: StatusBase;
};

const SelectedStatus = ({ onChange, value }: SelectedStatusProps) => {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(value) => onChange(value as StatusBase)}
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
              onClick={() => onChange(opt.value)}
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
export default SelectedStatus;
