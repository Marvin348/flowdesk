import { ProjectModel } from "@/features/projects/models/project.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { UserModel } from "@/features/users/models/user.modal";
import { CommentModel } from "@/features/comments/models/comment.model";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";

export const clearDatabase = async () => {
  await Promise.all([
    WorkspaceModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    TaskModel.deleteMany({}),
    UserModel.deleteMany({}),
    CommentModel.deleteMany({}),
    AttachmentModel.deleteMany({}),
  ]);
};
