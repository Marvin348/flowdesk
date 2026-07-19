import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/features/auth/schemas/securitySchema";
import type { PasswordFields } from "@/features/auth/schemas/securitySchema";
import { useRequestUpdatePassword } from "@/features/auth/hooks/useRequestUpdatePassword";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { PasswordInput } from "@/shared/components/ui/PasswordInput";
import { getApiErrorMessage } from "@/shared/api/getApiError";

const ChangePasswordForm = ({ onClose }: { onClose: () => void }) => {
  const { mutate, isPending, error, isSuccess } = useRequestUpdatePassword();

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

  const onCancel = () => {
    reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    onClose();
  };

  const errorMessage = getApiErrorMessage(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <PasswordInput
            id="current-password"
            label="Aktives Password"
            autoComplete="current-password"
            placeholder="••••••••"
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
          <PasswordInput
            id="new-password"
            label="Neues Password"
            autoComplete="new-password"
            placeholder="••••••••"
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
          <PasswordInput
            id="confirmPassword"
            label="Neues Password bestätigen"
            autoComplete="new-password"
            placeholder="••••••••"
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

      {errorMessage && (
        <ErrorMessage message={errorMessage} className="mt-4 px-4 text-right" />
      )}

      {isSuccess && (
        <div className="mt-6 flex items-center gap-2 border bg-muted rounded-md px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>
            Wir haben dir eine E-Mail zur Bestätigung deiner Passwortänderung
            gesendet.
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          onClick={onCancel}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || !isValid || isPending}
          className="w-42"
        >
          {isPending ? <Spinner /> : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
};
export default ChangePasswordForm;
