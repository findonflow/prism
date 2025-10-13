"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { config } from "@onflow/fcl";

/*--------------------------------------------------------------------------------------------------------------------*/
function initFCL(network: string) {
  config({
    "accessNode.api": `https://rest-${network}.onflow.org`,
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function QueryProvider(props: {
  children: React.ReactNode;
  network: string;
}) {
  const { children, network } = props;

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

  useEffect(() => {
    initFCL(network);
  }, [network]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
