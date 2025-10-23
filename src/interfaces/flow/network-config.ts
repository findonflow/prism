/*--------------------------------------------------------------------------------------------------------------------*/
const appDetails = {
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "app.detail.title": "Prism: Flow Account Explorer",
  "app.detail.description":
    "Explore Flow accounts in fine details using data directly from chain!",
};

/*--------------------------------------------------------------------------------------------------------------------*/
export const RAW_PARAMS = {
  testnet: {
    env: "testnet",
    "flow.network": "testnet",
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "discovery.authn.endpoint":
      "https://fcl-discovery.onflow.org/api/testnet/authn",

    "walletconnect.projectId": "a0414f2916cf9b05d0c49594fbb4746b",

    "fcl.eventsPollRate": 2500,
    ...appDetails,

    "0xLockedTokens": "0x95e019a17d0e23d7",
    "0xFungibleToken": "0x9a0766d93b6608b7",
    "0xNonFungibleToken": "0x631e88ae7f1d7c20",
    "0xFUSD": "0xe223d8a629e49c68",
    "0xMetadataViews": "0x631e88ae7f1d7c20",
    //"discovery.wallet.method": "POP/RPC",
    "0xFIND": "0xa16ab1d0abde3625",
  },
  mainnet: {
    env: "mainnet",
    "flow.network": "mainnet",
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",

    "walletconnect.projectId": "a0414f2916cf9b05d0c49594fbb4746b",

    "fcl.eventsPollRate": 2500,
    ...appDetails,

    "0xLockedTokens": "0x8d0e87b65159ae63",
    "0xFungibleToken": "0xf233dcee88fe0abe",
    "0xNonFungibleToken": "0x1d7e57aa55817448",
    "0xMetadataViews": "0x1d7e57aa55817448",
    "0xFUSD": "0x3c5959b568896393",
    // "discovery.wallet.method": "POP/RPC",
    "0xFIND": "0x097bafa4e0b48eef",
  },
};
