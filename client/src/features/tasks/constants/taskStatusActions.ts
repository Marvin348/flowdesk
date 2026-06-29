export const TASK_STATUS_ACTIONS = {
  pending: {
    label: "Starten",
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "Erledigen",
    nextStatus: "done",
  },
  done: {
    label: "Wieder öffnen",
    nextStatus: "pending",
  },
} as const;
