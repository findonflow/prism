/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getAccountCoa } from "@/fetch/get-coa";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useAccountCoa(address?: string | null) {
  return useQuery({
    queryKey: [`prism-account-coa-${address}`],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getAccountCoa(address);
    },
    enabled: Boolean(address),
  });
}
