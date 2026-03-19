import { useUsers } from "@/queries/users/useUsers";
import CollaboratorMultiSelect from "@/components/collaborators/CollaboratorMultiSelect";

type CollaboratorMultiSelectFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;

  disabledUserIds?: string[];
  visibleUserIds?: string[];
};

const CollaboratorMultiSelectField = ({
  value,
  onChange,
  error,
  disabledUserIds,
  visibleUserIds,
}: CollaboratorMultiSelectFieldProps) => {
  const { data: users = [] } = useUsers();

  const selectableUsers = visibleUserIds
    ? users.filter((u) => visibleUserIds.includes(u.id))
    : users;

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
