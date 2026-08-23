import { Button } from "@/shared/components/ui/button";
import { QUICK_FILTERS } from "@/features/notification/constants/notificationQuickFilters";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";
import { RotateCcw } from "lucide-react";

const NotificationQuickFilter = () => {
  const {
    filterType,
    actions: { setFilterType, clearFilterType },
  } = useNotificationSearchParams();
  return (
    <section className="rounded-md border border-border bg-card p-3 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-sm font-medium text-foreground">Quick Filter</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Benachrichtigungstyp
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={clearFilterType}>
          <RotateCcw className="size-4" />
        </Button>
      </div>

      <div className="grid gap-2">
        {QUICK_FILTERS.map((filter) => {
          const Icon = filter.icon;

          return (
            <Button
              key={filter.value}
              variant="mailbox"
              size="sm"
              className="flex justify-start gap-2"
              data-state={filterType === filter.value ? "active" : "inactive"}
              onClick={() => setFilterType(filter.value)}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">{filter.label}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
};
export default NotificationQuickFilter;
