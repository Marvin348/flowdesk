import type { ProjectCommentDto } from "@shared/types/dto/projects/projectComments.dto";

export type CommentThreadNode = ProjectCommentDto & {
  replies?: CommentThreadNode[];
};
