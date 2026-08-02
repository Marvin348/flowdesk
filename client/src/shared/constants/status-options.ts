import {
  CircleDashed,
  LoaderCircle,
  Circle,
  type LucideIcon,
} from "lucide-react";
import type { StatusBase } from "@shared/types/StatusBase";

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
} as const satisfies Record<
  StatusBase,
  {
    label: string;
    value: StatusBase;
    color: string;
    icon: LucideIcon;
  }
>;

export type StatusOption = (typeof STATUS_OPTIONS)[StatusBase];
