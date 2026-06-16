import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/ui/FormInput";

const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email eingeben")
    .email("Gültige Email eingeben"),
});

type InviteMemberFields = z.infer<typeof inviteMemberSchema>;

const InviteMemberForm = () => {
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
    mode: "onChange",
  });

  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
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

      <div className="mt-6">
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
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={!isDirty || !isValid}>
          Einladung senden
        </Button>
      </div>
    </form>
  );
};

export default InviteMemberForm;
