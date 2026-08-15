import { X } from "lucide-react";
import AddTaskForm from "@/features/tasks/components/create/AddTaskForm";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { useAppStore } from "@/store";

type AddTaskPanelProps = {
  isOpen: boolean;
  projectId: string;
  teamUserIds: string[];
};

const AddTaskPanel = ({
  isOpen,
  projectId,
  teamUserIds,
}: AddTaskPanelProps) => {
  const closeTaskModal = useAppStore((state) => state.closeTaskModal);

  useScrollLock(isOpen);

  return (
    <>
      <div
        className={`overlay ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      ></div>

      <div
        className={`fixed right-0 top-0 bottom-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} z-100`}
      >
        <div className="p-4 h-full w-100 bg-background border-l rounded-l-md">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-medium text-xl">Neue Aufgabe erstellen</h3>
            <button className="text-muted-foreground" onClick={closeTaskModal}>
              <X />
            </button>
          </div>

          <div className="mt-4">
            <AddTaskForm
              projectId={projectId}
              teamUserIds={teamUserIds}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddTaskPanel;
