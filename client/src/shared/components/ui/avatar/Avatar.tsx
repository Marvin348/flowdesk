import { AVATARS } from "@/shared/assets/avatars";
import { User } from "lucide-react";

type AvatarProps = {
  avatarUrl?: string;
  avatarKey?: string;
  size: "sm" | "lg" | "xl";
};

const Avatar = ({ avatarUrl, avatarKey, size }: AvatarProps) => {
  const avatarSizeClass = {
    sm: "size-8",
    lg: "size-12",
    xl: "size-20",
  }[size];

  const iconSizeClass = {
    sm: "size-4",
    lg: "size-6",
    xl: "size-10",
  }[size];

  const presetAvatarSrc = avatarKey ? AVATARS[avatarKey] : undefined;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Avatar"
        className={`${avatarSizeClass} rounded-full object-cover`}
      />
    );
  }
  if (avatarKey) {
    return (
      <img
        src={presetAvatarSrc}
        alt="Avatar"
        className={`${avatarSizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${avatarSizeClass} rounded-full bg-muted-foreground/10 flex items-center justify-center`}
    >
      <User className={`${iconSizeClass} text-muted-foreground`} />
    </div>
  );
};
export default Avatar;
