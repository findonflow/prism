/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getCollectionList } from "@/fetch/get-collections";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useAccountCollectionList(address: string | undefined | null) {
  return useQuery({
    queryKey: [`prism-public-collection-list-${address}`],
    queryFn: () => {
      return getCollectionList(address || "", (item) => item.isNFTCollection);
    },
    enabled: Boolean(address),
  });
}
