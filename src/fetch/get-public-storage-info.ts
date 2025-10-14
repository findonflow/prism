/*--------------------------------------------------------------------------------------------------------------------*/
import { query } from "@onflow/fcl";
import { cadenceGetPublicItems } from "@/fetch/cadence/cadence-get-public-items";
import { cadenceGetAccountPublicStorage } from "@/fetch/cadence/cadence-get-account-public-storage";

/*--------------------------------------------------------------------------------------------------------------------*/
async function getAccountPublicStorage(
  address: string,
): Promise<Array<FlowPublicPath> | null> {
  const cadence = cadenceGetAccountPublicStorage;

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

/*--------------------------------------------------------------------------------------------------------------------*/
async function fetchPublicInfoList(address: string, paths: Array<string>) {
  try {
    const storagePaths = paths.map((key) => {
      return { key, value: true };
    });
    const result = await query({
      cadence: cadenceGetPublicItems,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(storagePaths, t.Dictionary({ key: t.String, value: t.Bool })),
      ],
    });

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function collectPublicStorageInfo(
  address: string,
): Promise<Array<FlowPublicPathInfo> | null> {
  try {
    const paths = await getAccountPublicStorage(address);

    if (!paths) {
      return null;
    }

    const chunkSize = 25;
    const mergedData = [];
    let i = 0;

    // Process chunks sequentially using while loop
    while (i < paths.length) {
      const chunk = paths.slice(i, i + chunkSize).map((pp) => pp.path);
      const processedChunk = await fetchPublicInfoList(address, chunk);

      mergedData.push(...Object.values(processedChunk));
      i += chunkSize;
    }

    const pathMap = mergedData.reduce(
      (acc: { [key: string]: any }, pathInfo: any) => {
        const { targetPath } = pathInfo;

        acc[targetPath] = pathInfo;

        return acc;
      },
      {},
    );

    return paths
      .map((path: any) => {
        const info = pathMap[path.path];
        if (info) {
          return {
            ...path,
            ...info,
          };
        }
        return {
          ...path,
        };
      })
      .sort((a: any, b: any) => {
        // TODO: fix complex sorting to raise balance and collection capabilities to the top
        const aVal = `${a?.isBalanceCap} ? "1" : "9` + a.path;
        const bVal = `${a?.isBalanceCap} ? "1" : "9` + b.path;
        return aVal.localeCompare(bVal, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });
  } catch (e) {
    return null;
  }
}
