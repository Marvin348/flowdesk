import { useVerifyChangedEmail } from "@/features/users/hooks/useVerifyChangedEmail";
import { useEffect } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { CheckCircle2, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { useNavigate } from "react-router";

const ChangeEmailVerificationContent = ({ token }: { token: string }) => {
  const { mutate, isPending, isError, isSuccess } = useVerifyChangedEmail();
  const navigate = useNavigate();

  useEffect(() => {
    mutate(token);
  }, [mutate, token]);

  const onLogin = () => {
    navigate(`/login?redirect=/confirm-email-change/${token}`);
  };

  let content = (
    <div className="flex items-center justify-center gap-4">
      <Spinner className="size-8 text-accent" />
      <p className="text-sm text-muted-foreground">
        Deine neue E-Mail wird geändert.
      </p>
    </div>
  );

  if (isPending) {
    content = (
      <div className="flex items-center justify-center gap-4">
        <Spinner className="size-8 text-accent" />
        <p className="text-sm text-muted-foreground">
          Deine neue E-Mail wird geändert.
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
        <h1 className="mt-6 text-2xl font-semibold">E-Mail geändert</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Dein Email wurde erfolgreich geändert. Du kannst dich nun einloggen.
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
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Anmeldung erforderlich</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Deine E-Mail-Adresse konnte noch nicht bestätigt werden. Melde dich
          zuerst bei FlowDesk an und öffne anschließend den Link erneut.
        </p>
        <div className="mt-5 rounded-md border bg-muted/40 px-4 py-3 text-left text-xs leading-5 text-muted-foreground">
          Der Bestätigungslink bleibt erhalten, während du dich anmeldest.
        </div>
        <Button size="lg" className="mt-6 w-full" onClick={onLogin}>
          <LogIn className="size-4" />
          Bei FlowDesk anmelden
        </Button>
      </div>
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
export default ChangeEmailVerificationContent;
