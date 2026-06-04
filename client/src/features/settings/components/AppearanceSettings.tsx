import { Check, LayoutDashboard, Moon, Palette, Rows3, Sun } from "lucide-react";

const AppearanceSettings = () => {
  return (
    <section>
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold">Darstellung</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Passe an, wie FlowDesk auf deinem Gerät aussieht.
        </p>
      </div>

      <div className="space-y-8 p-4">
        <div className="rounded-md border bg-muted/35 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Theme</h4>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Wähle zwischen heller und dunkler Oberfläche.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed="true"
              className="flex items-center justify-between rounded-md border border-accent/60 bg-card p-3 text-left shadow-xs"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Sun className="size-4 text-accent" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Hell</span>
                  <span className="text-xs text-muted-foreground">
                    Aktuell aktiv
                  </span>
                </span>
              </span>
              <Check className="size-4 text-accent" />
            </button>

            <button
              type="button"
              aria-pressed="false"
              className="flex items-center justify-between rounded-md border bg-card p-3 text-left shadow-xs duration-200 hover:bg-muted/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Moon className="size-4 text-muted-foreground" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Dunkel</span>
                  <span className="text-xs text-muted-foreground">
                    Vorschau
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Rows3 className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Dichte</h4>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Steuert, wie kompakt Tabellen und Listen wirken.
            </p>

            <div className="mt-4 grid grid-cols-2 rounded-md border bg-muted/35 p-1">
              <button
                type="button"
                className="rounded-md bg-card px-3 py-2 text-sm font-medium shadow-xs"
              >
                Standard
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground"
              >
                Kompakt
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Startansicht</h4>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Die Ansicht, die nach dem Login zuerst geöffnet wird.
            </p>

            <div className="mt-4 rounded-md border bg-muted/35 p-1">
              {["Dashboard", "Projekte", "Team"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                    item === "Dashboard"
                      ? "bg-card font-medium shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  {item}
                  {item === "Dashboard" && <Check className="size-4 text-accent" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AppearanceSettings;
