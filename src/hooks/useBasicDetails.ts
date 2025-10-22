import { useQuery } from "@tanstack/react-query";
import { getBasicAccountDetails } from "@/fetch/get-basic-account-details";
/*--------------------------------------------------------------------------------------------------------------------*/

export function useBasicDetails(address: string | undefined | null) {
  return useQuery({
    queryKey: [`prism-basic-account-details-${address}`],
    queryFn: () => {
      return getBasicAccountDetails(address || "");
    },
    enabled: Boolean(address),
  });
}
