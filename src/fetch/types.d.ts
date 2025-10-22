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

interface FlowPathInfo{
  domain: string;
  identifier: string;
}

interface FlowStorageInfo {
  address: string;
  balance?: string;
  collectionData?: {
    publicPath: FlowPathInfo;
    storagePath: FlowPathInfo;
  }
  display?: {
    name?: string;
    squareImage: {
      file: {
        url?: string;
        cid?: string;
        path?: string;
      },
      mediaType?: string;
    }
  },
  isNFTCollection: boolean;
  isResource: boolean;
  isVault: boolean;
  path: string;
  tokenIDs?: Array<string>;
  type: {
    initializers: Array<any>,
    kind: string;
    type: string;
    typeID: string;
  }
}