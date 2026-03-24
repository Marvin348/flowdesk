import { ClockFading, CircleDot, Pause } from "lucide-react";

export const STATUS_OPTIONS = {
  pending: {
    label: "Ausstehend",
    value: "pending",
    color: "#FFD580",
    icon: Pause,
  },
  in_progress: {
    label: "In Bearbeitung",
    value: "in_progress",
    color: "#ADD8E6",
    icon: ClockFading,
  },
  done: {
    label: "Erledigt",
    value: "done",
    color: "#90EE90",
    icon: CircleDot,
  },
} as const;
