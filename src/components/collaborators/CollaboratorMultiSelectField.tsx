import { useUsers } from "@/queries/users/useUsers";
import CollaboratorMultiSelect from "@/components/collaborators/CollaboratorMultiSelect";
import type { User } from "@/type/user";

type CollaboratorMultiSelectFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  teamUserIds: string[];
  mode?: "invite" | "task";
};

const CollaboratorMultiSelectField = ({
  value,
  onChange,
  error,
  teamUserIds,
  mode,
}: CollaboratorMultiSelectFieldProps) => {
  const { data: users = [] } = useUsers();

  // // included in the project | for add task panel
  // const allowed = users.filter((u) => teamUserIds.includes(u.id));
  // console.log("allowed", allowed);

  // // for invite modal
  // const excluded = users.filter((u) => !teamUserIds.includes(u.id));
  // console.log("excluded", excluded);

  let selectableUsers: User[];
  let disabledUserIds: string[];

  if (mode === "invite") {
    selectableUsers = users;
    disabledUserIds = teamUserIds;
  } else {
    selectableUsers = users.filter((u) => teamUserIds.includes(u.id));
    disabledUserIds = [];
  }

  return (
    <div className="p-2 border rounded-md">
      <label className="text-surface/90 text-sm">Mitarbeiter hinzufügen</label>
      <div className="mt-1">
        <div>
          <CollaboratorMultiSelect
            users={selectableUsers}
            value={value}
            onChange={onChange}
            disabledUserIds={disabledUserIds}
          />
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
export default CollaboratorMultiSelectField;
