import { isAddress, isFindName, withPrefix } from "@/lib/validate";
import { fetchFindAddress } from "@/fetch/get-find-address";

export async function resolveAccountAddress(id: string) {
  if (isAddress(id)) {
    const owner = withPrefix(id);
    return {
      owner,
      status: "TAKEN",
    };
  }

  if (isFindName(id)) {
    const leaseStatus = await fetchFindAddress(id);
    if (leaseStatus) {
      const { owner, status } = leaseStatus;
      const prefixed = owner ? withPrefix(owner) : null;
      return {
        status,
        owner: prefixed,
      };
    }
  }

  return null;
}
