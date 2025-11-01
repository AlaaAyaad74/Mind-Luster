import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      // If task not found (404), refetch to sync with server
      if (error instanceof Error && error.message.includes("not found")) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });
};
