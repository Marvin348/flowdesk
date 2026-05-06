import type { SelectedUser } from "@/pages/TeamPage";
import { Button } from "@/shared/components/ui/button";
import { UserX } from "lucide-react";
import { useDeleteProjectMember } from "@/features/projects/hooks/mutations/useDeleteProjectMember";
import { Spinner } from "@/shared/components/ui/spinner";

type DeleteCollaboratorDialogProps = {
  onClose: () => void;
  selectedUser: SelectedUser;
  projectId: string;
};
const DeleteCollaboratorDialog = ({
  onClose,
  selectedUser,
  projectId,
}: DeleteCollaboratorDialogProps) => {
  const { mutate, isPending, error } = useDeleteProjectMember();

  const onDelete = () => {
    const input = {
      projectId,
      userId: selectedUser.id,
    };

    mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="overlay px-8 flex items-center justify-center">
      <div className="bg-white max-w-[400px] text-center p-4 rounded-md z-100">
        <span className="mx-auto flex items-center justify-center size-10 bg-error/10 rounded-full">
          <UserX className="text-error" />
        </span>

        <div className="my-6">
          <h5 className="font-semibold text-xl">Mitarbeiter entfernen</h5>
          <p className="mt-2">
            Der Nutzer{" "}
            <span className="font-semibold">{selectedUser.name}</span> wird aus
            dem Projekt entfernt und von allen zugewiesenen Aufgaben entfernt.
          </p>
          <p className="text-muted-foreground text-sm">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>

        {error && (
          <p className="mb-4 error-text">
            Mitarbeiter konnte nicht gelöscht werden
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button
            onClick={onClose}
            className="hover:bg-surface/5"
            variant="outline"
          >
            Abbrechen
          </Button>
          <Button
            className="bg-error text-white hover:bg-error/90"
            onClick={onDelete}
            disabled={isPending}
          >
            Löschen {isPending && <Spinner />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DeleteCollaboratorDialog;
