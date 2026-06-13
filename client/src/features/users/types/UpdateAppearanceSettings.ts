import type {
  AppearanceTheme,
  AppearanceDensity,
  AppearanceStartView,
} from "@shared/types/user";

export type UpdateAppearanceSettingsInput = {
  theme?: AppearanceTheme;
  density?: AppearanceDensity;
  startView?: AppearanceStartView;
};
