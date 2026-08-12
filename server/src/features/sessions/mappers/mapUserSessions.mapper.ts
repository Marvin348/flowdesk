import type { UserSessionDto } from "@shared/types/dto/session/session.dto";
import type { SessionData } from "@/features/sessions/types/session.types";
import { UAParser } from "ua-parser-js";

export type SessionWithId = {
  sessionId: string;
  session: SessionData;
};

export const toUserSessionsDto = (
  item: SessionWithId,
  currentSessionId: string,
): UserSessionDto => {
  const parsed = UAParser(item.session.userAgent);

  const deviceType =
    parsed.device.type === "mobile"
      ? "mobile"
      : parsed.device.type === "tablet"
        ? "tablet"
        : "desktop";

  return {
    sessionId: item.sessionId,
    browser: parsed.browser.name ?? "unknown",
    os: parsed.os.name ?? "unknown",
    deviceType,
    createdAt: item.session.createdAt,
    isCurrent: item.sessionId === currentSessionId,
  };
};
