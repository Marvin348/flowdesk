import { FormInput } from "@/shared/components/ui/FormInput";
import { useForm } from "react-hook-form";
import { Mail, CheckCircle2 } from "lucide-react";
import {
  changeEmailSettingsSchema,
  type ChangeEmailSettingsFields,
} from "@/features/settings/schemas/profileSettingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useChangeEmail } from "@/features/users/hooks/useChangeEmail";
import { Spinner } from "@/shared/components/ui/spinner";
import { useState } from "react";

type ChangeEmailFormInput = {
  onClose: () => void;
};

const ChangeEmailForm = ({ onClose }: ChangeEmailFormInput) => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutate, isPending, isError, isSuccess } = useChangeEmail();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm<ChangeEmailSettingsFields>({
    resolver: zodResolver(changeEmailSettingsSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = (data: ChangeEmailSettingsFields) => {
    mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-1 items-end gap-3">
        <FormInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          icon={<Mail className="size-4" />}
          {...register("email")}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            disabled={!email?.trim() || !isValid || isPending}
            className="w-35"
          >
            {isPending && <Spinner className="size-4" />} Jetzt verifizieren
          </Button>
        </div>
      </div>

      {isSuccess && (
        <div className="mt-6 flex items-center gap-2 border bg-muted rounded-md px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>
            Bestätigungs-E-Mail wurde an{" "}
            <span className="font-medium">{submittedEmail}</span> verschickt.
          </span>
        </div>
      )}

      {isError && (
        <ErrorMessage
          message="Email konnte nicht gesendet werden."
          className="mt-2 text-end"
        />
      )}

      {errors.email && touchedFields.email && (
        <ErrorMessage message={errors.email.message} className="mt-1" />
      )}
    </form>
  );
};
export default ChangeEmailForm;
