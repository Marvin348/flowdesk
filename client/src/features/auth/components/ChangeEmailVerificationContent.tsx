import { useVerifyChangedEmail } from "@/features/users/hooks/email/useVerifyChangedEmail";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import VerificationPending from "@/features/auth/components/verification/VerificationPending";
import VerificationCard from "@/features/auth/components/verification/VerificationCard";
import VerificationLoginRequired from "@/features/auth/components/verification/VerificationLoginRequired";
import { VerificationError } from "@/features/auth/components/verification/VerificationError";
import VerificationSuccess from "@/features/auth/components/verification/VerificationSuccess";
import { getApiErrorStatus } from "@/shared/api/getApiError";

const ChangeEmailVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, error, isSuccess } =
    useVerifyChangedEmail();
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
    navigate(`/login?redirect=/confirm-email-change/${token}`);
  };

  const status = getApiErrorStatus(error);

  if (isPending)
    return (
      <VerificationCard>
        <VerificationPending message="Deine neue E-Mail wird geändert." />
      </VerificationCard>
    );

  if (isSuccess)
    return (
      <VerificationCard>
        <VerificationSuccess
          title="E-Mail geändert"
          message="Dein Email wurde erfolgreich geändert. Du kannst dich nun einloggen."
        />
      </VerificationCard>
    );

  if (isError) {
    if (status === 401) {
      return (
        <VerificationCard>
          <VerificationLoginRequired
            label="Deine E-Mail konnte noch nicht geändert werden."
            onLogin={onLogin}
          />
        </VerificationCard>
      );
    }

    if (status === 409) {
      return (
        <VerificationCard>
          <VerificationError
            title="E-Mail nicht verfügbar"
            message="Diese E-Mail-Adresse wird bereits verwendet. Starte die E-Mailänderung bitte mit einer anderen Adresse erneut."
          />
        </VerificationCard>
      );
    }

    return (
      <VerificationCard>
        <VerificationError
          message={"Deine E-Mail konnte nicht geändert werden."}
        />
      </VerificationCard>
    );
  }

  return (
    <VerificationCard>
      <VerificationPending message="Bestätigung wird vorbereitet." />
    </VerificationCard>
  );
};
export default ChangeEmailVerificationContent;
