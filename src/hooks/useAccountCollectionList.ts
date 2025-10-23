/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getCollectionList } from "@/fetch/get-collections";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useAccountCollectionList(address: string | undefined | null) {
  const result = useQuery({
    queryKey: [`prism-public-collection-list-${address}`],
    queryFn: () => {
      return getCollectionList(address || "");
    },
    enabled: Boolean(address),
  });

  return result;
}
