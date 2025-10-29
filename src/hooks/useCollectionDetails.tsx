/*--------------------------------------------------------------------------------------------------------------------*/
import {
  getCollectionPathItems,
  getSingleCollectionDetails,
  reconstructList,
} from "@/fetch/get-collections";
import { useQuery } from "@tanstack/react-query";

/*--------------------------------------------------------------------------------------------------------------------*/

export function useCollectionDetails(
  address: string | undefined | null,
  storagePath: string
) {
  const result = useQuery({
    queryKey: [
      `prism-public-single-collection-details-${address}-${storagePath}`,
    ],
    queryFn: () => {
      return getSingleCollectionDetails(address || "", storagePath);
    },
    enabled: Boolean(address),
  });

  return result;
}
