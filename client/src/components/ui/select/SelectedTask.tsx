import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskOption = {
  taskId: string;
  taskTitle: string;
};

type SelectedTaskProps = {
  options: TaskOption[];
  value: string;
  onChange: (value: string) => void;
};

const SelectedTask = ({ options, value, onChange }: SelectedTaskProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-surface/80 bg-white">
        <SelectValue placeholder="Aufgabe wählen"/>
      </SelectTrigger>
      <SelectContent position="popper" className="z-100">
        <SelectGroup>
          <SelectLabel>Aufgaben</SelectLabel>

          {options.map((opt) => (
            <SelectItem
              key={opt.taskId}
              value={opt.taskId}
              className="focus:bg-surface/5"
            >
              {opt.taskTitle}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectedTask;
