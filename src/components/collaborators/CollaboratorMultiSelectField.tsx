import { useUsers } from "@/queries/users/useUsers";
import CollaboratorMultiSelect from "@/components/collaborators/CollaboratorMultiSelect";

type CollaboratorMultiSelectFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  teamUserIds: string[];
};

const CollaboratorMultiSelectField = ({
  value,
  onChange,
  error,
  teamUserIds,
}: CollaboratorMultiSelectFieldProps) => {
  const { data: users = [] } = useUsers();

  const invitableUsers = users.filter((user) => !teamUserIds.includes(user.id));

  return (
    <div className="p-2 border rounded-md">
      <label className="text-surface/90 text-sm">Mitarbeiter hinzufügen</label>
      <div className="mt-1">
        <div>
          <CollaboratorMultiSelect
            users={invitableUsers}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
export default CollaboratorMultiSelectField;
