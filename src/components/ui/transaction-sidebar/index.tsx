/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle, Key } from "lucide-react";
import QRCode from "react-qr-code";
import { TypeH2, TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";
import SimpleTag from "@/components/flowscan/SimpleTag";
import TagAccount from "@/components/flowscan/TagAccount";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { useSurge } from "@/hooks/useSurge";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { hash, network } = useParams();

  const {
    data,
    isLoading,
    isSealed,
    isExecuted,
    isPending,
    computationUsed,
    memoryUsed,
  } = useTransactionDetails(hash as string);

  const { data: surgeFactor } = useSurge(data?.blockId);

  const qrData = `https://prism.flowscan.io/${network}/tx/${hash}`;
  const chevronIcon = isExpanded ? (
    <ChevronLeft className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  );

  const isCollapsed = !isExpanded;
  const ariaLabel = `${isExpanded ? "Collapse" : "Expand"} sidebar`;

  const statusLabel = isPending
    ? "Pending"
    : isExecuted
      ? "Executed"
      : isSealed
        ? "Sealed"
        : "Unknown";

  const showStatusIcon = isSealed || isExecuted;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute top-4 -right-3 z-10",
          "hidden h-6 w-6 items-center justify-center md:flex",
          "border-prism-border bg-prism-level-3 rounded-full border",
          "hover:bg-prism-interactive transition-all",
        )}
        aria-label={ariaLabel}
      >
        {chevronIcon}
      </button>

      {isCollapsed && (
        <div
          className="hidden flex-1 rotate-180 items-center justify-between px-6 py-6 md:flex"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-prism-text inline-flex gap-2 text-lg">
            <span>Transaction</span>
            <span className="text-prism-primary font-bold">{hash}</span>
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex h-full w-full flex-col gap-6 overflow-y-auto p-6",
          "lg:w-[24rem] lg:p-8",
          !isExpanded && "hidden md:hidden",
        )}
      >
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex w-full flex-row items-center justify-between gap-2",
              "md:flex-col md:items-start",
            )}
          >
            <TypeLabel>Transaction Hash:</TypeLabel>
            <div className="flex flex-row items-center gap-2">
              <TypeH2 className="text-base break-all md:text-lg">{hash}</TypeH2>
              <CopyText text={hash as string} className="flex-shrink-0 text-lg" />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center md:justify-start">
          <div className="aspect-square w-3/7 md:w-32">
            <QRCode
              size={64}
              value={qrData}
              viewBox="0 0 256 256"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>

        {isLoading && <LoadingBlock title="Loading transaction details..." />}

        {data && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TypeLabel>Status:</TypeLabel>
              <SimpleTag
                label={statusLabel}
                category={showStatusIcon ? <CheckCircle className="h-4 w-4" /> : undefined}
                className={cn(
                  showStatusIcon && "text-green-500",
                  isPending && "text-yellow-500",
                )}
              />
            </div>

            <hr className="border-gray-400/50" />

            <div className="flex flex-col gap-2">
              <TypeLabel>Accounts:</TypeLabel>

              {data.proposalKey && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-prism-text-muted">Proposer:</span>
                  <TagAccount address={data.proposalKey.address} />
                  <div className="ml-4 flex flex-row gap-2">
                    <SimpleTag
                      label={`Seq: ${data.proposalKey.sequenceNumber}`}
                      category={<Key className="h-3 w-3" />}
                      className="text-xs text-gray-500"
                    />
                    <SimpleTag
                      label={`Key: ${data.proposalKey.keyId}`}
                      category={<Key className="h-3 w-3" />}
                      className="text-xs text-gray-500"
                    />
                  </div>
                </div>
              )}

              {data.payer && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-prism-text-muted">Payer:</span>
                  <TagAccount address={data.payer} />
                </div>
              )}

              {data.authorizers && data.authorizers.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-prism-text-muted">Authorizers:</span>
                  {data.authorizers.map((authorizer: string, index: number) => (
                    <TagAccount key={index} address={authorizer} />
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-400/50" />

            <div className="flex flex-col gap-2">
              <TypeLabel>Execution:</TypeLabel>

              {data.gasLimit !== undefined && (
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-xs text-prism-text-muted">Gas Limit:</span>
                  <span className="text-sm font-bold">{data.gasLimit}</span>
                </div>
              )}

              {computationUsed !== undefined && (
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-xs text-prism-text-muted">Execution Effort:</span>
                  <span className="text-sm font-bold">{computationUsed}</span>
                </div>
              )}

              {memoryUsed !== undefined && (
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-xs text-prism-text-muted">Memory Used:</span>
                  <span className="text-sm font-bold">{memoryUsed}</span>
                </div>
              )}

              {surgeFactor && (
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-xs text-prism-text-muted">Surge Factor:</span>
                  <span className="text-sm font-bold">{surgeFactor}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
