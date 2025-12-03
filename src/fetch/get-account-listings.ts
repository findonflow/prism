import { query } from "@onflow/fcl";
import { cadenceGetAccountListings } from "./cadence/cadence-get-listings";

export default function getAccountListings(address?: string | null) {
  if (!address) {
    return null;
  }
  try {
    return query({
      cadence: cadenceGetAccountListings,
      args: (arg, t) => [arg(address, t.Address)],
    });
  } catch (error) {
    return null;
  }
}
