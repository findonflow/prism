/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetStoredResource } from "@/fetch/cadence/cadence-get-stored-resource";
import { cadenceGetStoredItems } from "@/fetch/cadence/cadence-get-stored-items";
import { CadenceType, extractRestrictedFields, generateCadenceScript } from "@/lib/cadence-extractor";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResourceShaky(
  address: string,
  path: string,
): Promise<any | null> {
  try {
    const cadence = cadenceGetStoredItems;
    const clip = "/storage/";
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

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResourceLong(
  address: string,
  path: string,
): Promise<any | null> {
  const clip = "/storage/";
  const cleanPath = path.startsWith(clip) ? path.slice(clip.length) : path;
  console.log({ cleanPath });

  let resourceType = {
    kind: ""
  };
  try {
    resourceType = await query({
      cadence: `
        access(all) fun main(address: Address, identifier: String): Type? {
            let path = StoragePath(identifier: identifier)!
            let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
            
            if let type = account.storage.type(at: path){
              return type
            }
            
            return nil
        }
      `,
      args: (arg, t) => [arg(address, t.Address), arg(cleanPath, t.String)],
    });


    const extractorScript = generateCadenceScript(
      resourceType,
      address,
      cleanPath,
      []
    );
    console.log({ extractorScript });

    const extractedData = await query({
      cadence: extractorScript,
    });

    console.log({ extractedData });

    return extractedData;
  } catch (e) {

    const restrictedFields = extractRestrictedFields(e as string);
    const accessProtected = Array.from(new Set(restrictedFields).values());

    const retryExtractScript = generateCadenceScript(
      resourceType,
      address,
      cleanPath,
      accessProtected
    );

    const retryExtract = await query({
      cadence: retryExtractScript,
    });

    return {...retryExtract, accessProtected };
  }
}
/*--------------------------------------------------------------------------------------------------------------------*/
export async function getStoredResource(
  address: string,
  path: string,
): Promise<any | null> {
  const clip = "/storage/";
  const cleanPath = path.startsWith(clip) ? path.slice(clip.length) : path;

  const resourceType = await query({
    cadence: `
        access(all) fun main(address: Address, identifier: String): Type? {
            let path = StoragePath(identifier: identifier)!
            let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
            
            if let type = account.storage.type(at: path){
              return type
            }
            
            return nil
        }
      `,
    args: (arg, t) => [arg(address, t.Address), arg(cleanPath, t.String)],
  });

  const resourceDetails = await fetchResourceSafe(resourceType, address, cleanPath);
  console.log({ resourceDetails });

  return resourceDetails;
}

async function fetchResourceSafe(schema: CadenceType, address: string, path: string) {
  let blacklist: string[] = [];
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const script = generateCadenceScript(schema, address, path, blacklist);

    try {
      return await query({ cadence: script });
    } catch (error: any) {
      const restrictedFields = extractRestrictedFields(error.message);

      if (restrictedFields.length > 0) {
        console.warn(`Pruning restricted fields: ${restrictedFields.join(', ')}`);
        blacklist = [...blacklist, ...restrictedFields];
        attempts++;
      } else {
        // It's a different kind of error, throw it
        throw error;
      }
    }
  }
}
