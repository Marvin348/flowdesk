import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
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
} from "lucide-react";
import { FormInput } from "@/shared/components/ui/FormInput";

const profileSettingsSchema = z.object({
  avatarKey: z.string(), // ??
  name: z.string().min(3, "Name eingeben"),
  email: z.string().min(8, "Mindestens 8 Zeichen"),
  jobTitle: z.string().min(5, "Job Titel eingeben"), // ??
  role: z.string(), // ??
});

type ProfileSettingsFields = z.infer<typeof profileSettingsSchema>;

const ProfileSettingsForm = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSettingsFields>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      avatarKey: "",
      name: "",
      email: "",
      jobTitle: "",
      role: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      avatarKey: user.avatarKey,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      role: user.role,
    });
  }, []);

  const onSubmit = (data: ProfileSettingsFields) => {};

  if (error) {
    return <ErrorMessage message="Profil konnte nicht geladen werden." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Profil</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönlichen Informationen und deine Rolle im
          Workspace.
        </p>
      </div>

      <div className="p-4">
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
          </div>

          <div>
            <FormInput
              label="Rolle"
              id="role"
              type="text"
              icon={<ShieldCheck className="size-4" />}
              {...register("role")}
            />
            {errors.role && (
              <ErrorMessage message={errors.role.message} className="mt-1" />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4">
        <Button variant="outline" type="button">
          Abbrechen
        </Button>
        <Button type="submit" disabled={true}>
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
};
export default ProfileSettingsForm;
