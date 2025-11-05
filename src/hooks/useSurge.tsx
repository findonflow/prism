/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import fetchSurgeFactor from "@/fetch/fetchSurgeFactor";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useSurge(blockId?: string | null) {
  const { isPending, error, data } = useQuery({
    queryKey: [blockId || "empty"],
    enabled: blockId !== null,
    queryFn: () => {
      if (blockId === null) {
        return null;
      }
      return fetchSurgeFactor(blockId);
    },
    gcTime: blockId ? Infinity : 0,
    refetchInterval: blockId ? false : 2000,
  });

  return { data, error, isPending };
}
