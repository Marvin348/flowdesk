import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { ChevronDown, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link, useNavigate } from "react-router";

const SidebarUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useLogout();

  if (!user) return null;

  const onLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
        setIsOpen(false);
      },
    });
  };

  return (
    <div className="relative pt-3">
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-md border bg-background p-1 shadow-md">
          <Link
            to="/account"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            <User className="h-4 w-4" />
            Account
          </Link>

          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
            <Settings className="h-4 w-4" />
            Einstellungen
          </button>

          <div className="my-1 h-px bg-border" />

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <div className="border-t pt-2">
        <button
          className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Avatar avatarKey={user.avatarKey} size="sm" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-none">
              {user.name}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
export default SidebarUserMenu;
