import { User } from "@shared/types/user.js";
import {
  UserAvatarDto,
  UserPreviewDto,
} from "@shared/types/dto/common/userPreview.dto.js";

type UserDbRecord = Omit<User, "id"> & {
  _id: { toString: () => string };
  __v?: number;
};

export const toUserDto = (user: UserDbRecord): User => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  role: user.role,
  avatarKey: user.avatarKey,
});

export const toUserPreviewDto = (user: User): UserPreviewDto => ({
  id: user.id,
  name: user.name,
  avatarKey: user.avatarKey,
  jobTitle: user.jobTitle,
});

export const toUserAvatarDto = (user: User): UserAvatarDto => ({
  id: user.id,
  avatarKey: user.avatarKey,
});
