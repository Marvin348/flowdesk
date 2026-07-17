import type {
  User,
  AuthUser,
  UserSecurityOverviewDto,
} from "@shared/types/user";
import {
  UserAvatarDto,
  UserPreviewDto,
} from "@shared/types/dto/common/userPreview.dto";
import type { UserDocument } from "@/features/users/types/user.document";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";
import { toIsoString } from "@/utils/toIsoString";
import { Types } from "mongoose";

type UserAvatarSource = {
  _id: Types.ObjectId;
  avatarKey?: string;
  avatarStorageKey?: string;
};

type UserPreviewSource = {
  _id: Types.ObjectId;
  name: string;
  jobTitle?: string;
  avatarKey?: string;
  avatarStorageKey?: string;
};

export const toUserDto = (user: UserDocument): User => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  role: user.role,
  avatarKey: user.avatarKey,
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
});

export const toAuthUserDto = (user: UserDocument): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  jobTitle: user.jobTitle,
  role: user.role,
  avatarKey: user.avatarKey,
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
  appearanceSettings: {
    theme: user.appearanceSettings?.theme ?? "system",
    density: user.appearanceSettings?.density ?? "default",
    startView: user.appearanceSettings?.startView ?? "dashboard",
  },
});

export const toUserSecurityOverviewDto = (
  user: UserDocument,
): UserSecurityOverviewDto => ({
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  passwordChangedAt: user.passwordChangedAt
    ? toIsoString(user.passwordChangedAt)
    : null,
  twoFactorEnabled: user.twoFactorEnabled,
});

export const toUserPreviewDto = (user: UserPreviewSource): UserPreviewDto => ({
  id: user._id.toString(),
  name: user.name,
  avatarKey: user.avatarKey,
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
  jobTitle: user.jobTitle,
});

export const toUserAvatarDto = (user: UserAvatarSource): UserAvatarDto => ({
  id: user._id.toString(),
  avatarKey: user.avatarKey,
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
});
