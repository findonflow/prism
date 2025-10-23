/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getAccountStakingInfo } from "@/fetch/get-staking-info";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useStakingInfo(address: string | undefined | null) {
  return useQuery({
    queryKey: [`prism-public-staking-info-${address}`],
    queryFn: () => {
      return getAccountStakingInfo(address || "");
    },
    enabled: Boolean(address),
  });
}
