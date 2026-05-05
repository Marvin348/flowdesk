import { Button } from "@/shared/components/ui/button";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { useUserDetails } from "@/features/users/hooks/useUserDetails";
import { UserPen, Mail, BriefcaseBusiness, X, FolderPen } from "lucide-react";
import { USER_ROLE_OPTIONS } from "@/features/users/constants/user-role-options";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { formatDate } from "@/shared/utils/formatDate";
import AssignProjectModal from "./AssignProjectModal";
import { useState } from "react";
import type { SelectedUser } from "@/pages/TeamPage";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import ChangeUserRoleDialog from "../ChangeUserRoleDialog";
import UserDetailsSkeleton from "./skeleton/UserDetailsSkeleton";

type UserDetailsProps = {
  selectedUser: SelectedUser;
  onClose: () => void;
};

const UserDetails = ({ selectedUser, onClose }: UserDetailsProps) => {
  const [isAssignProjectOpen, setIsAssignProjectOpen] = useState(false);
  const [changeUserRole, setChangeUserRole] = useState(false);

  const { data, isLoading, error } = useUserDetails(selectedUser.id);

  if (isLoading) return <UserDetailsSkeleton />;

  if (!data)
    return (
      <div className="flex-center text-muted-foreground">
        Keine Daten verfügbar
      </div>
    );

  const user = data.user;
  const stats = data.stats;
  const invitedProjects = data.invitedProjects ?? [];
  const recentCompletedTask = data.recentCompletedTask;
  const nextDueTask = data?.nextDueTask;

  const visibleProjects = invitedProjects.slice(0, 3);
  const hiddenProjectsCount = invitedProjects.length - visibleProjects.length;

  const UserRoleIcon = USER_ROLE_OPTIONS[user.role].icon;
  const userRoleLabel = USER_ROLE_OPTIONS[user.role].label;

  return (
    <div>
      <div className="border rounded-md">
        {error && (
          <div className="flex-center text-muted-foreground">
            Fehler beim Laden
          </div>
        )}

        <div className="p-4">
          <button onClick={onClose} className="text-surface/80">
            <X />
          </button>
          <div className="flex flex-col items-center gap-2">
            <Avatar avatarKey={user.avatarKey} size="xl" />

            <p className="text-xl font-medium">{user.name}</p>
            <p className="text-muted-foreground">{user.jobTitle}</p>

            <div className="mt-2 grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                className="duration-200"
                onClick={() => setIsAssignProjectOpen(true)}
              >
                <FolderPen /> Projekte
              </Button>
              <Button
                variant="outline"
                className="duration-200"
                onClick={() => setChangeUserRole(true)}
              >
                <UserPen /> Rolle ändern
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-muted/30 p-4">
            <h4 className="text-base font-medium mb-3">
              Persönliche Informationen
            </h4>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <UserRoleIcon className="size-4 text-muted-foreground" />
                <span>{userRoleLabel}</span>
              </div>

              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="size-4 text-muted-foreground" />
                <span>{user.jobTitle}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-muted/30 p-4">
            <h4 className="text-base font-medium mb-4">Arbeitsstatus</h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-background p-3">
                <p className="text-xs text-muted-foreground">Ausstehend</p>
                <p className="text-lg font-medium">{stats.pendingCount}</p>
              </div>

              <div className="rounded-lg bg-background p-3">
                <p className="text-xs text-muted-foreground">In Arbeit</p>
                <p className="text-lg font-medium">{stats.inProgressCount}</p>
              </div>

              <div className="rounded-lg bg-background p-3">
                <p className="text-xs text-muted-foreground">Erledigt</p>
                <p className="text-lg font-medium">{stats.completedCount}</p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Aktive Projekte</h4>
              {hiddenProjectsCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  +{hiddenProjectsCount} weitere
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {visibleProjects.map((p) => (
                <div key={p.id} className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-sm leading-tight">
                      {p.title}
                    </p>
                    <span
                      style={{
                        backgroundColor: STATUS_OPTIONS[p.projectStatus].color,
                      }}
                      className="px-2 rounded-full w-fit text-sm"
                    >
                      {STATUS_OPTIONS[p.projectStatus].label}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Priorität: {PRIORITY_OPTIONS[p.priority].label}
                  </p>
                </div>
              ))}
              {!visibleProjects.length && (
                <div className="text-sm text-muted-foreground">
                  Keine Projekte gefunden
                </div>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h4 className="text-lg font-medium">Nächste Aufgabe</h4>

            {nextDueTask ? (
              <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-sm leading-tight">
                  {nextDueTask.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fällig am {formatDate(nextDueTask.dueDate)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Keine offene Aufgabe
              </p>
            )}
          </section>

          <section className="mt-8">
            <h4 className="text-lg font-medium">Letzte erledigte Aufgabe</h4>

            {recentCompletedTask ? (
              <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-sm leading-tight">
                  {recentCompletedTask.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Erledigt am {formatDate(recentCompletedTask.completedAt)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Noch keine erledigte Aufgabe
              </p>
            )}
          </section>
        </div>
      </div>

      {isAssignProjectOpen && (
        <AssignProjectModal
          onClose={() => setIsAssignProjectOpen(false)}
          selectedUser={selectedUser}
        />
      )}

      {changeUserRole && (
        <ChangeUserRoleDialog
          onClose={() => setChangeUserRole(false)}
          selectedUser={selectedUser}
          currentRole={user.role}
        />
      )}
    </div>
  );
};
export default UserDetails;
