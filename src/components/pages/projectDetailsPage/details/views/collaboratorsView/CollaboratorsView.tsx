import Avatar from "@/components/projects/avatar/Avatar";
import { ChevronsUpDown } from "lucide-react";
import type { User } from "@/type/domain/user";
import { Copy, EllipsisVertical, ShieldUser, UserRound } from "lucide-react";
import { useState } from "react";
import { getSortedCollaborators } from "@/utils/collaborators/getSortedCollaborators";

type SortKey = "name" | "email" | "type";

export type SortedByCollaborators = {
  sortKey?: SortKey;
  sortDirection?: "asc" | "desc";
};

const CollaboratorsView = ({ collaborator }: { collaborator: User[] }) => {
  const [sortedBy, setSortedBy] = useState<SortedByCollaborators | null>(null);

  const toggleSortedBy = (value: SortKey) =>
    setSortedBy((prev) => {
      if (prev?.sortKey !== value) {
        return {
          sortKey: value,
          sortDirection: "asc",
        };
      }

      return {
        sortKey: value,
        sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
      };
    });

  const sortedCollaborators = getSortedCollaborators(collaborator, sortedBy);

  const TABLE_OPTIONS = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Type", value: "type" },
  ] as const;

  return (
    <div>
      <div className="border rounded-md">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr]  gap-4 p-2 bg-muted-foreground/10 rounded-t-md">
          {TABLE_OPTIONS.map((opt) => (
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
          {sortedCollaborators.map((coll) => (
            <div
              key={coll.id}
              className="p-2 grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_2fr_1fr_1fr]  items-center gap-4 border-b last:border-none"
            >
              <div className="min-w-0 flex items-center gap-4">
                <Avatar avatarKey={coll.avatarKey} />
                <div>
                  <p className="truncate">{coll.name}</p>
                  <p className="text-surface/80 text-sm ">{coll.jobTitle}</p>
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
                <div className="flex items-center gap-2 text-surface/80">
                  {coll.role === "admin" ? (
                    <ShieldUser className="size-4" />
                  ) : (
                    <UserRound className="size-4" />
                  )}
                  <p className="text-surface truncate">{coll.role}</p>
                </div>
              </div>

              <button className="min-w-0 justify-self-end">
                <EllipsisVertical
                  className="text-surface/80"
                  strokeWidth={1}
                  fill="black"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CollaboratorsView;
