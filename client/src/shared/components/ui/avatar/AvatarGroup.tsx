import Avatar from "@/shared/components/ui/avatar/Avatar";
import type { User } from "@shared/types/user";
import type { UserPreviewDto, UserAvatarDto } from "@shared/types/dto/common/userPreview.dto";

// refactor user types
type AvatarGroupProps = {
  users?: User[] | UserAvatarDto[] | UserPreviewDto[];
};

const AvatarGroup = ({ users }: AvatarGroupProps) => {
  const MAX = 3;
  const visibleUsers = users?.slice(0, MAX);
  const remaining = users?.length ? users.length - MAX : 0;

  return (
    <div className="flex items-center">
      {visibleUsers?.map((user, index) => (
        <div key={user.id} style={{ marginLeft: index === 0 ? 0 : -12 }}>
          <Avatar
            avatarKey={user.avatarKey}
            avatarUrl={user.avatarUrl}
            size="sm"
          />
        </div>
      ))}

      {remaining > 0 && (
        <p className="ml-1 flex items-center justify-center text-xs font-semibold text-muted-foreground">
          +{remaining}
        </p>
      )}
    </div>
  );
};
export default AvatarGroup;
