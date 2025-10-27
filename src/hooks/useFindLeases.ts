/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import getFindLeases from "@/fetch/get-find-leases";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useFindLeases(address: string | undefined | null) {
  return useQuery({
    queryKey: [`prism-get-find-leases-${address}`],
    queryFn: () => {
      return getFindLeases(address || "");
    },
    enabled: Boolean(address),
  });
}
