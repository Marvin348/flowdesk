import SelectedStatus from "@/components/projects/query-controls/select/SelectedStatus";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, Tags } from "lucide-react";

const AddTaskForm = () => {
  return (
    <form>
      <div className="pb-4 border-b">
        <input
          type="text"
          placeholder="Titel eingeben"
          className="w-full text-xl font-medium border-none outline-none focus:outline-none focus:ring-0"
        />
      </div>

      <div className="mt-6 p-2 border rounded-md">
        <label className="text-surface/90 text-sm">
          Mitarbeiter hinzufügen
        </label>
        <div className="mt-1">
          <input
            type="text"
            placeholder="Suche"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2 text-surface/90">
          <CalendarClock className="size-4" /> Datum
        </label>
        <input
          type="date"
          placeholder="Wähle ein Datum"
          className="border rounded-md p-2 text-surface/80"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2 text-surface/90">
          <Clock className="size-4" /> Status
        </label>
        <SelectedStatus />
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2 text-surface/90">
          <Tags className="size-4" /> Tags
        </label>
        <input
          type="text"
          placeholder="Tags wählen"
          className="text-surface/80 border rounded-md p-2"
        />
      </div>

      <div className="mt-4 border-t pt-4">
        <label className="mb-1 block text-sm text-surface/90">
          Beschreibung hinzufügen
        </label>
        <textarea className="w-full h-20 p-2 resize-none rounded-md bg-surface/5" />
      </div>

      <div className="mt-4 border-t pt-4 flex items-center justify-end gap-6">
        <Button size="sm" variant="outline" type="button">
          Schließen
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/95 w-30"
          type="submit"
        >
          Sichern
        </Button>
      </div>
    </form>
  );
};
export default AddTaskForm;
