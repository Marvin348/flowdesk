import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2, "Name eingeben"),
  email: z.string().min(1, "Email eingeben").email("Gültige Email eingeben"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
});

type RegisterFields = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFields) => {
    console.info("register submitted", {
      name: data.name,
      email: data.email,
    });
  };

  return (
    <div className="flex min-h-screen px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center">
        <section className="hidden flex-1 pr-12 lg:block">
          <div className="mb-10 inline-flex h-11 items-center rounded-md border bg-card px-4 text-sm font-medium shadow-xs">
            FlowDesk
          </div>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-foreground">
            Starte mit einem Workspace, der Arbeit sortierbar macht.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            Plane Projekte, verteile Aufgaben und erkenne früh, wo dein Team
            Fokus braucht.
          </p>

          <div className="mt-10 max-w-lg rounded-md border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 text-sm">
              <span className="font-medium">Today</span>
              <span className="text-muted-foreground">4 active projects</span>
            </div>
            <div className="mt-4 space-y-3">
              {["Client launch", "Design review", "Backend sync"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item}</span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Open
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-md border bg-card p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-medium text-accent">FlowDesk</p>
            <h2 className="mt-2 text-2xl font-semibold">Account erstellen</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Richte deinen Zugang für FlowDesk ein.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm">
                Name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  {...register("name")}
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className="form-input pl-10"
                  placeholder="Max Mustermann"
                />
              </div>
              {errors.name && (
                <p className="mt-1 error-text">{errors.name.message}</p>
              )}
            </div>

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
                  className="form-input h-11 pl-10"
                  placeholder="max@mustermann.de"
                />
              </div>
              {errors.email && (
                <p className="mt-1 error-text">{errors.email.message}</p>
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
                  autoComplete="new-password"
                  className="form-input px-10"
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
                <p className="mt-1 error-text">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              Registrieren
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Schon registriert?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground hover:underline"
            >
              Einloggen
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
export default RegisterPage;
