import { useUsers } from "@/features/users/hooks/useUsers";
import type { Comment } from "@shared/types/comment";
import type { CommentWithUser } from "@/features/comments/types/commentWithUser";
import { useMemo } from "react";

export const useCommentsWithUsers = (
  comments: Comment[],
): CommentWithUser[] => {
  const { data: users = [] } = useUsers();

  const userByIds = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  return comments.map((com) => {
    const user = userByIds.get(com.userId);

    return {
      ...com,
      user,
    };
  });
};
