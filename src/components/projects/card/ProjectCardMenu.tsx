import { PROJECT_MENU_LABEL } from "@/constants/project-card/project-menu-labels";

type MenuValue = (typeof PROJECT_MENU_LABEL)[number]["value"];

type ProjectCardMenuProps = {
  handleSelect: (value: MenuValue) => void;
  onClose: () => void;
};

const ProjectCardMenu = ({ handleSelect, onClose }: ProjectCardMenuProps) => {
  const handleClick = (value: MenuValue) => {
    handleSelect(value);
    onClose();
  };

  return (
    <div className="absolute top-7 right-2 bg-white border p-1 rounded-md  z-10">
      {PROJECT_MENU_LABEL.map(({ label, icon: Icon, value }) => (
        <button
          key={label}
          onClick={() => handleClick(value)}
          className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
        >
          <Icon size={15} /> {label}
        </button>
      ))}
    </div>
  );
};
export default ProjectCardMenu;
