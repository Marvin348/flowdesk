import Avatar from "@/shared/components/ui/avatar/Avatar";
import { Copy, EllipsisVertical, ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";
import CollaboratorActions from "@/features/users/components/collaboratorsView/CollaboratorActions";
import DeleteCollaboratorDialog from "@/features/users/components/collaboratorsView/DeleteCollaboratorDialog";
import ChangeUserRoleDialog from "@/features/users/components/ChangeUserRoleDialog";
import { USER_ROLE_OPTIONS } from "@/features/users/constants/user-role-options";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import BulkCollaboratorActions from "@/features/users/components/collaboratorsView/BulkCollaboratorActions";
import { COLLABORATOR_TABLE_OPTIONS } from "@/shared/constants/table-header";
import { useProjectCollaborators } from "@/features/projects/hooks/details/useProjectCollaborators";
import { useProjectCollaboratorSearchParams } from "@/features/projects/hooks/searchParams/useProjectCollaboratorSearchParams";
import Pagination from "@/shared/components/ui/Pagination";
import ProjectCollaboratorSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/ProjectCollaboratorSkeleton";

type CollaboratorsViewProps = {
  projectId: string;
  onCreateTask: () => void;
  selectedCollaboratorIds: string[];
  toggleBulk: (value: string) => void;
  onClearSelection: () => void;
};

export type CollaboratorSortKey = "name" | "email" | "role";
export type Actions = "change_role" | "reassign_tasks" | "delete";

const CollaboratorsView = ({
  projectId,
  onCreateTask,
  selectedCollaboratorIds,
  toggleBulk,
  onClearSelection,
}: CollaboratorsViewProps) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<
    string | null
  >(null);
  const [activeAction, setActiveAction] = useState<Actions | null>(null);

  const { page, collaboratorsSort, actions } =
    useProjectCollaboratorSearchParams();

  const actionRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionRef, () => setOpenActionId(null));

  const input = {
    projectId,
    sort: collaboratorsSort,
    page,
    limit: 9,
  };

  const { data, isLoading, error } = useProjectCollaborators(input);

  const collaborators = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  
  if (isLoading && !data) return <ProjectCollaboratorSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;

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

  const handleOnClose = () => {
    setActiveAction(null);
    setSelectedCollaboratorId(null);
  };

  const selectedUser = collaborators.find(
    (coll) => coll.id === selectedCollaboratorId,
  );

  return (
    <section className="flex flex-1 flex-col">
      {selectedCollaboratorIds.length > 0 && (
        <BulkCollaboratorActions
          collaboratorCount={selectedCollaboratorIds.length}
          onClearSelection={onClearSelection}
          onCreateTask={onCreateTask}
        />
      )}

      {!collaborators.length && !!data && (
        <div className="text-muted-foreground text-sm">
          Keine Daten vorhanden
        </div>
      )}

      <div className="border rounded-md mt-2">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr]  gap-4 p-2 bg-muted rounded-t-md">
          {COLLABORATOR_TABLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className="w-fit flex items-center gap-1"
              onClick={() => actions.toggleCollaboratorSort(opt.value)}
            >
              {opt.label}
              <span>
                <ChevronsUpDown className="size-4 text-muted-foreground" />
              </span>
            </button>
          ))}
        </div>

        <div>
          {collaborators.map((coll) => {
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
                  onClick={() => toggleBulk(coll.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="accent-accent"
                  />

                  <div className="min-w-0 flex items-center gap-4">
                    <Avatar avatarKey={coll.avatarKey} size="sm" />
                    <div>
                      <p className="truncate">{coll.name}</p>
                      <p className="text-muted-foreground text-sm ">
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
                    <CollaboratorIcon className="text-foreground size-4" />
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
                    <EllipsisVertical strokeWidth={1} fill="black" />
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

      <div className="mt-auto pt-4 flex justify-end">
        <Pagination
          setPage={actions.setPage}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>

      {activeAction === "delete" && selectedUser && (
        <DeleteCollaboratorDialog
          onClose={handleOnClose}
          selectedUser={{ id: selectedUser.id, name: selectedUser.name }}
          projectId={projectId}
        />
      )}

      {activeAction === "change_role" && selectedUser && (
        <ChangeUserRoleDialog
          onClose={handleOnClose}
          selectedUser={{
            id: selectedUser.id,
            name: selectedUser.name,
          }}
          currentRole={selectedUser.role}
        />
      )}
    </section>
  );
};
export default CollaboratorsView;
