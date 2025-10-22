/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getStoredResource } from "@/fetch/get-stored-resource";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function useStoredResource(
  address: string | undefined | null,
  path: string,
) {
  return useQuery({
    queryKey: [`prism-stored-resource-${address}-${path}`],
    queryFn: () => {
      return getStoredResource(address || "", path);
    },
    enabled: Boolean(address),
    refetchInterval: false,
  });
}
