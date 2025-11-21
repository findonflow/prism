/*--------------------------------------------------------------------------------------------------------------------*/
import { getSingleCollectionDetails } from "@/fetch/get-collections";
import { useQuery } from "@tanstack/react-query";
import { getCollectionRegistry } from "@/fetch/getTokenRegistry";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/

export function useCollectionDetails(
  address: string | undefined | null,
  storagePath: string,
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

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
export function useCollectionRegistry() {
  const { network } = useParams();

  return useQuery({
    queryKey: [`prism-token-registry-${network}`],
    queryFn: () => {
      return getCollectionRegistry(network as string);
    },
    gcTime: 1000 * 60 * 60,
  });
}
