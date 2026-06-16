import { CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const inviteLink = "http://localhost:5173/invite/abc123...";

const InviteLinkResult = () => {
  return (
    <div className="rounded-md border bg-muted/35 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 items-center justify-center rounded-md border bg-card">
          <CheckCircle2 className="size-5 text-chart-2" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold">Einladungslink erstellt</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Dieser Link ist 7 Tage gültig.
          </p>

          <div className="mt-4 rounded-md border bg-card px-3 py-2">
            <p className="truncate text-sm text-foreground">{inviteLink}</p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="button" variant="secondary" size="sm">
              <Copy className="size-4" />
              Link kopieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteLinkResult;
