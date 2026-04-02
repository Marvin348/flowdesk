import { UserRound, ShieldUser, UserCog } from "lucide-react";

export const USER_ROLE_OPTIONS = {
  member: { label: "Member", value: "member", icon: UserRound },
  manager: { label: "Manager", value: "manager", icon: UserCog },
  admin: { label: "Admin", value: "admin", icon: ShieldUser },
} as const;
