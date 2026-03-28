import { ClockFading, CircleDot, Pause } from "lucide-react";

export const STATUS_OPTIONS = {
  pending: {
    label: "Ausstehend",
    value: "pending",
    color: "#FDE68A",
    icon: Pause,
  },
  in_progress: {
    label: "In Bearbeitung",
    value: "in_progress",
    color: "#B6D4FE",
    icon: ClockFading,
  },
  done: {
    label: "Erledigt",
    value: "done",
    color: "#86EFAC",
    icon: CircleDot,
  },
} as const;
