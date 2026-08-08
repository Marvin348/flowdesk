import {
  AlertCircle,
  CalendarClock,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

// export type AttentionRequiredConfig = {
//   most_overdue: {
//     label: string;
//     icon: LucideIcon;
//   };
//   deadline_risk: {
//     label: string;
//     icon: LucideIcon;
//   };
//   low_progress_risk: {
//     label: string;
//     icon: LucideIcon;
//   };
// };

export type AttentionRequiredConfig =
  (typeof ATTENTION_REQUIRED_CONFIG)[keyof typeof ATTENTION_REQUIRED_CONFIG];

export const ATTENTION_REQUIRED_CONFIG = {
  most_overdue: { label: "Überfälliges Projekt", icon: AlertCircle },
  deadline_risk: { label: "Deadline-Risiko", icon: CalendarClock },
  low_progress_risk: {
    label: "Niedriger Fortschritt",
    icon: ChartNoAxesColumnIncreasing,
  },
};
