/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QRCode from "react-qr-code";

import { TagBigFish } from "@/components/ui/tags";
import { TypeH2, TypeLabel } from "@/components/ui/typography";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import BasicAccountDetails from "@/components/ui/account-details";
import CopyText from "@/components/flowscan/CopyText";
import { isFindName } from "@/lib/validate";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountSidebarDisplay(props: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { details, id, address, network } = props;
  const { isLoading } = props;

  if (!address && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-prism-text-muted">Could not find account</p>
      </div>
    );
  }

  const qrData = `https://prism.flowscan.io/${network}/account/${id}`;
  const chevronIcon = isExpanded ? (
    <ChevronLeft className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  );

  const verticalLabel = isFindName(id as string) ? `${id}.find` : id;
  const isCollapsed = !isExpanded;
  const ariaLabel = `${isExpanded ? "Collapse" : "Expand"} sidebar`;
  const showFish = !isLoading && details && Number(details?.balance) > 10000;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between">
      {/* Toggle Button - Desktop only */}
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

      {/* Collapsed State - Desktop only */}
      {isCollapsed && (
        <div
          className="hidden flex-1 rotate-180 items-center justify-between px-6 py-6 md:flex"
          style={{ writingMode: "vertical-rl" }}
        >
          <div className={"inline-flex gap-2"}>
            {showFish && <TagBigFish balance={details?.balance} />}
          </div>

          <span className="text-prism-text inline-flex gap-2 text-lg">
            <span>Account</span>
            <span className={"text-prism-primary font-bold"}>
              {verticalLabel}
            </span>
            {isFindName(id as string) && (
              <span className={"text-prism-text-muted"}>({address})</span>
            )}
          </span>
        </div>
      )}

      {/* Expanded State - Always visible on mobile, toggleable on desktop */}
      <div
        className={cn(
          "flex h-full w-full flex-col gap-6 overflow-y-auto p-6",
          "lg:w-[24rem] lg:p-8",
          !isExpanded && "hidden md:hidden",
        )}
      >
        {/* Account Information */}
        <div className="flex flex-col gap-4">
          <>
            {isFindName(id as string) && (
              <div
                className={cn(
                  "flex w-full flex-row items-center justify-between gap-2",
                  "md:flex-col md:items-start",
                )}
              >
                <TypeLabel>Account:</TypeLabel>
                <div className="flex flex-row items-center gap-2">
                  <TypeH2 className="text-base break-all md:text-lg">
                    {id}
                  </TypeH2>
                  <CopyText
                    text={id as string}
                    className="flex-shrink-0 text-lg"
                  />
                </div>
              </div>
            )}

            {address && (
              <div
                className={cn(
                  "flex w-full flex-row items-center justify-between gap-2",
                  "md:flex-col md:items-start",
                )}
              >
                <TypeLabel>Address:</TypeLabel>
                <div className="flex flex-row items-center gap-2">
                  <TypeH2 className="text-base break-all md:text-lg">
                    {address}
                  </TypeH2>
                  <CopyText text={address} className="flex-shrink-0 text-lg" />
                </div>
              </div>
            )}
          </>
        </div>

        {/* QR Code */}
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

        {/* Account Information */}
        <div className="flex flex-col gap-4">
          {isLoading && <LoadingBlock title="Resolving account owner" />}

          <BasicAccountDetails address={address} />
        </div>
      </div>
    </div>
  );
}
