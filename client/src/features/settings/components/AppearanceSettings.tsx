import { Check, LayoutDashboard, Palette, Rows3 } from "lucide-react";
import {
  THEME_SETTINGS,
  DENSITY_SETTINGS,
  START_VIEW_SETTINGS,
} from "@/features/settings/constants/appearanceSettings";
import { useUpdateAppearanceSettings } from "@/features/users/hooks/useUpdateAppearanceSettings";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { AppearanceSettingsType } from "@shared/types/user";
import ErrorMessage from "@/shared/components/ErrorMessage";

const AppearanceSettings = () => {
  const { mutate, isPending, error} = useUpdateAppearanceSettings();
  const { data: user } = useCurrentUser();

  if (!user) return null;

  const appearanceSettings = user.appearanceSettings;

  const handleAppearanceChange = <K extends keyof AppearanceSettingsType>(
    key: K,
    value: AppearanceSettingsType[K],
  ) => {
    if (appearanceSettings[key] === value) return;

    mutate({
      [key]: value,
    });
  };

  return (
    <section>
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold">Darstellung</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Passe an, wie FlowDesk auf deinem Gerät aussieht.
        </p>
      </div>

      <div className="space-y-8 p-4">
        <div className="rounded-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Theme</h4>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Wähle zwischen heller und dunkler Oberfläche.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEME_SETTINGS.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={`flex items-center justify-between rounded-md bg-card border p-3 text-left shadow-xs ${appearanceSettings.theme === value && "border-accent/60"}`}
                onClick={() => handleAppearanceChange("theme", value)}
                disabled={appearanceSettings.theme === value || isPending}
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Icon
                      className={`size-4 ${appearanceSettings.theme === value ? "text-accent" : "text-muted-foreground"}`}
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Rows3 className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Dichte</h4>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Steuert, wie kompakt Tabellen und Listen wirken.
            </p>

            <div className="mt-4 grid grid-cols-2 rounded-md border bg-muted/35 p-1">
              {DENSITY_SETTINGS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm ${
                    appearanceSettings.density === value
                      ? "bg-card font-medium shadow-xs"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleAppearanceChange("density", value)}
                  disabled={appearanceSettings.density === value || isPending}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Startansicht</h4>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Die Ansicht, die nach dem Login zuerst geöffnet wird.
            </p>

            <div className="mt-4 rounded-md border bg-muted/35 p-1">
              {START_VIEW_SETTINGS.map(({ label, value }) => (
                <button
                  type="button"
                  key={value}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                    appearanceSettings.startView === value
                      ? "bg-card font-medium shadow-xs"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleAppearanceChange("startView", value)}
                  disabled={appearanceSettings.startView === value || isPending}
                >
                  {label}
                  {appearanceSettings.startView === value && (
                    <Check className="size-4 text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error && (
          <ErrorMessage message="Die Einstellung konnte nicht gespeichert werden. Bitte versuche es erneut." />
        )}
      </div>
    </section>
  );
};
export default AppearanceSettings;
