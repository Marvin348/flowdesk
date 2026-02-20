import type { User } from "@/type/user";
import type { Comments } from "@/type/comments";
import type { Attachment } from "@/type/attachment";
import type { Task } from "@/type/task";

export type TaskWithMeta = Task & {
  comments: Comments[];
  attachments: Attachment[];
  collaborators: User[];
};
