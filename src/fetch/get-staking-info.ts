/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetStakingInfo } from "@/fetch/cadence/cadence-get-staking-info";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getAccountStakingInfo(
  address: string,
): Promise<FlowStakingInfo | null> {
  try {
    return query({
      cadence: cadenceGetStakingInfo,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
  } catch (e) {
    return null;
  }
}
