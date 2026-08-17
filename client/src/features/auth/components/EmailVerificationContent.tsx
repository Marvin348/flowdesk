import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { useEffect } from "react";
import VerificationPending from "@/features/auth/components/verification/VerificationPending";
import VerificationCard from "@/features/auth/components/verification/VerificationCard";
import { VerificationError } from "@/features/auth/components/verification/VerificationError";
import VerificationSuccess from "@/features/auth/components/verification/VerificationSuccess";

const EmailVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, isSuccess } = useVerifyEmail();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      mutate(token);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mutate, token]);

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
    return (
      <VerificationCard>
        <VerificationError
          title="Bestätigung nicht möglich"
          message="Dieser Bestätigungslink ist ungültig, abgelaufen oder wurde bereits verwendet."
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
