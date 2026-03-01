import { useUsers } from "@/queries/users/useUsers";
import CollaboratorMultiSelect from "@/components/collaborators/CollaboratorMultiSelect";

type CollaboratorMultiSelectFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
};

const CollaboratorMultiSelectField = ({
  value,
  onChange,
  error,
}: CollaboratorMultiSelectFieldProps) => {
  const { data: users = [] } = useUsers();

  return (
    <div className="p-2 border rounded-md">
      <label className="text-surface/90 text-sm">Mitarbeiter hinzufügen</label>
      <div className="mt-1">
        <div>
          <CollaboratorMultiSelect users={users} value={value} onChange={onChange}/>
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
export default CollaboratorMultiSelectField;
