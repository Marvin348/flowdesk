import { ArrowLeft, MailCheck, RefreshCw, CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useResendVerificationEmail } from "@/features/auth/hooks/useResendVerificationEmail";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Spinner } from "@/shared/components/ui/spinner";

type CheckEmailLocationState = {
  email?: string;
};

const CheckEmailPage = () => {
  const location = useLocation();
  const email = (location.state as CheckEmailLocationState | null)?.email;
  const recipient = email ?? "deine E-Mail-Adresse";

  const { mutate, isPending, isError, isSuccess } =
    useResendVerificationEmail();

  const handleResend = () => {
    if (!email) return;

    mutate(email);
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-5 py-6 text-foreground">
      <div className="w-full max-w-md rounded-md border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-accent/10 text-accent">
          <MailCheck className="size-6" />
        </div>

        <p className="mt-6 text-sm font-medium text-accent">FlowDesk</p>
        <h1 className="mt-2 text-2xl font-semibold">Check deine E-Mail</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Wir haben dir einen Bestätigungslink an{" "}
          <span className="font-medium text-foreground">{recipient}</span>{" "}
          geschickt.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Nichts bekommen? Prüfe kurz den Spam-Ordner.
        </p>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!email || isPending}
            onClick={handleResend}
          >
            {isSuccess ? (
              <span className="flex items-center gap-3">
                <CheckCircle />
                E-Mail erneut gesendet
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <RefreshCw className="size-4" />
                E-Mail erneut senden{" "}
                {isPending && <Spinner className="size-4" />}
              </span>
            )}
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Zurück zum Login
          </Link>
        </div>
        {isError && (
          <ErrorMessage message="E-Mail konnte nicht nochmal gesendet werden." />
        )}
      </div>
    </section>
  );
};
export default CheckEmailPage;
