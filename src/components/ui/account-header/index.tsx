"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import QRCode from "react-qr-code";
import { TypeH2, TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import BasicAccountDetails from "@/components/ui/account-details";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useParams } from "next/navigation";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountHeader() {
  const { id, network } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  if (!address && !isResolving) {
    return <p>Could not find find account with this id</p>;
  }

  const qrData = `https://prism.flowscan.io/${network}/account/${id}`;

  return (
    <div
      className={"flex flex-col w-full space-y-6 justify-between items-start py-4"}
    >
      <div className={"w-32 aspect-square"}>
        <QRCode
          size={64}
          value={qrData}
          viewBox={"0 0 256 256"}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      <div className={cn("flex flex-col items-start justify-start gap-4 w-full", "md:w-auto")}>
        <div className={"flex flex-col items-start justify-start w-full"}>
          {isResolving && <LoadingBlock title={"Resolving account owner"} />}
          {address && (
            <>
              <TypeLabel>Account:</TypeLabel>
              <div className={"flex flex-row items-center justify-start gap-3"}>
                <TypeH2>{address}</TypeH2>
                <CopyText text={address || ""} className={"text-lg"} />
              </div>
            </>
          )}
        </div>
        <BasicAccountDetails address={address || ""}/>
      </div>
    </div>
  );
}
