import { MENU_ACTIONS } from "@/constants/project-card/menu-actions";
import type { Badge } from "@/store/slices/projectBadge";

type ActiveMenuBadgeType = {
  badge: Badge;
};

const ActiveMenuBadge = ({ badge }: ActiveMenuBadgeType) => {
  const Icon = MENU_ACTIONS[badge].icon;

  return <Icon stroke="#595959" fill="#D3D3D3" className="shrink-0" />;
};
export default ActiveMenuBadge;
