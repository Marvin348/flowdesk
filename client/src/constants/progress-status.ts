export const PROGRESS_STATUS = {
  critical: {
    label: "Überlastet",
    value: "critical",
    color: "#EF4444",
    bg: "#FEE2E2",
  },
  warning: {
    label: "Hohe Auslastung",
    value: "warning",
    color: "#FB923C",
    bg: "#FFEDD5",
  },
  good: {
    label: "Im Plan",
    value: "good",
    color: "#22C55E",
    bg: "#DCFCE7",
  },
} as const;
