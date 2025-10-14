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