import { FormInput } from "@/shared/components/ui/FormInput";
import { LockKeyhole, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/features/auth/schemas/securitySchema";
import type { PasswordFields } from "@/features/auth/schemas/securitySchema";
import { useUpdatePassword } from "@/features/auth/hooks/useUpdatePassword";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorMessage from "@/shared/components/ErrorMessage";

const SecuritySettingsForm = () => {
  const { mutate, isPending, error, isSuccess } = useUpdatePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordFields) => {
    mutate(data, {
      onSuccess: () => {
        reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="pb-4 border-b">
        <h3 className="text-lg font-semibold">Sicherheit</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönliche Sicherheit und Passwörter
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <FormInput
            id="current-password"
            label="Aktives Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<LockKeyhole className="size-4" />}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <ErrorMessage
              message={errors.currentPassword.message}
              className="mt-1"
            />
          )}
        </div>

        <div>
          <FormInput
            id="new-password"
            label="Neues Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<LockKeyhole className="size-4" />}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <ErrorMessage
              message={errors.newPassword.message}
              className="mt-1"
            />
          )}
        </div>

        <div className="md:col-start-2">
          <FormInput
            id="confirmPassword"
            label="Neues Password bestätigen"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<LockKeyhole className="size-4" />}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <ErrorMessage
              message={errors.confirmPassword.message}
              className="mt-1"
            />
          )}
        </div>
      </div>

      {error && (
        <ErrorMessage
          message="Aktuelles Passwort ist falsch"
          className="mt-4 px-4 text-right"
        />
      )}

      {isSuccess && (
        <div className="mt-6 flex items-center gap-2 border bg-muted rounded-md px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>Dein Passwort wurde erfolgreich geändert.</span>
        </div>
      )}

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={!isDirty || isPending}
          onClick={() => {
            reset({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={!isDirty || !isValid || isPending}>
          {isPending ? <Spinner /> : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
};
export default SecuritySettingsForm;
