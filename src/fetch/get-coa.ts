/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetCoa } from "@/fetch/cadence/cadence-get-coa";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getAccountCoa(address: string) {
  try {
    return query({
      cadence: cadenceGetCoa,
      args: (arg, t) => [arg(address, t.Address)],
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}
