import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/type/domain/user";
import type { ChangeUserRoleInput } from "@/type/inputs/changeUserRoleInput";
import { changeUserRole } from "@/api/users";

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, ChangeUserRoleInput>({
    mutationFn: changeUserRole,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
