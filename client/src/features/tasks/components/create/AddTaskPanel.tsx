import { X } from "lucide-react";
import AddTaskForm from "@/features/tasks/components/create/AddTaskForm";
import { useScrollLock } from "@/shared/hooks/useScrollLock";

type AddTaskPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  teamUserIds: string[];
  initialCollaboratorIds: string[];
};

const AddTaskPanel = ({
  isOpen,
  onClose,
  projectId,
  teamUserIds,
  initialCollaboratorIds,
}: AddTaskPanelProps) => {
  useScrollLock(isOpen);

  return (
    <>
      <div
        className={`overlay ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      ></div>

      <div
        className={`fixed right-0 top-0 bottom-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} z-100`}
      >
        <div className="p-4 h-full w-100 bg-white rounded-l-md">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-medium text-xl">Neue Aufgabe erstellen</h3>
            <button
              className="text-surface/80 hover:text-black"
              onClick={onClose}
            >
              <X />
            </button>
          </div>

          <div className="mt-4">
            <AddTaskForm
              onClose={onClose}
              projectId={projectId}
              teamUserIds={teamUserIds}
              initialCollaboratorIds={initialCollaboratorIds}
              isOpen={isOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddTaskPanel;
