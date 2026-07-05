import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import ProfileSettingsSkeleton from "@/features/settings/components/sketeton/ProfileSettingsSkeleton";
import ProfileOverview from "@/features/settings/components/profile/ProfileOverview";

const ProfileSettingsPage = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <ProfileSettingsSkeleton />;
  if (error) {
    return (
      <div className="text-center">Profil konnte nicht geladen werden.</div>
    );
  }
  if (!user) return null;

  return (
    <div>
      <section className="pb-4 border-b">
        <h3 className="text-lg font-semibold">Profil</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönlichen Informationen und deine Rolle im
          Workspace.
        </p>
      </section>

      <div>
        <ProfileOverview currentUser={user} />
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
