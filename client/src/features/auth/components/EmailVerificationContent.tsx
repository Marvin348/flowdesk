import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { CheckCircle2, LogIn } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

const EmailVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, isSuccess } = useVerifyEmail();

  useEffect(() => {
    mutate(token);
  }, [mutate, token]);

  let content = (
    <div className="flex items-center justify-center gap-4">
      <Spinner className="size-8 text-accent" />
      <p className="text-sm text-muted-foreground">
        Deine E-Mail wird verifiziert.
      </p>
    </div>
  );

  if (isPending) {
    content = (
      <div className="flex items-center justify-center gap-4">
        <Spinner className="size-8 text-accent" />
        <p className="text-sm text-muted-foreground">
          Deine E-Mail wird verifiziert.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    content = (
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-accent/10 text-accent">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">E-Mail bestätigt</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Dein Account ist jetzt aktiviert. Du kannst dich nun einloggen.
        </p>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/login">
            <LogIn className="size-4" />
            Zum Login
          </Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    content = (
      <ErrorMessage
        message="Etwas ist schief gelaufen. Bitte versuche es erneut."
        className="text-center"
      />
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-5 py-6 text-foreground">
      <div className="w-full max-w-sm rounded-md border bg-card p-6 shadow-sm sm:p-8">
        {content}
      </div>
    </section>
  );
};
export default EmailVerificationContent;
