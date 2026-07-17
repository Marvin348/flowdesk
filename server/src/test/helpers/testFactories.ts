import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { createAccessToken } from "@/features/auth/utils/tokens";
import { CommentModel } from "@/features/comments/models/comment.model";
import { ProjectModel } from "@/features/projects/models/project.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import mongoose from "mongoose";
import type { StatusBase } from "@shared/types/StatusBase";
import type { UserRole } from "@shared/types/user";
import type { Priority } from "@shared/types/priority";


let testEmailCounter = 0;

export const createWorkspace = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    name: string;
    ownerId: mongoose.Types.ObjectId;
  }>,
) => {
  return WorkspaceModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    name: overrides?.name ?? "Test Workspace",
    ownerId: overrides?.ownerId ?? new mongoose.Types.ObjectId(),
  });
};

export const createUser = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    email: string;
    name: string;
    passwordHash: string;
    workspaceId: mongoose.Types.ObjectId;
    role: UserRole;
    isEmailVerified: boolean;
    jobTitle: string;
    avatarStorageKey: string;
  }>,
) => {
  testEmailCounter += 1;

  return UserModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    email: overrides?.email ?? `test-${testEmailCounter}@example.com`,
    name: overrides?.name ?? "Test User",
    passwordHash: overrides?.passwordHash ?? "hashed-password",
    workspaceId: overrides?.workspaceId ?? new mongoose.Types.ObjectId(),
    role: overrides?.role ?? "admin",
    isEmailVerified: overrides?.isEmailVerified ?? true,
    ...(overrides?.jobTitle && { jobTitle: overrides.jobTitle }),
    ...(overrides?.avatarStorageKey && {
      avatarStorageKey: overrides.avatarStorageKey,
    }),
  });
};

export const createProject = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    ownerId: string;
    priority: Priority;
    projectStatus: StatusBase;
    dueDate: string | Date;
    invitedUserIds: mongoose.Types.ObjectId[];
  }>,
) => {
  return ProjectModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    workspaceId: overrides?.workspaceId ?? new mongoose.Types.ObjectId(),
    title: overrides?.title ?? "Test Project",
    ownerId: overrides?.ownerId ?? new mongoose.Types.ObjectId().toString(),
    priority: overrides?.priority ?? "high",
    projectStatus: overrides?.projectStatus ?? "in_progress",
    dueDate: overrides?.dueDate ?? "2026-07-15",
    invitedUserIds: overrides?.invitedUserIds ?? [],
    ...(overrides?.description && { description: overrides.description }),
  });
};

export const createTask = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    title: string;
    dueDate: string | Date;
    taskStatus: StatusBase;
    collaboratorIds: mongoose.Types.ObjectId[];
    taskPriority: Priority;
    description: string;
    tags: string[];
  }>,
) => {
  return TaskModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    workspaceId: overrides?.workspaceId ?? new mongoose.Types.ObjectId(),
    projectId: overrides?.projectId ?? new mongoose.Types.ObjectId(),
    title: overrides?.title ?? "Test Task",
    dueDate: overrides?.dueDate ?? "2026-07-10",
    taskStatus: overrides?.taskStatus ?? "pending",
    collaboratorIds: overrides?.collaboratorIds ?? [],
    taskPriority: overrides?.taskPriority ?? "medium",
    ...(overrides?.description && { description: overrides.description }),
    ...(overrides?.tags && { tags: overrides.tags }),
  });
};

export const createAttachment = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId | null;
    userId: mongoose.Types.ObjectId;
    fileName: string;
    storageKey: string;
    mimeType: string;
    fileSize: number;
  }>,
) => {
  return AttachmentModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    workspaceId: overrides?.workspaceId ?? new mongoose.Types.ObjectId(),
    projectId: overrides?.projectId ?? new mongoose.Types.ObjectId(),
    taskId: overrides?.taskId ?? null,
    userId: overrides?.userId ?? new mongoose.Types.ObjectId(),
    fileName: overrides?.fileName ?? "test-file.pdf",
    storageKey: overrides?.storageKey ?? "test/test-file.pdf",
    mimeType: overrides?.mimeType ?? "application/pdf",
    fileSize: overrides?.fileSize ?? 1024,
  });
};

export const createComment = async (
  overrides?: Partial<{
    _id: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    message: string;
    parentCommentId: string;
  }>,
) => {
  return CommentModel.create({
    _id: overrides?._id ?? new mongoose.Types.ObjectId(),
    workspaceId: overrides?.workspaceId ?? new mongoose.Types.ObjectId(),
    taskId: overrides?.taskId ?? new mongoose.Types.ObjectId(),
    userId: overrides?.userId ?? new mongoose.Types.ObjectId(),
    message: overrides?.message ?? "Test comment",
    ...(overrides?.parentCommentId && {
      parentCommentId: overrides.parentCommentId,
    }),
  });
};

export const createAuthCookie = (userId: string) => {
  const accessToken = createAccessToken(userId);
  return [`accessToken=${accessToken}`];
};

export const createAuthedUserContext = async (
  overrides?: Partial<{
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role: UserRole;
    email: string;
    name: string;
    passwordHash: string;
  }>,
) => {
  const userId = overrides?.userId ?? new mongoose.Types.ObjectId();
  const workspaceId = overrides?.workspaceId ?? new mongoose.Types.ObjectId();

  const workspace = await createWorkspace({
    _id: workspaceId,
    ownerId: userId,
  });

  const user = await createUser({
    _id: userId,
    workspaceId,
    role: overrides?.role,
    email: overrides?.email,
    name: overrides?.name,
    passwordHash: overrides?.passwordHash,
  });

  const accessToken = createAccessToken(user._id.toString());

  return {
    accessToken,
    authCookie: [`accessToken=${accessToken}`],
    user,
    userId,
    workspace,
    workspaceId,
  };
};
