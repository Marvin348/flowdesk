import { MENU_ACTIONS } from "@/constants/project-card/menu-actions";
import type { Badge } from "@/store/slices/projectBadge";
import { Trash2 } from "lucide-react";

type ProjectCardMenuProps = {
  onClose: () => void;
  onAction: (value: Badge) => void;
  badge?: Badge;
  onDialog: () => void;
};

const ProjectCardMenu = ({
  onClose,
  onAction,
  badge,
  onDialog,
}: ProjectCardMenuProps) => {
  const onClick = (value: Badge) => {
    onClose();
    onAction(value);
  };

  return (
    <div
      className="absolute top-7 right-2 bg-white border rounded-md z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-1">
        {Object.values(MENU_ACTIONS).map(({ label, icon: Icon, value }) => {
          const isActiveBadge = badge === value;
          return (
            <button
              key={value}
              onClick={() => onClick(value)}
              className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
            >
              <Icon className="size-4" />{" "}
              {isActiveBadge ? "Zurücksetzen" : label}
            </button>
          );
        })}
      </div>

      <div className="border-t p-1">
        <button
          className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
          onClick={onDialog}
        >
          <Trash2 className="size-4" /> Löschen
        </button>
      </div>
    </div>
  );
};
export default ProjectCardMenu;
