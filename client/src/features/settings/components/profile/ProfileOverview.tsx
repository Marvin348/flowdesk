import { Button } from "@/shared/components/ui/button";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import type { AuthUser } from "@shared/types/user";
import { Pencil } from "lucide-react";
import { useState } from "react";
import ChangeEmailForm from "@/features/settings/components/profile/ChangeEmailForm";
import ProfileSettingsForm from "@/features/settings/components/profile/ProfileSettingsForm";
import AvatarUploadCard from "@/features/settings/components/profile/AvatarUploadCard";

const ProfileOverview = ({ currentUser }: { currentUser: AuthUser }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  return (
    <section className="mt-6 overflow-hidden rounded-md border bg-background">
      <div className="p-5">
        <h4 className="font-semibold text-sm">Profil</h4>

        {isEditingProfile ? (
          <div className="mt-2">
            <div>
              <AvatarUploadCard user={currentUser} />
            </div>

            <div>
              <ProfileSettingsForm
                user={currentUser}
                onClose={() => setIsEditingProfile(false)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="shrink-0 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background">
                <Avatar
                  avatarKey={currentUser.avatarKey}
                  avatarUrl={currentUser.avatarUrl}
                  size="lg"
                />
              </div>

              <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="mt-1 truncate text-sm font-medium">
                    {currentUser.name}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Jobtitel</p>
                  <p className="mt-1 flex items-center gap-2 truncate text-sm font-medium">
                    <span className="truncate">
                      {currentUser.jobTitle || "Noch keinen Jobtitel"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="justify-self-end"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsEditingProfile(true)}
            >
              <Pencil className="size-3.5" />
              Profil bearbeiten
            </Button>
          </div>
        )}
      </div>

      <div className="border-t bg-muted/20 p-5">
        <div className="mb-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <h4 className="font-semibold text-sm">Konto</h4>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {isChangingEmail ? "Aktuelle E-Mail" : "E-Mail"}
              </p>
              <p className="mt-1 truncate text-sm font-medium">
                {currentUser.email}
              </p>
            </div>
          </div>

          {!isChangingEmail && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsChangingEmail(true)}
            >
              E-Mail ändern
            </Button>
          )}
        </div>

        {isChangingEmail && (
          <ChangeEmailForm onClose={() => setIsChangingEmail(false)} />
        )}
      </div>

      <div className="border-t p-5">
        <h4 className="font-semibold text-sm">Rolle</h4>

        <div className="mt-4">
          <p className="text-sm font-medium">{currentUser.role}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Wird von den Workspace-Administratoren verwaltet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileOverview;
