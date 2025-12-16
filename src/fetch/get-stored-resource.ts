/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetStoredResource } from "@/fetch/cadence/cadence-get-stored-resource";
import { cadenceGetStoredItems } from "@/fetch/cadence/cadence-get-stored-items";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResource(
  address: string,
  path: string,
): Promise<any | null> {
  try {
    const cadence = cadenceGetStoredItems;
    const clip = "/storage/"
    const cleanPath = path.startsWith(clip) ? path.slice(clip.length) : path;

    const result = await query({
      cadence,
      args: (arg, t) => [
        arg(address, t.Address),
        arg([cleanPath], t.Array(t.String)),
      ],
    });

    return result[0] as FlowAccountDetails;
  } catch (error) {
    console.error("Error fetching stored resource:", error);
    return null;
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResourceNew(
  address: string,
  path: string,
): Promise<FlowAccountDetails | null> {
  try {
    const cadence = cadenceGetStoredResource;
    const cleanPath = path.startsWith("/") ? path.split("/")[2] : path;


    return query({
      cadence,
      args: (arg, t) => [arg(address, t.Address), arg(cleanPath, t.String)],
    });
  } catch (error) {
    console.error("Error fetching stored resource:", error);
    return null;
  }
}
