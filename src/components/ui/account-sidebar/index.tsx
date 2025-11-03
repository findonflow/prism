"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import QRCode from "react-qr-code";
import { TypeH2, TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import BasicAccountDetails from "@/components/ui/account-details";
import useAccountResolver from "@/hooks/useAccountResolver";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { id, network } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  if (!address && !isResolving) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-prism-text-muted">Could not find account</p>
      </div>
    );
  }

  const qrData = `https://prism.flowscan.io/${network}/account/${id}`;

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Toggle Button - Desktop only */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute -right-3 top-4 z-10",
          "hidden md:flex h-6 w-6 items-center justify-center",
          "rounded-full border border-prism-border bg-prism-level-3",
          "transition-all hover:bg-prism-interactive",
        )}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Collapsed State - Desktop only */}
      {!isExpanded && (
        <div className="hidden md:flex h-full items-center justify-center px-2 py-6">
          <div
            className="flex items-center justify-center"
            style={{ writingMode: "vertical-rl" }}
          >
            <span className="text-sm font-semibold text-prism-text">
              Account {id}
            </span>
          </div>
        </div>
      )}

      {/* Expanded State - Always visible on mobile, toggleable on desktop */}
      <div className={cn(
        "flex h-full flex-col gap-6 overflow-y-auto",
        "p-0 md:p-6",
        !isExpanded && "hidden md:hidden"
      )}>
        {/* QR Code */}
        <div className="flex w-full justify-center md:justify-start">
          <div className="w-32 aspect-square">
            <QRCode
              size={64}
              value={qrData}
              viewBox="0 0 256 256"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="flex flex-col gap-4">
          {isResolving && <LoadingBlock title="Resolving account owner" />}
          
          {address && (
            <>
              <div className="flex flex-col gap-2">
                <TypeLabel>Account:</TypeLabel>
                <div className="flex flex-row items-start gap-2">
                  <TypeH2 className="break-all text-base md:text-lg flex-1">{address}</TypeH2>
                  <CopyText text={address} className="text-lg flex-shrink-0" />
                </div>
              </div>

              <BasicAccountDetails address={address} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
