import { account } from "@onflow/fcl";
/*--------------------------------------------------------------------------------------------------------------------*/

export async function getAccountDetails(
  address: string,
): Promise<FlowAccountDetails | null> {
  try {
    return account(address);
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
}
