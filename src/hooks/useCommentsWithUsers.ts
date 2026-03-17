import { useUsers } from "@/queries/users/useUsers";
import type { Comments } from "@/type/domain/comments";
import type { CommentWithUser } from "@/type/view-models/commentWithUser";
import { useMemo } from "react";

export const useCommentsWithUsers = (
  comments: Comments[],
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
