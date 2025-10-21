/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { collectStoredItems } from "@/fetch/get-stored-items";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function useStoredItems(address: string | undefined | null) {
  return useQuery({
    queryKey: [`prism-stored-items-${address}`],
    queryFn: () => {
      return collectStoredItems(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });
}
