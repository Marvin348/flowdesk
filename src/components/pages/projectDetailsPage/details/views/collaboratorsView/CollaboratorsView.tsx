import Avatar from "@/components/users/avatar/Avatar";
import { ChevronsUpDown } from "lucide-react";
import type { User } from "@/type/domain/user";
import { Copy, EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";
import { getSortedCollaborators } from "@/utils/collaborators/getSortedCollaborators";
import CollaboratorActions from "./CollaboratorActions";
import DeleteCollaboratorDialog from "./DeleteCollaboratorDialog";
import ChangeUserRoleDialog from "@/components/users/actions/ChangeUserRoleDialog";
import { USER_ROLE_OPTIONS } from "@/constants/user/user-role-options";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import BulkCollaboratorActions from "./BulkCollaboratorActions";
import { COLLABORATOR_TABLE_OPTIONS } from "@/constants/table-header";
import { updateSort } from "@/utils/updateSort";

type CollaboratorsViewProps = {
  collaborator: User[];
};

type SortKey = "name" | "email" | "type";

export type SortedByCollaborators = {
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
};

export type Actions = "change_role" | "reassign_tasks" | "delete";

const CollaboratorsView = ({ collaborator }: CollaboratorsViewProps) => {
  const [sortedBy, setSortedBy] = useState<SortedByCollaborators | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<
    string | null
  >(null);
  const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<
    string[]
  >([]);
  const [activeAction, setActiveAction] = useState<Actions | null>(null);

  const actionRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionRef, () => setOpenActionId(null));

  const toggleSortedBy = (value: SortKey) => updateSort(value, setSortedBy);
  const sortedCollaborators = getSortedCollaborators(collaborator, sortedBy);

  const toggleOpenActionId = (id: string) =>
    setOpenActionId((prev) => (prev === id ? null : id));

  const handleOpenActions = (id: string) => {
    toggleOpenActionId(id);
    setSelectedCollaboratorId(id);
  };

  const onAction = (key: Actions) => {
    setActiveAction(key);
    setOpenActionId(null);
  };

  const handleOnClose = () => setActiveAction(null);

  const currentName =
    collaborator.find((coll) => coll.id === selectedCollaboratorId)?.name ??
    "UNKNOWN";
  const currentRole =
    collaborator.find((coll) => coll.id === selectedCollaboratorId)?.role ??
    "member";

  const toggleMultiSelect = (id: string) =>
    setSelectedCollaboratorIds((prev) =>
      prev.includes(id)
        ? prev.filter((collId) => collId !== id)
        : [...prev, id],
    );

  return (
    <section>
      {selectedCollaboratorIds.length > 0 && (
        <BulkCollaboratorActions
          collaboratorCount={selectedCollaboratorIds.length}
          onClose={() => setSelectedCollaboratorIds([])}
        />
      )}

      <div className="border rounded-md mt-2">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr]  gap-4 p-2 bg-muted-foreground/10 rounded-t-md">
          {COLLABORATOR_TABLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className="w-fit flex items-center gap-1"
              onClick={() => toggleSortedBy(opt.value)}
            >
              {opt.label} <ChevronsUpDown className="size-4 text-surface/80" />
            </button>
          ))}
        </div>

        <div>
          {sortedCollaborators.map((coll) => {
            const option = USER_ROLE_OPTIONS[coll.role];

            const CollaboratorIcon = option.icon;
            const collaboratorLabel = option.label;

            const isSelected = selectedCollaboratorIds.includes(coll.id);

            return (
              <div
                key={coll.id}
                className={`p-2 grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_2fr_1fr_1fr]  items-center gap-4 border-b last:border-none ${isSelected && "bg-accent/10"}`}
              >
                <div
                  className="flex items-center gap-4 cursor-pointer w-fit"
                  onClick={() => toggleMultiSelect(coll.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="accent-accent"
                  />

                  <div className="min-w-0 flex items-center gap-4">
                    <Avatar avatarKey={coll.avatarKey} />
                    <div>
                      <p className="truncate">{coll.name}</p>
                      <p className="text-surface/80 text-sm ">
                        {coll.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 hidden truncate sm:flex">
                  <button className="min-w-0 w-full flex flex-col items-start">
                    <span className="truncate font-medium text-sm">
                      {coll.email}
                    </span>

                    <span className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
                      <Copy className="size-4" /> Copy
                    </span>
                  </button>
                </div>

                <div className="min-w-0 hidden md:flex items-center">
                  <div className="flex items-center gap-2 ">
                    <CollaboratorIcon className="text-surface/80 size-4" />
                    <p className="truncate ">{collaboratorLabel}</p>
                  </div>
                </div>

                <div
                  className="relative justify-self-end"
                  ref={openActionId === coll.id ? actionRef : null}
                >
                  <button
                    className="min-w-0 justify-self-end"
                    onClick={() => handleOpenActions(coll.id)}
                  >
                    <EllipsisVertical
                      className="text-surface/80"
                      strokeWidth={1}
                      fill="black"
                    />
                  </button>

                  {openActionId === coll.id && (
                    <CollaboratorActions onAction={onAction} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeAction === "delete" && selectedCollaboratorId && (
        <DeleteCollaboratorDialog
          onClose={handleOnClose}
          collaboratorName={currentName}
          collaboratorId={selectedCollaboratorId}
        />
      )}

      {activeAction === "change_role" && selectedCollaboratorId && (
        <ChangeUserRoleDialog
          onClose={handleOnClose}
          userName={currentName}
          currentRole={currentRole}
          userId={selectedCollaboratorId}
        />
      )}
    </section>
  );
};
export default CollaboratorsView;
