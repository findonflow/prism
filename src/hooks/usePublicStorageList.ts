import { useQuery } from "@tanstack/react-query";
import { collectPublicStorageInfo } from "@/fetch/get-public-storage-info";

export default function usePublicStorageList(
  address: string | undefined | null,
) {
  return useQuery({
    queryKey: [`crystal-public-storage-list-${address}`],
    queryFn: () => {
      return collectPublicStorageInfo(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });
}
