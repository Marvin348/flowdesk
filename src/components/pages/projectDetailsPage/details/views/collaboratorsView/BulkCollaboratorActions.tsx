import { BULK_COLLABORATOR_ACTIONS } from "@/constants/user/user-actions";
import { X } from "lucide-react";

type BulkCollaboratorActionsProps = {
  collaboratorCount: number;
  onCreateTask: () => void;
  onClearSelection: () => void;
};

const BulkCollaboratorActions = ({
  collaboratorCount,
  onCreateTask,
  onClearSelection,
}: BulkCollaboratorActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <p>{collaboratorCount} Mitarbeiter ausgewählt</p>

      <div className="flex gap-2">
        {BULK_COLLABORATOR_ACTIONS.map(({ key, label, icon: Icon }) => (
          <button
            className="border flex items-center gap-1.5 p-1 text-sm rounded-md hover:bg-surface/3"
            key={key}
            onClick={onCreateTask}
          >
            <Icon className="shrink-0 size-4" /> {label}
          </button>
        ))}
        <button
          className="border flex items-center gap-1 p-2 text-sm rounded-md hover:bg-surface/3"
          onClick={onClearSelection}
        >
          <X className="size-4" /> Auswahl aufheben
        </button>
      </div>
    </div>
  );
};
export default BulkCollaboratorActions;
