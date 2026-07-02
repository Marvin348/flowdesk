import ProfileSettingsForm from "@/features/settings/components/profile/ProfileSettingsForm";
import AvatarUploadCard from "@/features/settings/components/profile/AvatarUploadCard";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import ProfileSettingsSkeleton from "@/features/settings/components/sketeton/ProfileSettingsSkeleton";

const ProfileSettingsPage = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <ProfileSettingsSkeleton />;
  if (error) {
    return (
      <div className="text-center">Profil konnte nicht geladen werden.</div>
    );
  }
  if (!user) return null;

  console.log(user);

  return (
    <div>
      <div className="pb-4 border-b">
        <h3 className="text-lg font-semibold">Profil</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönlichen Informationen und deine Rolle im
          Workspace.
        </p>
      </div>

      <div className="mt-6">
        <AvatarUploadCard user={user} />
      </div>

      <div>
        <ProfileSettingsForm user={user} />
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
