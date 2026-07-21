import { CircleDashed, LoaderCircle, Circle } from "lucide-react";

export const STATUS_OPTIONS = {
  pending: {
    label: "Ausstehend",
    value: "pending",
    color: "#FDE68A",
    icon: CircleDashed,
  },
  in_progress: {
    label: "In Bearbeitung",
    value: "in_progress",
    color: "#B6D4FE",
    icon: LoaderCircle,
  },
  done: {
    label: "Erledigt",
    value: "done",
    color: "#86EFAC",
    icon: Circle,
  },
} as const;
