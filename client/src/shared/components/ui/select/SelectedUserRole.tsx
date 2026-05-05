import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { USER_ROLE_OPTIONS } from "@/features/users/constants/user-role-options";

type SelectedUserRoleProps = {
  value: string;
  onChange: (value: string) => void;
};

const SelectedUserRole = ({ value, onChange }: SelectedUserRoleProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wähle einen Rolle" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup className="z-60">
          <SelectLabel>Rolle</SelectLabel>
          {Object.values(USER_ROLE_OPTIONS).map((opt) => (
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
export default SelectedUserRole;
