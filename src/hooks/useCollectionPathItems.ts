/*--------------------------------------------------------------------------------------------------------------------*/
import { getCollectionPathItems } from "@/fetch/get-collections";
import { useQuery } from "@tanstack/react-query";

/*--------------------------------------------------------------------------------------------------------------------*/

export function useCollectionPathItems(
  address: string | undefined | null,
  storagePath: string
) {
  const result = useQuery({
    queryKey: [`prism-public-collection-path-items-${address}-${storagePath}`],
    queryFn: () => {
      return getCollectionPathItems(address || "", storagePath);
    },
    enabled: Boolean(address),
  });

  return result;
}
