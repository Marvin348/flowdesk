import { useState } from "react";
import CollaboratorMultiSelectField from "@/features/users/components/collaboratorsSelect/CollaboratorMultiSelectField";
import { Button } from "@/shared/components/ui/button";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { useUpdateProjectMembers } from "@/features/projects/hooks/mutations/useUpdateProjectMembers";
import { Spinner } from "@/shared/components/ui/spinner";

type InviteUserModalProps = {
  onClose: () => void;
  onInviteOpen: boolean;
  teamUserIds: string[];
  invitedUserIds: string[];
  projectId: string;
};

const InviteUserModal = ({
  onClose,
  onInviteOpen,
  teamUserIds,
  invitedUserIds,
  projectId,
}: InviteUserModalProps) => {
  const [selectedUserIds, setSelectedIds] = useState<string[]>([]);
  useScrollLock(onInviteOpen);

  const { mutate, isPending, error } = useUpdateProjectMembers(projectId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { projectId, userIdsToAdd: selectedUserIds },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <div className="overlay flex items-center justify-center p-8">
        <div className="w-100 h-auto bg-white p-4 rounded-md z-100">
          <h4 className="font-semibold text-xl">Mitarbeiter Einladen</h4>

          <form onSubmit={handleSubmit}>
            <div className="my-6 ">
              <CollaboratorMultiSelectField
                value={selectedUserIds}
                onChange={setSelectedIds}
                disabledUserIds={teamUserIds}
              />
            </div>

            <div className="flex items-center justify-end gap-8">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="hover:bg-surface/5"
                onClick={onClose}
              >
                Schließen
              </Button>
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/95 w-30"
                type="submit"
              >
                Einladen {isPending && <Spinner />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default InviteUserModal;
