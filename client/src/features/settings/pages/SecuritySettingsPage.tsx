import PasswordSecurityCard from "@/features/settings/components/security/PasswordSecurityCard";
import TwoFactorSecurityCard from "@/features/settings/components/security/TwoFactorSecurityCard";

const SecuritySettingsPage = () => {
  return (
    <div>
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Sicherheit</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönliche Sicherheit und Passwörter.
        </p>
      </div>

      <section className="mt-6 overflow-hidden rounded-md border bg-background">
        <PasswordSecurityCard />
        <TwoFactorSecurityCard />
      </section>
    </div>
  );
};
export default SecuritySettingsPage;
