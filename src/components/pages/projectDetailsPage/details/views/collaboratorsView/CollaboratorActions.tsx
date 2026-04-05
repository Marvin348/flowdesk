import type { Actions } from "./CollaboratorsView";
import { COLLABORATOR_ACTIONS } from "@/constants/user/user-actions";

type CollaboratorActions = {
  onAction: (value: Actions) => void;
};

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
