import { AVATARS } from "@/shared/assets/avatars";
import { User } from "lucide-react";

type AvatarProps = {
  avatarKey?: string;
  size?: "sm" | "lg" | "xl";
};

const Avatar = ({ avatarKey, size }: AvatarProps) => {
  const sm = size === "sm" && "size-8";
  const lg = size === "lg" && "size-12";
  const xl = size === "xl" && "size-20";

  const src = avatarKey ? AVATARS[avatarKey] : undefined;

  return (
    <>
      {src ? (
        <img
          src={src}
          alt="avatar"
          className={`${sm} ${lg} ${xl} rounded-full`}
        />
      ) : (
        <div
          className={`${sm} ${lg} ${xl} rounded-full bg-muted-foreground/10 flex items-center justify-center`}
        >
          <User
            className={`text-muted-foreground ${(sm && "size-4") || (lg && "size-6") || (xl && "size-10")}`}
          />
        </div>
      )}
    </>
  );
};
export default Avatar;
