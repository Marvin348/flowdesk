import { Search, FolderPen } from "lucide-react";
import { useState } from "react";
import { useProjectOptions } from "@/queries/projects/useProjectOptions";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import AssignProjectItem from "./AssignProjectItem";
import { useAssignUserToProjects } from "@/mutations/project/useAssignUserToProjects";
import { Spinner } from "@/components/ui/spinner";

type AssignProjectModal = {
  onClose: () => void;
  selectedUserId: string;
};

const AssignProjectModal = ({
  onClose,
  selectedUserId,
}: AssignProjectModal) => {
  const [input, setInput] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const debounceInput = useDebounce(input, 500);

  const { data, isLoading, error } = useProjectOptions(
    selectedUserId,
    debounceInput,
  );

  const { mutate, isPending, error: mutateError } = useAssignUserToProjects();

  const results = data?.results ?? [];
  const recent = data?.recent ?? [];

  const toggleSelectedProjectIds = (id: string) =>
    setSelectedProjectIds((prev) =>
      prev.includes(id)
        ? prev.filter((prevId) => prevId !== id)
        : [...prev, id],
    );

  const handleSubmit = () => {
    const input = {
      userId: selectedUserId,
      projectIdsToAdd: selectedProjectIds,
    };

    mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isSelected = (id: string) => selectedProjectIds.includes(id);
  const hasSearched = input.trim().length > 0;

  console.log("useProjectOptions", data);
  console.log("selectedProjectIds", selectedProjectIds);

  return (
    <div className="overlay flex items-center justify-center">
      <div className="min-w-[500px] overflow-hidden rounded-md bg-white">
        <div className="p-4 flex items-center gap-4 border-b pb-4">
          <div className="bg-surface/5 p-2 rounded-md">
            <FolderPen />
          </div>
          <div>
            <h3 className="font-medium text-xl">Projekt zuweisen</h3>
            <p className="text-muted-foreground text-sm">
              Wähle ein oder mehrere Projekte für <span>Anna Weber</span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className="w-full h-9 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/90 focus:border-transparent"
              placeholder="Suche..."
            />
            <Search className="absolute left-2 top-1/2 transform  -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>

        {/**result */}
        <div className="mt-6">
          <div className="px-4">
            {error && <p className="error-text">Fehler beim Laden</p>}
            {hasSearched && !results.length && (
              <p className="text-muted-foreground text-sm">
                <span className="font-medium">"{input}"</span> keine Projekt
                gefunden
              </p>
            )}
          </div>

          {results.length > 0 && (
            <div className="">
              <p className="pl-4 text-sm text-muted-foreground">Suche</p>
              {results.map((p) => (
                <AssignProjectItem
                  key={p.id}
                  item={p}
                  toggleSelectedProjectIds={toggleSelectedProjectIds}
                  isSelected={isSelected}
                />
              ))}
            </div>
          )}
        </div>

        {/**recent */}
        <div
          className={`mt-4 ${results.length > 0 || hasSearched ? "border-t pt-4" : ""}`}
        >
          <p className="pl-4 text-sm text-muted-foreground">letzte Projekte</p>
          <div className="">
            {recent.map((p) => (
              <AssignProjectItem
                key={p.id}
                item={p}
                toggleSelectedProjectIds={toggleSelectedProjectIds}
                isSelected={isSelected}
              />
            ))}
          </div>
        </div>

        {mutateError && (
          <p className="mt-4 pl-4 error-text">
            Es konnte kein Projekt hinzugefügt werden
          </p>
        )}

        {recent.length > 0 && (
          <div className="mt-6 pt-4 p-4 border-t grid grid-cols-2 justify-between gap-6">
            <Button
              variant="outline"
              className="hover:bg-surface/5"
              onClick={onClose}
            >
              Schließen
            </Button>
            <Button
              variant="outline"
              className="bg-accent border-none hover:bg-accent/95"
              onClick={handleSubmit}
            >
              {selectedProjectIds.length > 0 && (
                <span>{selectedProjectIds.length}</span>
              )}
              Hinzufügen {isPending && <Spinner />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default AssignProjectModal;
