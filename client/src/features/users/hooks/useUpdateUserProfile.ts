import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/features/users/api/users.api";
import type { UpdateUserProfileInput } from "@/features/users/types/updateUserProfile";
import type { User } from "@shared/types/user";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserProfileInput>({
    mutationFn: updateUserProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
