import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";

export const clearDatabase = async () => {
  await Promise.all([
    ProjectModel.deleteMany({}),
    TaskModel.deleteMany({}),
    UserModel.deleteMany({}),
    CommentModel.deleteMany({}),
    AttachmentModel.deleteMany({}),
  ]);
};
