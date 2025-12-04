/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { mutateClaimChildAccount } from "@/fetch/mutate-claim-child-account";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function useClaimChildAccount(address: string) {
  return useQuery({
    queryKey: [`prism-claim-child-${address}`],
    queryFn: () => {
      return mutateClaimChildAccount(address);
    },
  });
}
