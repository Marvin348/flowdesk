import Avatar from "@/shared/components/ui/avatar/Avatar";
import { EllipsisVertical } from "lucide-react";
import type {UserPreviewDto} from "@shared/types/dto/common/userPreview.dto"

type CollaboratorProps = {
  user: UserPreviewDto;
};

const Collaborator = ({ user }: CollaboratorProps) => {
  const { name, avatarKey, avatarUrl, jobTitle } = user;
  return (
    <>
      <Avatar avatarKey={avatarKey} avatarUrl={avatarUrl} size="sm" />
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="">{name}</p>
          {jobTitle && (
            <p className="text-muted-foreground text-sm">{jobTitle}</p>
          )}
        </div>

        <button>
          <EllipsisVertical strokeWidth={1} fill="black" />
        </button>
      </div>
    </>
  );
};
export default Collaborator;
