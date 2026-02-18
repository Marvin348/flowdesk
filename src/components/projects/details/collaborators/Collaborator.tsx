import type { User } from "@/type/user";
import Avatar from "@/components/projects/avatar/Avatar";
import { EllipsisVertical } from "lucide-react";

type CollaboratorProps = {
  user: User;
};

const Collaborator = ({ user }: CollaboratorProps) => {
  const { name, avatarKey, jobTitle } = user;
  return (
    <>
      <Avatar avatarKey={avatarKey} />
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="">{name}</p>
          {jobTitle && (
            <p className="text-muted-foreground text-sm">{jobTitle}</p>
          )}
        </div>

        <button>
          <EllipsisVertical strokeWidth={1} fill="black"/>
        </button>
      </div>
    </>
  );
};
export default Collaborator;
