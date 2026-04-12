import type { User } from "@/type/domain/user";
import type { Comments } from "@/type/domain/comments";
import type { Attachment } from "@/type/domain/attachment";
import type { Task } from "@/type/domain/task";

export type TaskWithMeta = Task & {
  comments: Comments[];
  attachments: Attachment[];
  collaborators: User[];
};
