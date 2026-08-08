import type { AttentionRequiredConfig } from "@/features/dashboard/constants/AttentionRequiredConfig";

type AttentionRequiredEmptyCardProps = {
  config: AttentionRequiredConfig;
};

const EMPTY_COPY: Record<
  AttentionRequiredConfig["label"],
  { title: string; description: string }
> = {
  "Überfälliges Projekt": {
    title: "Kein überfälliges Projekt",
    description: "Alle Projekt-Deadlines sind im grünen Bereich.",
  },
  "Deadline-Risiko": {
    title: "Kein Deadline-Risiko",
    description: "Aktuelle Projekte liegen ausreichend im Zeitplan.",
  },
  "Niedriger Fortschritt": {
    title: "Kein Fortschrittsrisiko",
    description: "Der Projektfortschritt wirkt aktuell stabil.",
  },
};

const AttentionRequiredEmptyCard = ({
  config,
}: AttentionRequiredEmptyCardProps) => {
  const copy = EMPTY_COPY[config.label];

  return (
    <div className="grid h-30 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-md border border-dashed bg-background/60 p-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
          {config.label}
        </p>
        <p className="mt-1 font-medium text-muted-foreground">{copy.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {copy.description}
        </p>
      </div>
    </div>
  );
};
export default AttentionRequiredEmptyCard;
