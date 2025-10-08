import { MeResponse } from "@/app/api/app/me/types";
import useSWR from "swr";

const useUser = () => {
  const { data, isLoading, error, mutate } = useSWR<MeResponse>("/api/app/me", {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 300000, // 5 minutes - very long cache for user data
    refreshInterval: 0, // No automatic refresh
    errorRetryCount: 1, // Faster failure
    errorRetryInterval: 20000, // 20 seconds between retries
  });

  return { user: data?.user, isLoading, error, mutate };
};

export default useUser;
