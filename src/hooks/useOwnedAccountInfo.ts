/*--------------------------------------------------------------------------------------------------------------------*/
import {useQuery} from "@tanstack/react-query";
import {getOwnedAccountInfo} from "@/fetch/get-owned-account-info";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useOwnedAccountInfo(address?: string | null) {
  return useQuery({
    queryKey: [`prism-owned-account-info-${address}`],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getOwnedAccountInfo(address);
    },
    enabled: Boolean(address),
  });
}
