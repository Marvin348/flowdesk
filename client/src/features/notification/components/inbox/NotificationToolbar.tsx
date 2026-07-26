import { Check } from "lucide-react";
import { NOTIFICATION_OPTIONS } from "@/features/notification/constants/notificationToolbar";
import { Button } from "@/shared/components/ui/button";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";

const NotificationToolbar = () => {
  const { status, actions } = useNotificationSearchParams();
  return (
    <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex gap-2 rounded-md border border-border bg-card p-1 shadow-xs">
        {NOTIFICATION_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant="segmented"
            size="sm"
            onClick={() => actions.setNotificationStatus(opt.value)}
            data-state={status === opt.value ? "active" : "inactive"}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <Button variant="accentOutline">
        <Check className="size-4" />
        Alles gelesen
      </Button>
    </section>
  );
};
export default NotificationToolbar;
