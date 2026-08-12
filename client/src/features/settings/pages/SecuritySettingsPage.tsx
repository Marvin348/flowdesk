import PasswordSecurityCard from "@/features/settings/components/security/PasswordSecurityCard";
import TwoFactorSecurityCard from "@/features/settings/components/security/TwoFactorSecurityCard";
import { useGetMySecurityOverview } from "@/features/users/hooks/security/useGetMySecurityOverview";
import SessionsCard from "../components/security/SessionsCard";

const SecuritySettingsPage = () => {
  const {
    data: securityOverview,
    isLoading,
    isError,
  } = useGetMySecurityOverview();

  const passwordChangedAt = securityOverview?.passwordChangedAt ?? null;
  const twoFactorEnabled = securityOverview?.twoFactorEnabled ?? false;

  return (
    <div>
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Sicherheit</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönliche Sicherheit und Passwörter.
        </p>
      </div>

      {isError && (
        <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Sicherheitsdaten konnten nicht geladen werden.
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-md border bg-background">
        <PasswordSecurityCard
          passwordChangedAt={passwordChangedAt}
          isLoadingSecurityData={isLoading}
        />
        <TwoFactorSecurityCard isTwoFactorEnabled={twoFactorEnabled} />
      </section>

      <SessionsCard />
    </div>
  );
};
export default SecuritySettingsPage;
