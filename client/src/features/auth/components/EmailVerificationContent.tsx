import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { useEffect } from "react";
import VerificationPending from "@/features/auth/components/verification/VerificationPending";
import VerificationCard from "@/features/auth/components/verification/VerificationCard";
import { VerificationError } from "@/features/auth/components/verification/VerificationError";
import VerificationSuccess from "@/features/auth/components/verification/VerificationSuccess";
import { getApiErrorStatus } from "@/shared/api/getApiError";

const EmailVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, error, isSuccess } = useVerifyEmail();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      mutate(token);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mutate, token]);

  const status = getApiErrorStatus(error);

  if (isPending)
    return (
      <VerificationCard>
        <VerificationPending message="Deine E-Mail wird bestätigt." />
      </VerificationCard>
    );

  if (isSuccess)
    return (
      <VerificationCard>
        <VerificationSuccess
          title="E-Mail bestätigt"
          message="Dein Account ist jetzt aktiviert. Du kannst dich nun einloggen."
        />
      </VerificationCard>
    );

  if (isError) {
    if (status === 409) {
      return (
        <VerificationCard>
          <VerificationError
            title="Link wurde bereits verwendet"
            message="Dieser Bestätigungslink wurde schon benutzt. Starte die Emailverifizierung bitte erneut."
          />
        </VerificationCard>
      );
    }

    if (status === 410) {
      return (
        <VerificationCard>
          <VerificationError
            title="Link abgelaufen"
            message="Dieser Bestätigungslink ist abgelaufen. Starte die Emailverifizierung bitte erneut."
          />
        </VerificationCard>
      );
    }

    return (
      <VerificationCard>
        <VerificationError
          message={"Deine E-Mail konnte nicht verifiziert werden."}
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
export default EmailVerificationContent;
