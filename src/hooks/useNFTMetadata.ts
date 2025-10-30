/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getAccountCoa } from "@/fetch/get-coa";
import { getNftMetadata } from "@/fetch/get-nft-metadata";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useNFTMetadata(
  address: string | null | undefined,
  path: string,
  id: string,
) {
  return useQuery({
    queryKey: [`prism-nft-metadata-${address}-${path}-${id}`],
    queryFn: () => {
      if (!address) {
        return null;
      }
      return getNftMetadata(address, path, id);
    },
    enabled: Boolean(address),
  });
}
