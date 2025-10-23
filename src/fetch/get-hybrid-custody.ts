/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetHybridCustody } from "@/fetch/cadence/cadence-get-hybrid-custody";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getHybridCustody(address: string) {
  try {
    return query({
      cadence: cadenceGetHybridCustody,
      args: (arg, t) => [arg(address, t.Address)],
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}
