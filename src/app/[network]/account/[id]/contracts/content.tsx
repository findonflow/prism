"use client";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { ExtraTag, ExtraTagType } from "@/components/flowscan/ExtraTag";
import FatRow from "@/components/flowscan/FatRow";
import JumpingDots from "@/components/flowscan/JumpingDots";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import useAccountResolver from "@/hooks/useAccountResolver";
import { cn } from "@/lib/utils";
import { Code, Globe } from "lucide-react";
import { useParams } from "next/navigation";

export default function AccountContractsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { data, isPending } = useAccountDetails(address);
  const haveData = !isPending && Boolean(data?.contracts);

  const contractList = Object.keys(data?.contracts || {});
  const haveContracts = haveData && contractList.length > 0;

  if (!address)
    return <p className={"opacity-50"}>Unable to resolve account address.</p>;
  return (
    <div
      className={
        "fat-row-column flex w-full flex-col items-start justify-start gap-px"
      }
    >
      {isPending && <JumpingDots />}
      {haveContracts &&
        contractList.map((key) => {
          const code = data?.contracts[key];
          const numberOfLines = code?.split("\r\n").length || 0;

          const details = (
            <div
              className={
                "flex w-full flex-col items-start justify-start gap-2 bg-neutral-500 p-4"
              }
            >
              <div className={"flex w-full flex-col gap-4"}>
                <CodeBlock code={code || ""} />
              </div>
            </div>
          );

          return (
            <FatRow id={"contract"} details={details} className={[]} key={key}>
              <div
                className={cn(
                  "relative flex w-full flex-col items-start justify-start gap-4 p-4",
                  "md:gap-3 md:p-4"
                )}
              >
                <div className={"flex w-full flex-row justify-between gap-2"}>
                  <a
                    key={key}
                    href={`/contract/A.${address.slice(2)}.${key}?tab=deployments`}
                  >
                    <ExtraTag
                      title={`View ${key} contract on Flowscan`}
                      className={"text-green-300"}
                      label={key}
                      type={ExtraTagType.system_fee}
                      category={<Globe className={"h-3 w-3"} />}
                      isLink
                    />
                  </a>
                  <span>
                    <ExtraTag
                      title={`Lines of code: ${numberOfLines}`}
                      label={numberOfLines}
                      category={<Code className={"h-4 w-4"} />}
                      type={ExtraTagType.system_fee}
                    />
                  </span>
                </div>
              </div>
            </FatRow>
          );
        })}
      {!haveContracts && !isPending && (
        <p className={"opacity-50"}>
          This account does not have any contracts deployed to it&#39;s storage
        </p>
      )}
    </div>
  );
}
