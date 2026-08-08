import type { AttentionRequiredCardItem } from "@/features/dashboard/types/AttentionRequiredCardItem";
import { formatDate } from "@/shared/utils/formatDate";

export const getAttentionContent = (
  item: Exclude<AttentionRequiredCardItem, null>,
) => {
  switch (item.type) {
    case "most_overdue":
      return {
        value: `${Math.abs(item.daysRemaining)} Tage überfällig`,
        secondary: formatDate(item.dueDate),
      };

    case "deadline_risk":
      return {
        value: `${item.daysRemaining} Tage verbleibend`,
        secondary: `${item.completionRate}% abgeschlossen`,
      };

    case "low_progress_risk":
      return {
        value: `${item.completionRate}% abgeschlossen`,
        secondary: `${item.openTaskCount} offene Aufgaben`,
      };
  }
};
