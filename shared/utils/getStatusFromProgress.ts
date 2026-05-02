import type { TeamProgress } from "@shared/types/teamFilter/teamFilter";

export const getStatusFromProgress = (percent: number): TeamProgress => {
  if (percent < 25) return "critical";
  if (percent < 75) return "warning";
  return "good";
};
