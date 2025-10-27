import { query } from "@onflow/fcl";
import { cadenceGetFindLeases } from "@/fetch/cadence/cadence-get-find-leases";

export default function getFindLeases(address?: string | null) {
  if (!address) {
    return null;
  }
  try {
    return query({
      cadence: cadenceGetFindLeases,
      args: (arg, t) => [arg(address, t.Address)],
    });
  } catch (error) {
    return null;
  }
}
