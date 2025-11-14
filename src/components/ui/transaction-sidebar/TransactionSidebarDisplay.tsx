"use client";

/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QRCode from "react-qr-code";
import { TypeH1, TypeH2, TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";
import { useSurge } from "@/hooks/useSurge";
import {
  TagFlowStatus,
  TagGas,
  TagKey,
  TagMultisig,
  TagNonce,
  TagSurge,
} from "@/components/ui/tags";
import { extractCode } from "@/consts/error-codes";
import { Timestamp } from "@/components/flowscan/Timestamp";
import { TagFlowAccount } from "@/components/ui/tags/client";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
export type TransactionSidebarDisplayProps = {
  data: ReturnType<typeof useTransactionDetails>["data"];
  isLoading: boolean;
  isSealed: boolean;
  isExecuted: boolean;
  isPending: boolean;
  errorMessage?: string;
  hash: string;
};

/*--------------------------------------------------------------------------------------------------------------------*/
export function TransactionSidebarDisplay(
  props: TransactionSidebarDisplayProps,
) {
  const { hash, data, errorMessage } = props;
  const { isLoading, isSealed, isExecuted, isPending } = props;

  const [isExpanded, setIsExpanded] = useState(true);
  const { network } = useParams();
  const { data: surgeFactor } = useSurge(data?.blockId);

  const qrData = `https://prism.flowscan.io/${network}/tx/${hash}`;
  const chevronIcon = isExpanded ? (
    <ChevronLeft className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  );

  console.log({ hash,data });

  const isCollapsed = !isExpanded;
  const ariaLabel = `${isExpanded ? "Collapse" : "Expand"} sidebar`;

  const statusLabel = isPending
    ? "Pending"
    : isExecuted
      ? "Executed"
      : isSealed
        ? "Sealed"
        : "Unknown";

  const statusTag = (
    <div className={"flex flex-row gap-2"}>
      <TagFlowStatus status={statusLabel} />
      {errorMessage && (
        <TagFlowStatus
          status={statusLabel}
          error={errorMessage}
          errorCode={extractCode(errorMessage)}
        />
      )}
      <TagMultisig signers={data?.authorizers} />
    </div>
  );

  if (isPending) {
    return <LoadingBlock title="Loading transaction details..." />;
  }

  if (!data) {
    return <div>No transaction data available</div>;
  }

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
        <div className="vertical-text hidden flex-1 rotate-180 items-center justify-between gap-10 truncate px-6 py-6 md:flex">
          <div className={"flex flex-row"}>{statusTag}</div>

          <span className="text-prism-text inline-flex gap-2 truncate text-lg">
            <span>Transaction</span>
            <span className="text-prism-primary truncate font-bold">{hash}</span>
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
        <div className="flex h-full flex-col items-start gap-4">
          <div
            className={cn(
              "flex w-full flex-col items-start justify-between gap-2",
            )}
          >
            <TypeH1 className={"mb-2 text-2xl font-extralight opacity-50"}>
              Transaction
            </TypeH1>
            <TypeLabel>Transaction Id:</TypeLabel>
            <div className="flex w-full flex-row items-start gap-2">
              <CopyText text={hash} className="flex-shrink-0 text-lg" />
              <TypeH2 className="text-md text-left font-normal break-all">
                {hash}
              </TypeH2>
            </div>
          </div>

          <div className="mx-auto aspect-square w-3/5 md:w-40">
            <QRCode
              size={64}
              value={qrData}
              viewBox="0 0 256 256"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TypeLabel>Status:</TypeLabel>
            {statusTag}
          </div>

          {data.authorizers && data.authorizers.length > 0 && (
            <div className="flex w-full flex-col justify-between">
              <div className={"flex flex-row flex-wrap gap-1"}>
                <TypeLabel>Authorizers:</TypeLabel>
                <div className={"flex w-full"}>
                  <div className="flex flex-row flex-wrap gap-2">
                    {data.authorizers?.map((account: string) => (
                      <TagFlowAccount address={account} key={account} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.proposalKey && (
            <div className="flex w-full flex-col items-start gap-4">
              <hr className="w-full border-gray-400/20" />

              <div className="flex w-full flex-col items-start gap-2">
                <div
                  className={
                    "flex w-full flex-row flex-wrap justify-between gap-1"
                  }
                >
                  <TypeLabel>Payer:</TypeLabel>
                  <TagFlowAccount address={data.payer} />
                </div>

                <div
                  className={
                    "flex w-full flex-row flex-wrap justify-between gap-1"
                  }
                >
                  <TypeLabel>Proposer:</TypeLabel>
                  <TagFlowAccount address={data.proposalKey.address} />
                </div>

                <div
                  className={
                    "flex w-full flex-row flex-wrap justify-between gap-1"
                  }
                >
                  <TypeLabel>Proposer Params:</TypeLabel>
                  <div className={"flex flex-row justify-end gap-1"}>
                    <TagNonce nonce={data.proposalKey.sequenceNumber} />
                    <TagKey keyIndex={data.proposalKey.keyId} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.gasLimit !== undefined && (
            <div className="flex w-full flex-col items-start gap-4">
              <hr className="w-full border-gray-400/20" />

              <div className="flex w-full flex-col items-start gap-1">
                <div className="flex w-full flex-row justify-between">
                  <TypeLabel>Gas:</TypeLabel>
                  <TagGas gas={data.gasLimit} />
                </div>
                {surgeFactor && (
                  <div className="flex w-full flex-row justify-between">
                    <TypeLabel>Surge Factor:</TypeLabel>
                    <TagSurge surge={surgeFactor} />
                  </div>
                )}
              </div>
            </div>
          )}

          {data.timestamp && (
            <div className="flex w-full flex-col items-start gap-4">
              <hr className="w-full border-gray-400/20" />
              <div className="flex w-full flex-row justify-between mb-4">
                <TypeLabel>Timestamp:</TypeLabel>
                <Timestamp time={data.timestamp} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
