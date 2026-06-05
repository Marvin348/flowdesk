import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useEffect } from "react";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { Button } from "@/shared/components/ui/button";
import ErrorMessage from "@/shared/components/ErrorMessage";
import {
  BriefcaseBusiness,
  Mail,
  ShieldCheck,
  Upload,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { FormInput } from "@/shared/components/ui/FormInput";
import { useUpdateUserProfile } from "@/features/users/hooks/useUpdateUserProfile";
import { Spinner } from "@/shared/components/ui/spinner";
import type { ProfileSettingsFields } from "@/features/settings/schemas/profileSettingsSchema";
import { profileSettingsSchema } from "@/features/settings/schemas/profileSettingsSchema";

const ProfileSettingsForm = () => {
  const { data: user, error } = useCurrentUser();
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
      avatarKey: "",
      name: "",
      email: "",
      jobTitle: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      avatarKey: user.avatarKey,
      name: user.name,
      email: user.email,
      jobTitle: user?.jobTitle,
    });
  }, []);

  const onSubmit = (data: ProfileSettingsFields) => {
    const payload: Partial<ProfileSettingsFields> = {};

    if (dirtyFields.name) {
      payload.name = data.name;
    }

    if (dirtyFields.email) {
      payload.email = data.email;
    }

    if (dirtyFields.avatarKey) {
      payload.avatarKey = data.avatarKey;
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
          avatarKey: updatedUser.avatarKey,
          name: updatedUser.name,
          email: updatedUser.email,
          jobTitle: updatedUser?.jobTitle,
        });
      },
    });
  };

  if (error) {
    return <ErrorMessage message="Profil konnte nicht geladen werden." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="pb-4 border-b">
        <h3 className="text-lg font-semibold">Profil</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönlichen Informationen und deine Rolle im
          Workspace.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-4 rounded-md border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar avatarKey={user?.avatarKey} size="lg" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "Profilbild"}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                JPG, PNG oder WebP. Maximal 2 MB.
              </p>
            </div>
          </div>

          <Button variant="secondary" size="sm" type="button">
            <Upload className="size-4" />
            Hochladen
          </Button>
        </div>

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
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              icon={<Mail className="size-4" />}
              {...register("email")}
            />
            {errors.email && (
              <ErrorMessage message={errors.email.message} className="mt-1" />
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <FormInput
              id="jobTitle"
              label="JobTitel"
              type="text"
              icon={<BriefcaseBusiness className="size-4" />}
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <ErrorMessage
                message={errors.jobTitle.message}
                className="mt-1"
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="mb-1.5 block text-sm">Rolle</p>

            <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
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

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={!isDirty || isPending}
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
