import { MENU_ACTIONS } from "@/constants/project-card/menu-actions";

type ActiveMenuBadgeType = {
  onSelect: keyof typeof MENU_ACTIONS;
};

const ActiveMenuBadge = ({ onSelect }: ActiveMenuBadgeType) => {
  const Icon = MENU_ACTIONS[onSelect].icon;

  return <Icon stroke="#595959" fill="#D3D3D3" />;
};
export default ActiveMenuBadge;
