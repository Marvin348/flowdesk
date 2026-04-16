import AssigneeAvatars from "@/components/users/avatar/AssigneeAvatars";
import { Folder, FolderX } from "lucide-react";
import type { ProjectOptionDto } from "@shared/types/dto/project";

type AssignProjectItemProps = {
  item: ProjectOptionDto;
  toggleSelectedProjectIds: (id: string) => void;
  isSelected: (id: string) => boolean;
};

const AssignProjectItem = ({
  item,
  toggleSelectedProjectIds,
  isSelected,
}: AssignProjectItemProps) => {
  const { id, title, isInvited, users } = item;

  const selected = isSelected(id);

  const handleClick = () => {
    if (isInvited) return;
    toggleSelectedProjectIds(id);
  };
  return (
    <button
      className={`w-full px-4 py-2 flex items-center justify-between gap-4 
      ${isInvited ? "cursor-not-allowed" : "cursor-pointer"} 
      ${selected && "bg-surface/7"} 
      ${!isInvited && !selected && "hover:bg-surface/4"}`}
      disabled={isInvited}
      onClick={handleClick}
    >
      <p className="flex items-center gap-2">
        {isInvited ? (
          <FolderX className="size-4 text-surface/80" />
        ) : (
          <Folder className="size-4 text-surface/80" />
        )}{" "}
        {title}
      </p>

      <div className="">
        <AssigneeAvatars users={users} />
      </div>
    </button>
  );
};
export default AssignProjectItem;
