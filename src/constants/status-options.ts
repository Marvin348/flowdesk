export const STATUS_OPTIONS = {
  pending: { label: "Ausstehend", value: "pending", color: "#FFD580" },
  in_progress: {
    label: "In Bearbeitung",
    value: "in_progress",
    color: "#ADD8E6",
  },
  done: { label: "Erledigt", value: "done", color: "#90EE90" },
} as const;
