/*--------------------------------------------------------------------------------------------------------------------*/
import { authenticate, config, currentUser } from "@onflow/fcl";
import { RAW_PARAMS } from "./network-config";

/*--------------------------------------------------------------------------------------------------------------------*/
type NetworkKey = "mainnet" | "testnet";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function loginFlow(
  network: NetworkKey,
  callback: (res: any) => void,
) {
  // TODO: update params to use necessary imports
  const params = RAW_PARAMS[network as keyof typeof RAW_PARAMS];
  config(params);

  currentUser.subscribe((user: any) => {
    callback(user);
  });

  //const auth = await fcl.authz;
  await authenticate();
}

export async function logoutFlow() {
  currentUser.unauthenticate();
}
