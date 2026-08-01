import { Switch } from "@/shared/components/ui/switch";
import { NOTIFICATION_SETTINGS_UI } from "@/features/notification/constants/notificationSettings";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateNotificationSettings } from "@/features/users/hooks/profile/useUpdateNotificationSettings";
import ErrorMessage from "@/shared/components/ErrorMessage";

const NotificationSettingsCard = () => {
  const { data: user } = useCurrentUser();
  const { mutate, isError } = useUpdateNotificationSettings();

  if (!user) return null;

  const userSettings = user.settings;

  return (
    <section className="mt-6 overflow-hidden rounded-md border bg-background">
      {NOTIFICATION_SETTINGS_UI.map(
        ({ label, value, description, icon: Icon }) => (
          <div
            key={value}
            className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center
              "
          >
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-semibold">{label}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <Switch
              checked={userSettings.notifications[value]}
              onCheckedChange={(checked) =>
                mutate({
                  [value]: checked,
                })
              }
              aria-label={`${label} aktivieren`}
            />
          </div>
        ),
      )}

      {isError && (
        <ErrorMessage
          message="Update konnte nicht ausgeführt werden."
          className="p-4 text-right"
        />
      )}
    </section>
  );
};
export default NotificationSettingsCard;
