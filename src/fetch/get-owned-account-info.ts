/*--------------------------------------------------------------------------------------------------------------------*/
import {cadenceGetOwnedAccount} from "@/fetch/cadence/cadence-get-owned-account";
import {query} from "@onflow/fcl";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getOwnedAccountInfo(
  address: string,
): Promise<any | null> {
  const cadence = cadenceGetOwnedAccount;

  try {
    const result = await query({
      cadence,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
    return result;
  } catch (e) {
    return null;
  }
}
