import type { User } from "@/type/domain/user";
import Avatar from "@/components/users/avatar/Avatar";
import { X } from "lucide-react";

type SelectedUserChipProps = {
  user: User;
  onRemove: () => void;
};

const SelectedUserChip = ({ user, onRemove }: SelectedUserChipProps) => {
  return (
    <div
      className="flex items-center gap-1 text-xs text-surface/90 bg-surface/5 rounded-full cursor-pointer"
      onClick={onRemove}
    >
      <Avatar avatarKey={user.avatarKey} />
      <div className="p-1 flex items-center gap-2">
        <p className="font-medium">{user.name}</p>
        <X className="size-4" />
      </div>
    </div>
  );
};
export default SelectedUserChip;
