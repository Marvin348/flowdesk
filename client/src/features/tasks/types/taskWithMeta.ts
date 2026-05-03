import type { User } from "@shared/types/user";
import type { Comment } from "@shared/types/comment";
import type { Attachment } from "@shared/types/attachment";
import type { Task } from "@shared/types/task";

export type TaskWithMeta = Task & {
  comments: Comment[];
  attachments: Attachment[];
  collaborators: User[];
};
