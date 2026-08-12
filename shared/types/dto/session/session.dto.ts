export type UserSessionDto = {
  sessionId: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  createdAt: string;
  isCurrent: boolean;
};