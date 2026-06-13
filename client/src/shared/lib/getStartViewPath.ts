import type { AppearanceStartView } from "@shared/types/user";

export const getStartViewPath = (startView: AppearanceStartView) =>
  `/${startView}`;
