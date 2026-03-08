import { useState } from "react";
import CollaboratorMultiSelectField from "./CollaboratorMultiSelectField";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useUpdateProjectMembers } from "@/mutations/project/useUpdateProjectMembers";

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
  useScrollLock(onInviteOpen);

  const [selectedUserIds, setSelectedIds] = useState<string[]>([]);

  const { mutate, isPending, error } = useUpdateProjectMembers(projectId);

  const nextInvitedUserIds = Array.from(
    new Set([...invitedUserIds, ...selectedUserIds]),
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { projectId, invitedUserIds: nextInvitedUserIds },
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
                teamUserIds={teamUserIds}
                mode="invite"
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
                Einladen
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default InviteUserModal;
