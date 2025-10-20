import { configureFlow, RAW_PARAMS } from "@interfaces/flow/network-config";
import { authenticate, currentUser } from "@onflow/fcl";

type NetworkKey = "mainnet" | "testnet";

export async function loginFlow(
  network: NetworkKey,
  callback: (res: any) => void
) {
  configureFlow(RAW_PARAMS[network as keyof typeof RAW_PARAMS]);

  currentUser.subscribe((user: any) => {
    console.log("Current user:", user);
    callback(user);
  });

  //const auth = await fcl.authz;
  await authenticate();

  //console.log(JSON.stringify(auth), JSON.stringify(fcl.WalletUtils));
}

export async function logoutFlow() {
  currentUser.unauthenticate();
  console.log("User logged out");
}
