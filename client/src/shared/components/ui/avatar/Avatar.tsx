import { AVATARS } from "@/shared/assets/avatars";

type AvatarProps = {
  avatarKey?: string;
  size?: "sm" | "lg" | "xl";
};

const Avatar = ({ avatarKey, size }: AvatarProps) => {
  const sm = size === "sm" && "size-8";
  const lg = size === "lg" && "size-12";
  const xl = size === "xl" && "size-20";

  const src = avatarKey ? AVATARS[avatarKey] : undefined;
  //  const fallback
  return (
    <>
      {src ? (
        <img
          src={src}
          alt="avatar"
          className={`${sm} ${lg} ${xl} rounded-full`}
        />
      ) : (
        <div className={`${sm} ${lg} ${xl} rounded-full bg-gray-300`}></div>
      )}
    </>
  );
};
export default Avatar;
