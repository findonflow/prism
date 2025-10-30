/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";

import { cadenceGetStoredItems } from "@/fetch/cadence/cadence-get-stored-items";
import { cadenceGetNftDisplays } from "@/fetch/cadence/cadence-get-nft-displays";
import { cadenceGetStoragePaths } from "@/fetch/cadence/cadence-get-storage-paths";

/*--------------------------------------------------------------------------------------------------------------------*/
async function getAccountCollectionList(address: string) {
  try {
    return query({
      cadence: cadenceGetStoragePaths,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
  } catch (e) {
    return null;
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function reconstructList(address: string, slice: Array<string>) {
  try {
    return query({
      cadence: cadenceGetStoredItems,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(slice, t.Array(t.String)),
      ],
    });
  } catch (e) {
    console.error(e);
  }

  return [];
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getCollectionList(
  address: string,
  itemFilter: (item: any) => boolean
): Promise<NFTCollection[] | null> {
  try {
    const fullList = await getAccountCollectionList(address || "");
    const chunkSize = 50;
    const mergedData = [];
    let i = 0;

    // Process chunks sequentially using while loop
    while (i < fullList.length) {
      const chunk = fullList
        .slice(i, i + chunkSize)
        .map((si: any) => si.identifier);
      const processedChunk = await reconstructList(address, chunk);
      mergedData.push(...processedChunk);
      i += chunkSize;
    }

    return mergedData.filter(itemFilter);
  } catch (e) {
    return null;
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function getCollectionItems(
  address: string,
  storagePath: string,
  items: string[]
) {
  try {
    const chunkSize = 50;
    const mergedData = [];
    let i = 0;

    // Process chunks sequentially using while loop
    while (i < items.length) {
      const chunk = items.slice(i, i + chunkSize);
      const processedChunk = await query({
        cadence: cadenceGetNftDisplays,
        args: (arg: any, t: any) => [
          arg(address, t.Address),
          arg(storagePath, t.String),
          arg(chunk, t.Array(t.UInt64)),
        ],
      });

      mergedData.push(...Object.values(processedChunk));
      i += chunkSize;
    }

    return mergedData;
  } catch (e) {
    return null;
  }
}

export async function getCollectionPathItems(
  address: string,
  storagePath: string
) {
  const storageData = await getSingleCollectionDetails(address, storagePath);
  const tokenIDs = storageData?.tokenIDs || [];
  const data = await getCollectionItems(address || "", storagePath, tokenIDs);
  return data;
}

export async function getSingleCollectionDetails(
  address: string,
  storagePath: string
) {
  const res = await reconstructList(address || "", [storagePath]);
  const data = await res?.[0];
  return data || {};
}
