/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getHybridCustody } from "@/fetch/get-hybrid-custody";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useHybridCustody(address?: string | null) {
  return useQuery({
    queryKey: [`prism-account-hybrid-custody-${address}`],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getHybridCustody(address);
    },
    enabled: Boolean(address),
  });
}
