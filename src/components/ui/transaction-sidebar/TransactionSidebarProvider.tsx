"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import type { ReactNode } from "react";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import type { TransactionSidebarDisplayProps } from "@/components/ui/transaction-sidebar/TransactionSidebarDisplay";

/*--------------------------------------------------------------------------------------------------------------------*/
type TransactionSidebarProviderProps = {
  hash: string;
  render: (props: TransactionSidebarDisplayProps) => ReactNode;
};

/*--------------------------------------------------------------------------------------------------------------------*/
export function TransactionSidebarProvider(
  props: TransactionSidebarProviderProps,
) {
  const { hash, render } = props;

  const { data, isLoading, isSealed, isExecuted, isPending } =
    useTransactionDetails(hash);

  return (
    <>
      {render({
        data,
        isLoading,
        isSealed,
        isExecuted,
        isPending,
        hash,
        errorMessage: data?.errorMessage,
      })}
    </>
  );
}
