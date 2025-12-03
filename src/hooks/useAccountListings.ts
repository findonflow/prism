/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import getAccountListings from "@/fetch/get-account-listings";

/*--------------------------------------------------------------------------------------------------------------------*/

export function useAccountListings(address?: string | null) {
  return useQuery({
    queryKey: [`prism-account-listings`, address],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getAccountListings(address);
    },
    enabled: Boolean(address),
  });
}
