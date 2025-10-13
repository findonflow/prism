/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getAccountDetails } from "@/fetch/get-account-details";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useAccountDetails(address?: string | null) {
  return useQuery({
    queryKey: [`prism-account-details-${address}`],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getAccountDetails(address);
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });
}
