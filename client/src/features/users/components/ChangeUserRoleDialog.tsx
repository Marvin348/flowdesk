import { Button } from "@/shared/components/ui/button";
import SelectedUserRole from "@/shared/components/ui/select/SelectedUserRole";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { useChangeUserRole } from "@/features/users/hooks/useChangeUserRole";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SelectedUser } from "@/pages/TeamPage";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { USER_ROLE_OPTIONS } from "@/features/users/constants/user-role-options";
import type { UserRole } from "@shared/types/user";

type ChangeUserRoleDialogProps = {
  onClose: () => void;
  selectedUser: SelectedUser;
  currentRole: UserRole;
};
const ChangeUserRoleDialog = ({
  onClose,
  selectedUser,
  currentRole,
}: ChangeUserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState("");

  const { mutate, isPending, error } = useChangeUserRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) return;

    const input = {
      id: selectedUser.id,
      role: selectedRole,
    };

    mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const userRoleLabel = USER_ROLE_OPTIONS[currentRole].label;

  return (
    <div className="overlay flex items-center justify-center px-8">
      <div className="w-[380px] bg-white rounded-md">
        {/**header */}
        <div className="flex items-center gap-4 border-b p-4">
          <div className="bg-surface/5 p-3 rounded-md">
            <UserPen className="size-6" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-medium leading-tight">Rolle ändern</h3>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              für <span className="font-medium">{selectedUser.name}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Aktuell
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                {userRoleLabel}
              </p>
            </div>

            <div className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
              →
            </div>

            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Neu
              </p>
              <div className="mt-2">
                <SelectedUserRole
                  value={selectedRole}
                  onChange={setSelectedRole}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="error-text">Es konnte keine Rolle geändert werden</p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 border-t p-4">
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="px-4"
              onClick={onClose}
            >
              Schließen
            </Button>

            <Button
              size="sm"
              className="bg-accent hover:bg-accent/95 px-6"
              type="submit"
              disabled={currentRole === selectedRole || isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  Speichern <Spinner />
                </span>
              ) : (
                "Speichern"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChangeUserRoleDialog;
