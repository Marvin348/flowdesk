import { AVATARS, type AvatarKey } from "@/data/avatar";

type AvatarProps = {
  avatarKey?: AvatarKey;
  size?: "sm" | "lg" | "xl";
};

const Avatar = ({ avatarKey, size }: AvatarProps) => {
  const sm = size === "sm" && "size-8";
  const lg = size === "lg" && "size-12";
  const xl = size === "xl" && "size-20";

  return (
    <>
      {avatarKey ? (
        <img
          src={AVATARS[avatarKey]}
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
