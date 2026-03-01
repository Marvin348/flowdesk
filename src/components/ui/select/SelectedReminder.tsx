import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectedReminderProps = {
  value: string;
  onChange: (value: string) => void;
};

const SelectedReminder = ({ value, onChange }: SelectedReminderProps) => {
  const REMINDER_OPTIONS = [
    { label: "Keinen", value: "none" },
    { label: "30 Minuten davor", value: "30 minutes before" },
    { label: "1 Stunde davor", value: "1 hour before" },
    { label: "1 Tag davor", value: "1 Day before" },
  ] as const;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-surface/80">
        <SelectValue placeholder="Reminder wählen" />
      </SelectTrigger>
      <SelectContent position="popper" className="z-100">
        <SelectGroup>
          <SelectLabel>Reminder</SelectLabel>
          {REMINDER_OPTIONS.map((opt) => (
            <SelectItem
              value={opt.value}
              key={opt.value}
              className="focus:bg-surface/10"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectedReminder;
