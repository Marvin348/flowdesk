import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useNavigate } from "react-router";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorMessage from "@/shared/components/ErrorMessage";
import type { RegisterFields } from "@/features/auth/schemas/registerSchema";
import { registerSchema } from "@/features/auth/schemas/registerSchema";
import { FormInput } from "@/shared/components/ui/FormInput";
import { PasswordInput } from "@/shared/components/ui/PasswordInput";

const RegisterPage = () => {
  const navigate = useNavigate();

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

  const { mutate, isPending, error } = useRegister();

  const onSubmit = (data: RegisterFields) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
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
              <FormInput
                id="name"
                label="Name"
                type="text"
                autoComplete="name"
                placeholder="Max Mustermann"
                icon={<UserRound className="size-4" />}
                {...register("name")}
              />

              {errors.name && (
                <ErrorMessage message={errors.name.message} className="mt-1" />
              )}
            </div>

            <div>
              <FormInput
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="max@mustermann.de"
                icon={<Mail className="size-4" />}
                {...register("email")}
              />

              {errors.email && (
                <ErrorMessage message={errors.email.message} className="mt-1" />
              )}
            </div>

            <div>
              <PasswordInput
                id="password"
                label="Passwort"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("password")}
              />

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
              {isPending ? (
                <Spinner />
              ) : (
                <span className="flex items-center gap-2">
                  Registrieren <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
            {error && (
              <ErrorMessage message="Diese E-Mail ist bereits registriert" />
            )}
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
