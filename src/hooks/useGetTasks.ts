import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};
