export const WORKLOAD_STATUS = {
  critical: {
    label: "Überlastet",
    color: "#EF4444",
    bg: "#FEE2E2",
  },
  warning: {
    label: "Hohe Auslastung",
    color: "#FB923C",
    bg: "#FFEDD5",
  },
  good: {
    label: "Im Plan",
    color: "#22C55E",
    bg: "#DCFCE7",
  },
} as const;
