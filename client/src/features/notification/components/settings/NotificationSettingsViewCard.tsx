import { Settings2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { NOTIFICATION_SETTINGS_UI } from "@/features/notification/constants/notificationSettings";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";

const NotificationSettingsViewCard = () => {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  const userNotificationSettings = user.settings.notifications;

  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Benachrichtigungen
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Aktuelle Benachrichtigungs Einstellungen
          </p>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings/notification">
            <Settings2 className="size-5" />
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {NOTIFICATION_SETTINGS_UI.map(({ label, value }) => (
          <div
            key={value}
            className="flex items-center justify-between rounded-md border border-border  px-3 py-2"
          >
            <span className="text-sm text-foreground">{label}</span>

            <div className="text-xs bg-card rounded-md font-medium">
              {userNotificationSettings[value] ? (
                <span>On</span>
              ) : (
                <span>Off</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default NotificationSettingsViewCard;
