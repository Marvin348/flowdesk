import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotificationSettings } from "@/features/users/api/users.api";
import type { UpdateNotificationSettingsInput } from "@/features/users/types/updateNotificationSettings";

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UpdateNotificationSettingsInput>({
    mutationFn: updateNotificationSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
