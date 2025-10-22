/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { resolveAccountAddress } from "@/lib/resolver";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function useAccountResolver(id: string) {
  const { data, isPending, error } = useQuery({
    queryKey: ["account-resolver", id],
    queryFn: () => resolveAccountAddress(id),
    refetchInterval: false
  });
  return { data, isPending, error };
}
