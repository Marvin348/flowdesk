import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useDeleteProject } from "@/mutations/project/useDeleteProject";
import { Spinner } from "@/components/ui/spinner";

type DeleteProjectDialogProps = {
  projectTitle: string;
  onClose: () => void;
  isOpen: boolean;
  projectId: string;
};

const DeleteProjectDialog = ({
  projectTitle,
  onClose,
  isOpen,
  projectId,
}: DeleteProjectDialogProps) => {
  useScrollLock(isOpen);

  const { mutate, isPending, error } = useDeleteProject();

  const onConfirm = () => {
    mutate(projectId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div
      className="overlay cursor-auto px-8 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white max-w-[400px] text-center p-4 rounded-md z-100">
        <span className="mx-auto flex items-center justify-center size-10 bg-error/10 rounded-full">
          <TriangleAlert className="text-error" />
        </span>

        <div className="my-6">
          <h3 className="font-semibold text-2xl">Projekt löschen</h3>
          <p className="mt-2">
            Möchtest du das Projekt{" "}
            <span className="font-medium">"{projectTitle}"</span> wirklich
            löschen?
          </p>
          <p className="text-muted-foreground text-sm">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>

        {error && (
          <p className="mb-4 error-text">
            Projeckt könnte nicht gelöscht werden
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button onClick={onClose}>Abbrechen</Button>
          <Button
            className="bg-error text-white hover:bg-error/90"
            onClick={onConfirm}
          >
            Ja, Löschen! {isPending && <Spinner />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DeleteProjectDialog;
