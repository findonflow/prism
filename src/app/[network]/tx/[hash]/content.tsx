"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeLabel } from "@/components/ui/typography";
import { useSurge } from "@/hooks/useSurge";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionDetails() {
  const { hash } = useParams();
  const {
    data,
    isLoading,
    isSealed,
    isPending,
    isExecuted,
    statusCode,
    errorMessage,
  } = useTransactionDetails(hash as string);

  const { data: surgeFactor, isPending: fetchingSurge } = useSurge(
    data?.blockId,
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <TypeLabel>Transaction Details:</TypeLabel>

      {isLoading && <LoadingBlock title="Loading transaction details..." />}

      {data && (
        <div className="flex flex-col gap-4">
          {/* Status Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <TypeLabel>Hash:</TypeLabel>
              <span className="text-sm font-bold">{hash}</span>
            </div>

            <div className="flex flex-row gap-2">
              <TypeLabel>Status:</TypeLabel>
              <span className="text-sm font-bold">
                {isPending && "⏳ Pending"}
                {isExecuted && "✓ Executed"}
                {isSealed && "✓ Sealed"}
              </span>
            </div>

            {statusCode !== undefined && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Status Code:</TypeLabel>
                <span className="text-sm font-bold">{statusCode}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Error:</TypeLabel>
                <span className="text-sm font-bold text-red-500">
                  {errorMessage}
                </span>
              </div>
            )}
          </div>

          <hr className="border-gray-400/50" />

          {/* Accounts Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Accounts</h3>

            {data.proposalKey && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Proposer:</TypeLabel>
                <span className="text-sm font-bold">
                  {data.proposalKey.address}
                </span>
              </div>
            )}

            {data.payer && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Payer:</TypeLabel>
                <span className="text-sm font-bold">{data.payer}</span>
              </div>
            )}

            {data.authorizers && data.authorizers.length > 0 && (
              <div className="flex flex-col gap-1">
                <TypeLabel>Authorizers (Signers):</TypeLabel>
                {data.authorizers.map((authorizer: string, index: number) => (
                  <span key={index} className="ml-4 text-sm font-bold">
                    • {authorizer}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="border-gray-400/50" />

          {/* Execution Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Execution</h3>

            {data.gasLimit !== undefined && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Gas Limit:</TypeLabel>
                <span className="text-sm font-bold">{data.gasLimit}</span>
              </div>
            )}

            {data.events && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Events Emitted:</TypeLabel>
                <span className="text-sm font-bold">{data.events.length}</span>
              </div>
            )}

            {data.computationUsed !== undefined && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Computation Used:</TypeLabel>
                <span className="text-sm font-bold">
                  {data.computationUsed}
                </span>
              </div>
            )}

            {surgeFactor && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Surge Factor:</TypeLabel>
                <span className="text-sm font-bold">{surgeFactor}</span>
              </div>
            )}

            {data.memoryUsed !== undefined && (
              <div className="flex flex-row gap-2">
                <TypeLabel>Memory Used:</TypeLabel>
                <span className="text-sm font-bold">{data.memoryUsed}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-400/50" />

          {/* Full Data Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Full Transaction Data</h3>
            <pre className="bg-prism-level-2 overflow-auto p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
