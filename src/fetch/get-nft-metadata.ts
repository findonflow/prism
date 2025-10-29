/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetCoa } from "@/fetch/cadence/cadence-get-coa";
import { cadenceGetNftMetadata } from "@/fetch/cadence/cadence-get-nft-metadata";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getNftMetadata(
  address: string,
  path: string,
  id: string,
) {
  try {
    return query({
      cadence: cadenceGetNftMetadata,
      args: (arg, t) => [
        arg(address, t.Address),
        arg(path, t.String),
        arg(id, t.UInt64),
      ],
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}
