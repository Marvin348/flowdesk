import { AVATARS, type AvatarKey } from "@/data/avatar";

type AvatarProps = {
  avatarKey?: AvatarKey;
};

const Avatar = ({ avatarKey }: AvatarProps) => {
  return (
    <div className="">
      {avatarKey ? (
        <img
          src={AVATARS[avatarKey]}
          alt="avatar"
          className="size-8 rounded-full"
        />
      ) : (
        <div className="size-8 rounded-full bg-gray-300"></div>
      )}
    </div>
  );
};
export default Avatar;
