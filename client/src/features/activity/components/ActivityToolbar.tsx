import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const ActivityToolbar = () => {
  return (
    <div
      aria-label="Aktivitäten filtern"
      className="flex items-center justify-end "
    >
      <Select defaultValue="all-time">
        <SelectTrigger size="sm" aria-label="Zeitraum auswählen">
          <SelectValue />
        </SelectTrigger>

        <SelectContent align="end">
          <SelectItem value="all-time">Zeitraum</SelectItem>
          <SelectItem value="today">Heute</SelectItem>
          <SelectItem value="last-7-days">Letzte 7 Tage</SelectItem>
          <SelectItem value="last-30-days">Letzte 30 Tage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityToolbar;
