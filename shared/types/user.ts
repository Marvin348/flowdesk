export type UserRole = "admin" | "member" | "manager";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarKey: string;
  role: UserRole;
  jobTitle?: string;
};

export type AuthUser = User & {
  appearanceSettings: AppearanceSettingsType;
};

export type AppearanceSettingsType = {
  theme: AppearanceTheme;
  density: AppearanceDensity;
  startView: AppearanceStartView;
};

export const APPEARANCE_THEMES = ["light", "dark", "system"] as const;
export const APPEARANCE_DENSITIES = ["default", "compact"] as const;
export const APPEARANCE_START_VIEWS = [
  "dashboard",
  "projects",
  "team",
] as const;

export type AppearanceTheme = (typeof APPEARANCE_THEMES)[number];
export type AppearanceDensity = (typeof APPEARANCE_DENSITIES)[number];
export type AppearanceStartView = (typeof APPEARANCE_START_VIEWS)[number];
