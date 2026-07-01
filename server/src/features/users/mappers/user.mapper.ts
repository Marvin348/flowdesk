import { User, AuthUser } from "@shared/types/user.js";
import {
  UserAvatarDto,
  UserPreviewDto,
} from "@shared/types/dto/common/userPreview.dto.js";
import type { UserDocument } from "@/features/users/types/user.document.js";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl.js";

export const toUserDto = (user: UserDocument): User => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  role: user.role,
  avatarKey: user.avatarKey,
});

export const toAuthUserDto = (user: UserDocument): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  role: user.role,
  avatarKey: user.avatarKey,
  appearanceSettings: {
    theme: user.appearanceSettings?.theme ?? "system",
    density: user.appearanceSettings?.density ?? "default",
    startView: user.appearanceSettings?.startView ?? "dashboard",
  },
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
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
});
