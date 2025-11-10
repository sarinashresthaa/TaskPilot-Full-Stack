import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth/authQueries";
import { api } from "../lib/auth/authQueries";

export const useProtectedQuery = (queryKey, queryFn, options) => {
  const { data: auth } = useAuth();
  let enabled = true;
  if (!auth) {
    enabled = false;
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled,
    ...options,
  });
};
