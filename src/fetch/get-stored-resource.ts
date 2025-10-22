/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetStoredResource } from "@/fetch/cadence/cadence-get-stored-resource";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResource(
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
