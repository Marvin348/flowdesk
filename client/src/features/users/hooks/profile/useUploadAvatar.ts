import { useQueryClient, useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "@/features/users/api/users.api";
import type { UserAvatarDto } from "@shared/types/dto/common/userPreview.dto";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<UserAvatarDto, Error, File>({
    mutationFn: uploadAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
