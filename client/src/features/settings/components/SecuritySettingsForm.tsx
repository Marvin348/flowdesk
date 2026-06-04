import { FormInput } from "@/shared/components/ui/FormInput";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import z from "zod";

const secruritySchema = z.object({
  password: z.string().min(8, "Mindestens 8 Zeichen"),
});

type SecrurityFields = z.infer<typeof secruritySchema>;

const SecuritySettingsForm = () => {
  return (
    <form>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Sicherheit</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwalte deine persönliche Sicherheit und Passwörter
        </p>
      </div>

      <div className="p-4 mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <FormInput
            id="current-password"
            label="Aktives Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<LockKeyhole className="size-4" />}
          />
        </div>

        <div>
          <FormInput
            id="new-password"
            label="Neues Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<LockKeyhole className="size-4" />}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <Button variant="outline" type="button">
          Abbrechen
        </Button>
        <Button type="submit" disabled={true}>
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
};
export default SecuritySettingsForm;
