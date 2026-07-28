import { useVerifyChangePassword } from "@/features/auth/hooks/useVerifyChangePassword";
import { useEffect } from "react";
import VerificationPending from "@/features/auth/components/verification/VerificationPending";
import VerificationCard from "@/features/auth/components/verification/VerificationCard";
import VerificationLoginRequired from "@/features/auth/components/verification/VerificationLoginRequired";
import VerificationSuccess from "@/features/auth/components/verification/VerificationSuccess";
import { useNavigate } from "react-router";
import { getApiErrorStatus } from "@/shared/api/getApiError";
import { VerificationError } from "@/features/auth/components/verification/VerificationError";

const ChangePasswordVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, error, isSuccess } =
    useVerifyChangePassword();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      mutate(token);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mutate, token]);

  const onLogin = () => {
    navigate(`/login?redirect=/confirm-password-change/${token}`);
  };

  const status = getApiErrorStatus(error);

  if (isPending)
    return (
      <VerificationCard>
        <VerificationPending message="Dein neues Passwort wird geändert." />
      </VerificationCard>
    );

  if (isError) {
    if (status === 401) {
      return (
        <VerificationCard>
          <VerificationLoginRequired
            label="Dein Passwort konnte noch nicht geändert werden."
            onLogin={onLogin}
          />
        </VerificationCard>
      );
    }

    if (status === 409) {
      return (
        <VerificationCard>
          <VerificationError
            title="Link wurde bereits verwendet"
            message="Dieser Bestätigungslink wurde schon benutzt. Starte die Passwortänderung bitte erneut."
          />
        </VerificationCard>
      );
    }

    if (status === 410) {
      return (
        <VerificationCard>
          <VerificationError
            title="Link abgelaufen"
            message="Dieser Bestätigungslink ist abgelaufen. Starte die Passwortänderung bitte erneut."
          />
        </VerificationCard>
      );
    }

    return (
      <VerificationCard>
        <VerificationError
          message={"Dein Passwort konnte nicht geändert werden."}
        />
      </VerificationCard>
    );
  }

  if (isSuccess)
    return (
      <VerificationCard>
        <VerificationSuccess
          title="Passwort geänder"
          message="Dein Passwort wurde erfolgreich geändert. Du kannst dich nun einloggen."
        />
      </VerificationCard>
    );

  return (
    <VerificationCard>
      <VerificationPending message="Bestätigung wird vorbereitet." />
    </VerificationCard>
  );
};
export default ChangePasswordVerificationContent;
