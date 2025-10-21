import { cadenceGetStoredItems } from "@/fetch/cadence/cadence-get-stored-items";
import { query } from "@onflow/fcl";

export async function collectStoredItems(address: string) {
  const cadence = cadenceGetStoredItems;

  const paths: Array<string> = [];

  try {
    return query({
      cadence,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(paths, t.Array(t.String)),
      ],
    });
  } catch (e) {
    return null;
  }
}
