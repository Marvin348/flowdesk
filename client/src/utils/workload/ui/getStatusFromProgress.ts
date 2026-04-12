export const getStatusFromProgress = (
  percent: number,
): "critical" | "warning" | "good" => {
  if (percent < 25) return "critical";
  if (percent < 75) return "warning";
  return "good";
};
