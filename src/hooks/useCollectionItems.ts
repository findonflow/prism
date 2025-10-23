/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getCollectionItems } from "@/fetch/get-collections";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useCollectionItems(
  address: string | undefined | null,
  storagePath: string,
  items: string[],
) {
  const result = useQuery({
    queryKey: [`prism-public-collection-items-${address}-${storagePath}`],
    queryFn: () => {
      return getCollectionItems(address || "", storagePath, items);
    },
    enabled: Boolean(address),
  });

  return result;
}
