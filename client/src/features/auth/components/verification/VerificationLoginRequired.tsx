import { Button } from "@/shared/components/ui/button";
import { ShieldAlert, LogIn } from "lucide-react";

type VerificationLoginRequiredProps = {
  onLogin: () => void;
  label: string;
};

const VerificationLoginRequired = ({ onLogin, label }: VerificationLoginRequiredProps) => {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold">Anmeldung erforderlich</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {label} Melde dich zuerst bei FlowDesk an und öffne anschließend den
        Link erneut.
      </p>
      <div className="mt-5 rounded-md border bg-muted/40 px-4 py-3 text-left text-xs leading-5 text-muted-foreground">
        Der Bestätigungslink bleibt erhalten, während du dich anmeldest.
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onLogin}>
        <LogIn className="size-4" />
        Bei FlowDesk anmelden
      </Button>
    </div>
  );
};
export default VerificationLoginRequired;
