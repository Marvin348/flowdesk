import { Button } from "@/shared/components/ui/button";
import SelectedUserRole from "@/shared/components/ui/select/SelectedUserRole";
import { X } from "lucide-react";
import { useState } from "react";
import { USER_ROLE_OPTIONS } from "@/features/users/constants/user-role-options";
import { useChangeUserRole } from "@/features/users/hooks/useChangeUserRole";
import { Spinner } from "@/shared/components/ui/spinner";
import type { UserRole } from "@shared/types/user";

type ChangeUserRoleDialogProps = {
  onClose: () => void;
  userName: string;
  currentRole: UserRole;
  userId: string;
};
const ChangeUserRoleDialog = ({
  onClose,
  userName,
  currentRole,
  userId,
}: ChangeUserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState("");

  const { mutate, isPending, error } = useChangeUserRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) return;

    const input = {
      id: userId,
      role: selectedRole,
    };

    mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const RoleIcon = USER_ROLE_OPTIONS[currentRole].icon;

  return (
    <div className="overlay flex items-center justify-center px-8">
      <form
        onSubmit={handleSubmit}
        className="w-[350px] bg-white p-4 rounded-md"
      >
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-medium text-xl">Rolle ändern</h3>
          <button
            onClick={onClose}
            className="text-surface/80 hover:text-surface"
            type="button"
          >
            <X />
          </button>
        </div>

        <div className="pt-4">
          <div>
            <p className="text-muted-foreground">Name:</p>
            <p>{userName}</p>
          </div>

          <div className="mt-4">
            <p className="text-muted-foreground">Aktuelle Rolle:</p>
            <p className="flex items-center gap-1">
              <RoleIcon className="size-4 text-surface/80" />{" "}
              {USER_ROLE_OPTIONS[currentRole].label}
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-1 text-muted-foreground">Neue Rolle:</p>
            <SelectedUserRole value={selectedRole} onChange={setSelectedRole} />
          </div>
        </div>

        {error && (
          <p className="error-text">Es konnte keine Rolle geändert werden</p>
        )}

        <div className="mt-8 flex items-center justify-between gap-6">
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="hover:bg-surface/5"
            onClick={onClose}
          >
            Schließen
          </Button>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/95 w-30"
            type="submit"
            disabled={currentRole === selectedRole}
          >
            Speichern {isPending && <Spinner />}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChangeUserRoleDialog;
