import { FolderOpen } from "lucide-react";
import CreateProjectForm from "@/features/projects/components/create/CreateProjectForm";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { X } from "lucide-react";

type CreateProjectModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const CreateProjectModal = ({ onClose, isOpen }: CreateProjectModalProps) => {
  useScrollLock(isOpen);

  return (
    <div className="overlay flex items-center justify-center">
      <div className="bg-white w-md h-auto rounded-md p-4 z-100">
        {/**Header */}
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-surface/5 p-2 rounded-md">
              <FolderOpen />
            </div>
            <h3 className="font-medium text-xl">Neues Projekt erstellen</h3>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div>
          <CreateProjectForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
export default CreateProjectModal;
