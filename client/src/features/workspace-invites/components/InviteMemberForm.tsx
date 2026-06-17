import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/ui/FormInput";
import { inviteMemberSchema } from "@/features/workspace-invites/schemas/inviteMemberSchema";
import type { InviteMemberFields } from "@/features/workspace-invites/schemas/inviteMemberSchema";

type InviteMemberFormProps = {
  onInviteMember: (data: InviteMemberFields) => void;
  isInviting: boolean;
  isError?: boolean;
};

const InviteMemberForm = ({
  onInviteMember,
  isInviting,
  isError,
}: InviteMemberFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<InviteMemberFields>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: InviteMemberFields) => {
    onInviteMember(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold">Mitglied einladen</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Lade neue Mitglieder per Email in deinen Workspace ein.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:flex flex-end sm:items-end sm:justify-between gap-4">
        <FormInput
          id="invite-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          icon={<Mail className="size-4" />}
          {...register("email")}
        />
        {errors.email && (
          <ErrorMessage message={errors.email.message} className="mt-1" />
        )}

        <div>
        <Button className="mt-4 sm:mt-0 w-full sm:w-fit" type="submit" disabled={isInviting || !isDirty || !isValid}>
          Einladen
        </Button>
      </div>
      </div>

      {isError && (
        <ErrorMessage
          message="Etwas ist schief gelaufen. Bitte versuche es erneut"
          className="mt-4"
        />
      )}
    </form>
  );
};

export default InviteMemberForm;
