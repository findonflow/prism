"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useQuery } from "@tanstack/react-query";
import { getCollectionList } from "@/fetch/get-collections";
import { useParams } from "next/navigation";
import getTokenRegistry from "@/fetch/getTokenRegistry";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useTokenRegistry() {
  const { network } = useParams();

  return useQuery({
    queryKey: [`prism-token-registry-${network}`],
    queryFn: () => {
      return getTokenRegistry(network as string);
    },
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function useTokenList(address: string | undefined | null) {
  const enabled = Boolean(address)

  return useQuery({
    queryKey: [`prism-token-list-${address}`],
    queryFn: () => {
      return getCollectionList(address || "", (item) => item.isVault);
    },
    enabled,
  });
}
