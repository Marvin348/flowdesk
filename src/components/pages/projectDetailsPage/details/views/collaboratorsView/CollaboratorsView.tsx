import Avatar from "@/components/projects/avatar/Avatar";
import type { User } from "@/type/user";
import { Copy, EllipsisVertical, ShieldUser, UserRound } from "lucide-react";

const CollaboratorsView = ({ collaborator }: { collaborator: User[] }) => {
  return (
    <div>
      <div className="border rounded-md">
        <div className="p-2 bg-muted-foreground/10 rounded-t-md">
          <span>Email</span>
          <span>Type</span>
        </div>
        <div className="">
          {collaborator.map((coll) => (
            <div
              key={coll.id}
              className="p-2 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_1fr_auto]  items-center gap-4 border-b last:border-none"
            >
              <div className="min-w-0 flex items-center gap-4">
                <Avatar avatarKey={coll.avatarKey} />
                <div>
                  <p className="truncate">{coll.name}</p>
                  <p className="text-surface/80 text-sm ">{coll.jobTitle}</p>
                </div>
              </div>

              <div className="min-w-0 hidden truncate sm:block">
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
