import { MENU_ACTIONS } from "@/constants/project-card/menu-actions";
import type { Badge } from "@/store/slices/ui-state/projectBadge";

type ProjectCardMenuProps = {
  onClose: () => void;
  onAction: (value: Badge) => void;
  badge: Badge;
};

const ProjectCardMenu = ({
  onClose,
  onAction,
  badge,
}: ProjectCardMenuProps) => {
  const onClick = (value: Badge) => {
    onClose();
    onAction(value);
  };

  return (
    <div className="absolute top-7 right-2 bg-white border p-1 rounded-md z-10">
      {Object.values(MENU_ACTIONS).map(({ label, icon: Icon, value }) => {
        const isActiveBadge = badge === value;
        return (
          <button
            key={value}
            onClick={() => onClick(value)}
            className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
          >
            <Icon size={15} /> {isActiveBadge ? "Zurücksetzen" : label}
          </button>
        );
      })}
    </div>
  );
};
export default ProjectCardMenu;
