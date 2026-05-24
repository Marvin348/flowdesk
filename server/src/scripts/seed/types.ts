import { User } from "@shared/types/user.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { Comment } from "@shared/types/comment.js";
import { Attachment } from "@shared/types/attachment.js";

// Seed types describe the db.json source.
// The id fields are seed aliases like "u1", "p1", "t1",
// not MongoDB ids.
export type SeedUser = User;
export type SeedProject = Project;
export type SeedTask = Task;
export type SeedComment = Comment;
export type SeedAttachment = Attachment;