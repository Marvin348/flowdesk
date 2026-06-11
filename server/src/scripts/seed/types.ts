import { User } from "@shared/types/user.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { Comment } from "@shared/types/comment.js";

// Seed types describe the db.json source.
// The id fields are seed aliases like "u1", "p1", "t1",
// not MongoDB ids.
export type SeedUser = User;
export type SeedProject = Project;
export type SeedTask = Task;
export type SeedComment = Comment;

export type SeedAttachment = {
  id: string;
  projectId: string;
  taskId?: string | null | undefined;
  userId: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
};
