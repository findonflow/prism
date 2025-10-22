import * as fcl from "@onflow/fcl";
import { useQuery } from "@tanstack/react-query";
import { getStakingInfo } from "@interfaces/fcl/cadence/get-staking-info";
import { getStoredItems } from "@interfaces/fcl/cadence/get-stored-items";
import { getNftDisplays } from "@interfaces/fcl/cadence/get-nft-displays";
import { getPublicItems } from "@interfaces/fcl/cadence/get-public-items";
/*--------------------------------------------------------------------------------------------------------------------*/

interface PrismKey {
  hashAlgo: number;
  hashAlgoString: string;
  index: number;
  publicKey: string;
  revoked: boolean;
  sequenceNumber: number;
  signAlgo: number;
  signAlgoString: string;
  weight: number;
}

interface PrismAccountDetails {
  keys: PrismKey[];
  contracts: { [key: string]: string };
}

export async function getAccountDetails(
  address: string
): Promise<PrismAccountDetails | null> {
  try {
    const account = await fcl.account(address);
    return account;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
}

export function usePrismAccountDetails(address: string) {
  const result = useQuery({
    queryKey: [`prism-account-details-${address}`],
    queryFn: () => {
      return getAccountDetails(address);
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });

  return result;
}

interface PrismBasicAccountDetails {
  balance: string;
  availableBalance: string;
  storageUsed: string;
  storageCapacity: string;
}

export async function getBasicAccountDetails(address: string) {
  const cadence = `
    access(all) struct Result {
    access(all) let address: Address
    access(all) let balance: UFix64
    access(all) let availableBalance: UFix64
    access(all) let storageUsed: UInt64
    access(all) let storageCapacity: UInt64

    init(
      address: Address,
      balance: UFix64,
      availableBalance: UFix64,
      storageUsed: UInt64,
      storageCapacity: UInt64
    ) {
      self.address = address
      self.balance = balance
      self.availableBalance = availableBalance
      self.storageUsed = storageUsed
      self.storageCapacity = storageCapacity
    }
  }

  access(all) fun main(address: Address): Result {
    let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
    return Result(
      address: account.address,
      balance: account.balance,
      availableBalance: account.availableBalance,
      storageUsed: account.storage.used,
      storageCapacity: account.storage.capacity
    )
  }
  `;

  try {
    const result = await fcl.query({
      cadence,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });

    return result;
  } catch (e) {
    return null;
  }
}

export function usePrismBasicDetails(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-basic-account-details-${address}`],
    queryFn: () => {
      return getBasicAccountDetails(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });

  return result;
}

export interface PublicPath {
  address: string;
  path: string;
  targetPath: string;
}
async function getAccountPublicStorage(
  address: string
): Promise<Array<PublicPath> | null> {
  const cadence = `
    access(all) struct Item {
      access(all) let address: Address
      access(all) let path: String
      access(all) let targetPath: String?

      init(address: Address, path: String, targetPath: String?) {
        self.address = address
        self.path = path
        self.targetPath = targetPath
      }
    }

    access(all) fun main(address: Address): [Item] {
      let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
      let items: [Item] = []

      let outdatedPaths: {PublicPath: Bool} = {
        /public/FantastecNFTCollection: true,
        /public/jambbLaunchCollectiblesCollection: true,
        /public/RacingTimeCollection: true,
        /public/MusicBlockCollection: true,
        /public/SupportUkraineCollectionV10: true,
        /public/DropzTokenCollection: true,
        /public/TokenLendingPlaceMinterProxy001: true,
        /public/TokenLendingPlace001: true,
        /public/BnGNFTCollection: true,
        /public/FuseCollectiveCollection: true,
        /public/NFTLXKickCollection: true,
        /public/MindtrixPackCollection: true,
        /public/MindtrixPackSetCollection: true
      }

      for path in account.storage.publicPaths {
        if (outdatedPaths.containsKey(path)) {
          continue
        }

        var targetPath: String? = nil
        // FIXME: This is a workaround to check if the path is a capability
        // There is no getLinkTarget method anymore
        if account.capabilities.exists(path) {
          targetPath = path.toString()
        }

        let item = Item(address: address, path: path.toString(), targetPath: targetPath)
        items.append(item)
      }

      return items
    }
`;

  try {
    const result = await fcl.query({
      cadence,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
    return result;
  } catch (e) {
    return null;
  }
}

export function usePrismPublicStorage(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-public-storage-${address}`],
    queryFn: () => {
      return getAccountPublicStorage(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });

  return result;
}

interface EpochInfo {
  currentEpochCounter: string;
  currentEpochPhase: string;
}

export interface NodeInfo {
  id: string;
  networkingAddress: string;
  role: string;
  tokensStaked: string;
  tokensCommitted: string;
  tokensUnstaking: string;
  tokensUnstaked: string;
  tokensRewarded: string;
  delegatorIDCounter: string;
  tokensRequestedToUnstake: string;
  initialWeight: string;
}

export interface DelegatorInfo {
  id: string;
  nodeID: string;
  nodeInfo: NodeInfo;
  tokensCommitted: string;
  tokensStaked: string;
  tokensUnstaking: string;
  tokensRewarded: string;
  tokensUnstaked: string;
  tokensRequestedToUnstake: string;
}

interface MainResponse {
  stakingInfo: {
    epochInfo: EpochInfo;
    lockedAccountInfo: any;
    nodeInfos: Array<any>;
    delegatorInfos: Array<DelegatorInfo>;
    machineAccounts: any;
  };
}

async function getAccountStakingInfo(
  address: string
): Promise<MainResponse | null> {
  try {
    const result = await fcl.query({
      cadence: getStakingInfo,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
    console.log(result);
    return result;
  } catch (e) {
    return null;
  }
}

export function usePrismStakingInfo(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-public-staking-info-${address}`],
    queryFn: () => {
      return getAccountStakingInfo(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60,
  });

  return result;
}

async function getAccountCollectionList(address: string) {
  const cadence = `
  access(all) fun main(address: Address): [StoragePath] {
    var storagePaths: [StoragePath] = []
    let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
    
    account.storage.forEachStored(fun (path: StoragePath, type: Type): Bool {
      storagePaths.append(path)
      return true
    })
    
    return storagePaths
  }
  `;

  try {
    const list = await fcl.query({
      cadence,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });

    return list;
  } catch (e) {
    return null;
  }
}

async function reconstructList(address: string, slice: Array<string>) {
  console.log({ slice });
  try {
    const details = await fcl.query({
      cadence: getStoredItems,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(slice, t.Array(t.String)),
      ],
    });

    return details;
  } catch (e) {
    console.error(e);
  }

  return [];
}
interface DisplayFile {
  url: string;
}

interface DisplaySquareImage {
  file: DisplayFile;
  mediaType: string;
}

interface Display {
  name: string;
  squareImage: DisplaySquareImage;
}

interface PathInfo {
  domain: string;
  identifier: string;
}

interface CollectionData {
  publicPath: PathInfo;
  storagePath: PathInfo;
}

interface FieldType {
  kind: string;
  typeID?: string;
  types?: Array<{
    type: string;
    kind: string;
    typeID: string;
    fields: Array<{
      type: {
        kind: string;
      };
      id: string;
    }>;
    initializers: any[];
  }>;
  key?: FieldType;
  value?: FieldType;
}

interface Field {
  type: FieldType;
  id: string;
}

interface Type {
  type: string;
  kind: string;
  typeID: string;
  fields: Field[];
  initializers: any[];
}

export interface NFTCollection {
  address: string;
  path: string;
  type: Type;
  isResource: boolean;
  isNFTCollection: boolean;
  display: Display | null;
  collectionData: CollectionData | null;
  tokenIDs: string[];
  isVault: boolean;
  balance: null;
}

interface NFTCollectionData {
  data: NFTCollection[];
}

async function getCollectionList(
  address: string
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

    const filtered = mergedData.filter((item) => item.isNFTCollection === true);

    return filtered;
  } catch (e) {
    return null;
  }
}

export function usePrismCollectionList(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-public-collection-list-${address}`],
    queryFn: () => {
      return getCollectionList(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60,
  });

  return result;
}

async function getCollectionItems(
  address: string,
  storagePath: string,
  items: string[]
) {
  console.log("fetching collection items");
  try {
    const chunkSize = 50;
    const mergedData = [];
    let i = 0;

    // Process chunks sequentially using while loop
    while (i < items.length) {
      const chunk = items.slice(i, i + chunkSize);
      const processedChunk = await fcl.query({
        cadence: getNftDisplays,
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

export function usePrismCollectionItems(
  address: string | undefined | null,
  storagePath: string,
  items: string[]
) {
  const result = useQuery({
    queryKey: [`prism-public-collection-items-${address}-${storagePath}`],
    queryFn: () => {
      return getCollectionItems(address || "", storagePath, items);
    },
    enabled: Boolean(address),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60,
  });

  return result;
}

async function fetchPublicInfoList(address: string, paths: Array<string>) {
  try {
    const storagePaths = paths.map((key) => {
      return { key, value: true };
    });
    const result = await fcl.query({
      cadence: getPublicItems,
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

export interface PublicPathInfo extends PublicPath {
  balance?: string;
  isBalanceCap?: boolean;
  isCollectionCap?: boolean;
  tokenIDs: string[];
  type: any;
}

async function collectPublicStorageInfo(
  address: string
): Promise<Array<PublicPathInfo> | null> {
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
      {}
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

async function fetchPublicInfo(address: string, storagePath: string) {
  try {
    const storage = [{ key: storagePath, value: true }];
    const result = await fcl.query({
      cadence: getPublicItems,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(storage, t.Dictionary({ key: t.String, value: t.Bool })),
      ],
    });

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function usePrismPublicItemInfo(address: string, storagePath: string) {
  console.log("LOG", address, storagePath);

  const result = useQuery({
    queryKey: [`prism-public-collection-item-info-${address}-${storagePath}`],
    queryFn: () => {
      return fetchPublicInfo(address || "", storagePath);
    },
    enabled: true,
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60,
  });

  return result;
}

export function usePrismPublicStorageList(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-public-storage-list-${address}`],
    queryFn: () => {
      return collectPublicStorageInfo(address || "");
    },
    enabled: Boolean(address),
    refetchInterval: 5000,
    gcTime: 5000,
  });

  return result;
}
