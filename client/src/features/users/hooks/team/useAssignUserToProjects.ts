import { useQueryClient, useMutation } from "@tanstack/react-query";
import { assignProjectsToUser } from "@/features/users/api/userProjectOptions.api";
import type { AssignUserToProjectsInput } from "@shared/types/inputs/assignUserToProjectsInput";

export const useAssignUserToProjects = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, AssignUserToProjectsInput>({
    mutationFn: assignProjectsToUser,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users", variables.userId, "project-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", "options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", variables.userId, "details"],
      });

      for (const projectId of variables.projectIdsToAdd) {
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "collaborators"],
        });
      }
    },
  });
};
