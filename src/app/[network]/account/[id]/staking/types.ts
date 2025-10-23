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
