import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/types/user";
import type { ChangeUserRoleInput } from "@shared/types/inputs/changeUserRoleInput";
import { changeUserRole } from "@/features/users/api/users.api.ts";

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, ChangeUserRoleInput>({
    mutationFn: changeUserRole,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
