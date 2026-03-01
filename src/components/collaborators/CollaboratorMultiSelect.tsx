import type { User } from "@/type/user";
import Avatar from "@/components/projects/avatar/Avatar";
import { useMemo, useState } from "react";
import SelectedUserChip from "@/components/collaborators/SelectedUserChip";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { isDefined } from "@/utils/isDefined";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";

type CollaboratorMultiSelectProps = {
  users: User[];
  value: string[];
  onChange: (next: string[]) => void;
};

const CollaboratorMultiSelect = ({
  users,
  value,
  onChange,
}: CollaboratorMultiSelectProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [input, setInput] = useState("");
  const selectedIds = value;

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const filteredUsers = users.filter(
    (user) =>
      !selectedIds.includes(user.id) &&
      (!input || user.name.toLowerCase().includes(input.toLowerCase())),
  );

  const maxFilteredUsers = filteredUsers.slice(0, 5);

  const getSelectUserById = (id: string) => {
    if (selectedIds.includes(id)) return;

    onChange([...selectedIds, id]);
    setIsDropdownOpen(false);
    setInput("");
  };

  const onRemove = (userId: string) => {
    if (!selectedIds.includes(userId)) return;

    onChange(selectedIds.filter((id) => id !== userId));
  };

  const selectedUsers = useMemo(() => {
    const userById = getArrayLookup(users);
    return selectedIds.map((id) => userById.get(id)).filter(isDefined);
  }, [users, selectedIds]);

  return (
    <div ref={dropdownRef}>
      <div className="relative">
        <input
          value={input}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Suchen..."
          className="w-full border rounded-md p-2"
        />

        {isDropdownOpen && (
          <div className="absolute top-12 border bg-white p-1 w-full rounded-md shadow-2xl text-sm text-surface/90 z-30">
            <>
              {maxFilteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-surface/5"
                  onClick={() => getSelectUserById(user.id)}
                >
                  <Avatar avatarKey={user.avatarKey} />
                  <p>{user.name}</p>
                </div>
              ))}
              {maxFilteredUsers.length === 0 && (
                <p className="p-2">Keine Daten</p>
              )}
            </>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-3">
        {selectedUsers.map((user) => (
          <SelectedUserChip
            key={user.id}
            user={user}
            onRemove={() => onRemove(user.id)}
          />
        ))}
      </div>
    </div>
  );
};
export default CollaboratorMultiSelect;
