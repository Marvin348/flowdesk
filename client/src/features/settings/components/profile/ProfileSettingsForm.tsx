import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { BriefcaseBusiness, UserRound, CheckCircle2 } from "lucide-react";
import { FormInput } from "@/shared/components/ui/FormInput";
import { useUpdateUserProfile } from "@/features/users/hooks/profile/useUpdateUserProfile";
import { Spinner } from "@/shared/components/ui/spinner";
import type { ProfileSettingsFields } from "@/features/settings/schemas/profileSettingsSchema";
import { profileSettingsSchema } from "@/features/settings/schemas/profileSettingsSchema";
import type { AuthUser } from "@shared/types/user";

type ProfileSettingsFormInput = {
  user: AuthUser;
  onClose: () => void;
};

const ProfileSettingsForm = ({ user, onClose }: ProfileSettingsFormInput) => {
  const {
    mutate,
    isPending,
    error: updateError,
    isSuccess,
  } = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<ProfileSettingsFields>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      jobTitle: user?.jobTitle ?? "",
    });
  }, [user, reset]);

  const onSubmit = (data: ProfileSettingsFields) => {
    const payload: Partial<ProfileSettingsFields> = {};

    if (dirtyFields.name) {
      payload.name = data.name;
    }

    if (dirtyFields.jobTitle) {
      payload.jobTitle = data.jobTitle;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    mutate(payload, {
      onSuccess: (updatedUser) => {
        reset({
          name: updatedUser.name,
          jobTitle: updatedUser?.jobTitle,
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <FormInput
            id="name"
            label="Name"
            type="text"
            autoComplete="name"
            icon={<UserRound className="size-4" />}
            {...register("name")}
          />
          {errors.name && (
            <ErrorMessage message={errors.name.message} className="mt-1" />
          )}
        </div>

        <div>
          <FormInput
            id="jobtitle"
            label="Jobtitel"
            type="text"
            icon={<BriefcaseBusiness className="size-4" />}
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <ErrorMessage message={errors.jobTitle.message} className="mt-1" />
          )}
        </div>
      </div>

      {updateError && (
        <ErrorMessage
          message="Es gibt keine neuen Änderungen zum Speichern"
          className="mx-2"
        />
      )}

      {isSuccess && (
        <div className="mt-6 flex items-center gap-2 border bg-muted rounded-md px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>Dein Profil wurde erfolgreich geändert.</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          onClick={onClose}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? <Spinner /> : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
};
export default ProfileSettingsForm;
