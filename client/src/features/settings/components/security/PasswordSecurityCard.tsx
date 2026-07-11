import ChangePasswordForm from "@/features/settings/components/security/ChangePasswordForm";
import { Button } from "@/shared/components/ui/button";
import { formatDate } from "@/shared/utils/formatDate";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

type PasswordSecurityCardProps = {
  passwordChangedAt: string | null;
  isLoadingSecurityData: boolean;
};

const PasswordSecurityCard = ({
  passwordChangedAt,
  isLoadingSecurityData,
}: PasswordSecurityCardProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div>
      <div className="p-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <LockKeyhole className="size-4" />
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold">Passwort</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Aktualisiere dein Passwort, um deinen Account zu schützen.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Zuletzt geändert
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {isLoadingSecurityData
                      ? "Wird geladen..."
                      : passwordChangedAt
                        ? formatDate(passwordChangedAt)
                        : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    Aktiv
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isChangingPassword && (
            <Button
              className="justify-self-end"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsChangingPassword(true)}
            >
              Passwort ändern
            </Button>
          )}
        </div>
      </div>

      {isChangingPassword && (
        <div className="border-t bg-muted/20">
          <ChangePasswordForm onClose={() => setIsChangingPassword(false)} />
        </div>
      )}
    </div>
  );
};

export default PasswordSecurityCard;
