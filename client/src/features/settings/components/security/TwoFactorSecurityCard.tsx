import { Button } from "@/shared/components/ui/button";
import { ShieldAlert, Smartphone } from "lucide-react";

const TwoFactorSecurityCard = () => {
  return (
    <div className="border-t bg-muted/20 p-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border">
            <Smartphone className="size-4" />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold">
              Zwei-Faktor-Authentifizierung
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Schütze deinen Account mit einem zusätzlichen
              Bestätigungsschritt beim Login.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Methode</p>
                <p className="mt-1 text-sm font-medium">Authenticator App</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <ShieldAlert className="size-4 text-amber-500" />
                  Nicht aktiviert
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="justify-self-end"
          variant="outline"
          size="sm"
          type="button"
        >
          Einrichten
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorSecurityCard;
