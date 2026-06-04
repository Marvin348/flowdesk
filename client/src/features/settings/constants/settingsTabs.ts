export const SETTING_TABS = [
  { label: "Account", value: "profile" },
  { label: "Sicherheit", value: "security" },
  { label: "Aussehen", value: "appearance" },
  { label: "Benachrichtigungen", value: "notification" },
] as const;

export type SettingTabs = (typeof SETTING_TABS)[number]["value"];

export const isSettingTab = (value: string | null): value is SettingTabs =>
  SETTING_TABS.some((tab) => tab.value === value);
