"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { config } from "@onflow/fcl";
import { FIND } from "@/lib/address-book";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
function initFCL(network: string) {
  const key = network as keyof typeof FIND;

  config({
    "accessNode.api": `https://rest-${network}.onflow.org`,
    "0xFIND": FIND[key],
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function QueryProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error?.response?.status === 401) {
              // Refresh the page if the token expires
              location.reload();
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function FCLProvider() {
  const { network } = useParams();

  useEffect(() => {
    if (network) {
      initFCL(network as string);
    }
  }, [network]);

  return null;
}
