export const getWorkloadStatus = (
  percent: number,
): "critical" | "warning" | "good" => {
  if (percent === 0) return "critical";
  if (percent < 50) return "warning";
  return "good";
};
