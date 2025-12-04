/*--------------------------------------------------------------------------------------------------------------------*/
import { mutate } from "@onflow/fcl";
import { cadenceMutateClaimChildAccount } from "@/fetch/cadence/cadence-mutate-claim-child-account";

/*--------------------------------------------------------------------------------------------------------------------*/
export function mutateClaimChildAccount(address: string){
  return mutate({
    cadence: cadenceMutateClaimChildAccount,
    args: (arg, t) => [arg(address, t.String)],
    limit: 9999,
  })
}