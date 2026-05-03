import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import type { Priority } from "@shared/types/priority";

type SelectedPriorityProps = {
  value: Priority;
  onChange: (value: Priority) => void;
};

const SelectedPriority = ({ value, onChange }: SelectedPriorityProps) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as Priority)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Priorität wählen" />
      </SelectTrigger>
      <SelectContent position="popper" className="z-100">
        <SelectGroup>
          <SelectLabel>Priorität</SelectLabel>
          {Object.values(PRIORITY_OPTIONS).map((prio) => (
            <SelectItem
              value={prio.value}
              key={prio.value}
              className="focus:bg-surface/5"
            >
              {prio.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectedPriority;
