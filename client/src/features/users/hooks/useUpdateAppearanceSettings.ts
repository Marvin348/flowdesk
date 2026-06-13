import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateAppearanceSettings } from "@/features/users/api/users.api";
import type { UpdateAppearanceSettingsInput } from "@/features/users/types/UpdateAppearanceSettings";
import type { AuthUser } from "@shared/types/user";

export const useUpdateAppearanceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, UpdateAppearanceSettingsInput>({
    mutationFn: updateAppearanceSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
