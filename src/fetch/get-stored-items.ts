/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetStoredItems } from "@/fetch/cadence/cadence-get-stored-items";
import { cadenceGetStoragePaths } from "@/fetch/cadence/cadence-get-storage-paths";

/*--------------------------------------------------------------------------------------------------------------------*/ 0;
async function fetchStoragePaths(address: string) {
  const cadence = cadenceGetStoragePaths;

  try {
    return query({
      cadence,
      args: (arg, t) => [arg(address, t.Address)],
    });
  } catch (e) {
    return null;
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
interface StoragePath {
  domain: string;
  identifier: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function collectStoredItems(
  address: string,
): Promise<Array<FlowStorageInfo> | null> {
  const cadence = cadenceGetStoredItems;

  const rawPaths: Array<StoragePath> = await fetchStoragePaths(address);
  const paths: Array<string> = rawPaths.map((path) => path.identifier);

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
