import type { StatCardItem } from "@/features/dashboard/mappers/mapDashboardStatCards";

export const CARD_META: Record<
  StatCardItem["id"],
  {
    eyebrow: string;
    valueClassName: string;
    cardClassName: string;
  }
> = {
  activeProjects: {
    eyebrow: "Laufende Arbeit",
    valueClassName: "text-foreground",
    cardClassName: "bg-background",
  },
  openTasks: {
    eyebrow: "Offener Bestand",
    valueClassName: "text-foreground",
    cardClassName: "bg-background",
  },
  overdueTasks: {
    eyebrow: "Braucht Aufmerksamkeit",
    valueClassName: "text-foreground",
    cardClassName: "bg-background",
  },
  tasksDueThisWeek: {
    eyebrow: "Fokus heute",
    valueClassName: "text-foreground",
    cardClassName: "border-foreground/15 bg-muted/30",
  },
};
