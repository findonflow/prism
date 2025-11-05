/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as fcl from "@onflow/fcl";

/*--------------------------------------------------------------------------------------------------------------------*/
async function fetchTransactionBody(hash: string) {
  const res = await fcl.send([fcl.getTransaction(hash)]);
  return fcl.decode(res);
}

/*--------------------------------------------------------------------------------------------------------------------*/
async function fetchTransactionStatus(hash: string) {
  const res = await fcl.send([fcl.getTransactionStatus(hash)]).then(fcl.decode);

  const blockData = await fcl.block({
    id: res.blockId,
  });

  return { ...res, timestamp: blockData.timestamp };
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function useTransactionDetails(hash: string) {
  const [txResult, setTxResult] = useState<any>(null);

  const { data: txBody } = useQuery({
    queryKey: ["transaction-body", hash],
    queryFn: () => fetchTransactionBody(hash),
    enabled: Boolean(hash),
  });

  const { data: txStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["transaction-status", hash],
    queryFn: () => fetchTransactionStatus(hash),
    enabled: Boolean(hash),
    refetchInterval:
      txResult?.status === fcl.TransactionExecutionStatus.SEALED ? false : 2000,
  });

  useEffect(() => {
    if (!hash) return;

    const unsubscribe = fcl.tx(hash).subscribe(async (result: any) => {
      setTxResult(result);
      refetchStatus();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [hash, refetchStatus]);

  const statusVal = txResult?.status ?? txStatus?.status;

  return {
    data: {
      ...txBody,
      ...txStatus,
      ...txResult,
    },
    isLoading: !txBody || !txStatus,
    isSealed: statusVal === fcl.TransactionExecutionStatus.SEALED,
    isExecuted: statusVal === fcl.TransactionExecutionStatus.EXECUTED,
    isPending: statusVal === fcl.TransactionExecutionStatus.PENDING,
    statusCode: txResult?.statusCode ?? txStatus?.statusCode,
    errorMessage: txResult?.errorMessage ?? txStatus?.errorMessage,
    computationUsed: txStatus?.computationUsed ?? txResult?.computationUsed,
    memoryUsed: txStatus?.memoryUsed ?? txResult?.memoryUsed,
  };
}
