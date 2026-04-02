import { Trash2, UserRoundPen, ClipboardList } from "lucide-react";
import type { Actions } from "./CollaboratorsView";

type CollaboratorActions = {
  onAction: (value: Actions) => void;
};

const COLLABORATOR_ACTIONS = [
  {
    key: "change_role",
    label: "Rolle ändern",
    icon: UserRoundPen,
  },
  {
    key: "reassign_tasks",
    label: "Aufgabe zuweisen",
    icon: ClipboardList,
  },
  {
    key: "delete",
    label: "Löschen",
    icon: Trash2,
  },
] as const;

const CollaboratorActions = ({ onAction }: CollaboratorActions) => {
  return (
    <div className="absolute right-2 top-8 min-w-[180px] bg-white border rounded-md whitespace-nowrap z-10">
      {COLLABORATOR_ACTIONS.map(({ key, label, icon: Icon }) => (
        <div className="p-1" key={key}>
          <button
            className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
            onClick={() => onAction(key)}
          >
            <Icon className="shrink-0 size-4" /> {label}
          </button>
        </div>
      ))}
    </div>
  );
};
export default CollaboratorActions;
