import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useNavigate } from "react-router";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { DEMO_ACCOUNT } from "@/features/auth/constants/demoAccount";

const loginSchema = z.object({
  email: z.string().min(1, "Email eingeben").email("Gültige Email eingeben"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
});

type LoginFields = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, error } = useLogin();

  const onSubmit = (data: LoginFields) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  const fillDemoAccount = () => {
    setValue("email", DEMO_ACCOUNT.email, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", DEMO_ACCOUNT.password, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex min-h-screen px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex items-center w-full max-w-6xl">
        <section className="hidden flex-1 pr-12 lg:block">
          <div className="mb-10 inline-flex h-11 items-center rounded-md border bg-card px-4 text-sm font-medium shadow-xs">
            FlowDesk
          </div>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-foreground">
            Willkommen zurück in deinem Projekt-Workspace.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            Behalte Projekte, Aufgaben, Team-Workload und Entscheidungen an
            einem Ort im Blick.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {["Projects", "Tasks", "Team"].map((item) => (
              <div
                key={item}
                className="rounded-md border bg-card px-4 py-3 text-sm shadow-xs"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-md border bg-card p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-medium text-accent">FlowDesk</p>
            <h2 className="mt-2 text-2xl font-semibold">Einloggen</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Melde dich mit deinem Workspace-Account an.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="form-input pl-10"
                  placeholder="max@mustermann.de"
                />
              </div>
              {errors.email && (
                <ErrorMessage message={errors.email.message} className="mt-1" />
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm">
                Passwort
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="form-input h-11 px-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Passwort ausblenden" : "Passwort anzeigen"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <ErrorMessage
                  message={errors.password.message}
                  className="mt-1"
                />
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || isPending}
            >
              {!isPending ? (
                <span className="flex items-center gap-2">
                  Einloggen
                  <ArrowRight className="size-4" />
                </span>
              ) : (
                <Spinner />
              )}
            </Button>
            {error && (
              <ErrorMessage message="E-Mail oder Passwort ist falsch!" />
            )}

            <button
              type="button"
              onClick={fillDemoAccount}
              className="flex w-full items-center justify-between rounded-md border bg-muted/45 px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
            >
              <span>
                <span className="block font-medium text-foreground">
                  Demo account nutzen
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Zugangsdaten automatisch eintragen
                </span>
              </span>
              <KeyRound className="size-4 text-accent" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Noch keinen Account?{" "}
            <Link
              to="/register"
              className="font-medium text-foreground hover:underline"
            >
              Registrieren
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
export default LoginPage;
