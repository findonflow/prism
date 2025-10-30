interface FlowKey {
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

interface FlowAccountDetails {
  keys: FlowKey[];
  contracts: { [key: string]: string };
}

interface FlowKeyFormatted {
  hashAlgorithm?: string;
  index?: string;
  key?: string;
  revoked?: boolean;
  signatureAlgorithm?: string;
  weight?: number;
  sequenceNumber?: number;
}

interface FlowPublicPath {
  address: string;
  path: string;
  targetPath: string;
}

interface FlowPublicPathInfo extends FlowPublicPath {
  balance?: string;
  isBalanceCap?: boolean;
  isCollectionCap?: boolean;
  tokenIDs: string[];
  type: any;
}

interface FlowPathInfo {
  domain: string;
  identifier: string;
}

interface FlowDisplayInfo {
  name?: string;
  squareImage: {
    file: {
      url?: string;
      cid?: string;
      path?: string;
    };
    mediaType?: string;
  };
}

interface FlowStorageInfo {
  address: string;
  balance?: string;
  collectionData?: {
    publicPath: FlowPathInfo;
    storagePath: FlowPathInfo;
  };
  display?: FlowDisplayInfo;
  isNFTCollection: boolean;
  isResource: boolean;
  isVault: boolean;
  path: string;
  tokenIDs?: Array<string>;
  type: {
    initializers: Array<any>;
    kind: string;
    type: string;
    typeID: string;
  };
}

interface FlowEpochInfo {
  currentEpochCounter: string;
  currentEpochPhase: string;
}

interface FlowNodeInfo {
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

interface FlowDelegatorInfo {
  id: string;
  nodeID: string;
  nodeInfo: FlowNodeInfo;
  tokensCommitted: string;
  tokensStaked: string;
  tokensUnstaking: string;
  tokensRewarded: string;
  tokensUnstaked: string;
  tokensRequestedToUnstake: string;
}

interface FlowStakingInfo {
  stakingInfo: {
    epochInfo: FlowEpochInfo;
    lockedAccountInfo: any;
    nodeInfos: Array<any>;
    delegatorInfos: Array<FlowDelegatorInfo>;
    machineAccounts: any;
  };
}

interface FlowOwnerAccountInfo {
  display?: any;
  isOwnedAccountExists: boolean;
  owner?: string;
  parents: Array<FlowParentAccount>;
}

interface FlowParentAccount {
  address?: string;
  childAccount: {
    filter: any;
    factory: any;
  };
  isClaimed: boolean;
}

interface ValueType {
  type?: string | null;
  kind?: string | null;
  typeID?: string | null;
  fields?: FieldType | null;
  initializers?: Array<any> | null;
}

interface FieldType {
  id: string;
  type?: {
    kind: string;
  };
}

interface FlowChildAccount {
  address: string;
  display?: {
    description?: string;
    name?: string;
    thumbnail?: {
      url?: string;
    };
  };
  factorySupportedTypes?: Array<{
    kind: string;
    type: ValueType;
    authorization: {
      type: {
        kind?: string;
        typeID: string;
        types: Array<{
          ValueType;
        }>;
      };
      kind: string;
      entitlements: Array<ValueType>;
    };
  }>;
  filterDetails: {
    type: ValueType;
    allowedTypes: Array<FieldType>;
  };
  managerFilterDetails: {
    type: ValueType;
  };
}

interface FINDLeaseInfo {
  name?: string;
  address?: string;
  cost?: string;
  status?: string;
  validUntil?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
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
  description: string;
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

interface NFTCollection {
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
