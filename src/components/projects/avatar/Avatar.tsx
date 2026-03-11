import { AVATARS, type AvatarKey } from "@/data/avatar";

type AvatarProps = {
  avatarKey?: AvatarKey;
  size?: "sm" | "lg";
};

const Avatar = ({ avatarKey, size }: AvatarProps) => {
  return (
    <>
      {avatarKey ? (
        <img
          src={AVATARS[avatarKey]}
          alt="avatar"
          className={`${size === "lg" ? "size-12" : "size-8"} rounded-full`}
        />
      ) : (
        <div
          className={`${size === "lg" ? "size-12" : "size-8"} rounded-full bg-gray-300`}
        ></div>
      )}
    </>
  );
};
export default Avatar;
