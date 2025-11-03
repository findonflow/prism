"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useBasicDetails } from "@/hooks/useBasicDetails";
import { Database, DatabaseZap, Wallet } from "lucide-react";
import { TypeLabel } from "@/components/ui/typography";
import Odometer from "@/components/flowscan/Odometer";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";
import { useFindLeases } from "@/hooks/useFindLeases";
import SimpleTag from "@/components/flowscan/SimpleTag";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function BasicAccountDetails(props: { address?: string }) {
  const { address } = props;

  const { data, isLoading, error } = useBasicDetails(address);

  const showData = !isLoading && Boolean(data);
  return (
    <div className={"flex w-full flex-col gap-4"}>
      <FindLeases address={address} />
      <div className={"flex w-full flex-col gap-4"}>
        {isLoading && <LoadingBlock title={"Loading basic details"} />}
        {showData && (
          <>
            {/*-- Balance --*/}
            <div className={"flex flex-col gap-1"}>
              <div className={"flex flex-row items-center gap-2"}>
                <Wallet className={"h-4 w-4"} />
                <TypeLabel>Balance:</TypeLabel>
              </div>
              <FlowTokens
                animated
                digits={6}
                value={data?.balance}
                iconClassName={"w-4 h-4"}
                className={"w-auto"}
              />
            </div>

            {/*-- Available Balance --*/}
            <div className={"flex flex-col gap-1"}>
              <div className={"flex flex-row items-center gap-2"}>
                <Wallet className={"h-4 w-4"} />
                <TypeLabel>Available Balance:</TypeLabel>
              </div>
              <FlowTokens
                animated
                digits={6}
                value={data?.availableBalance}
                iconClassName={"w-4 h-4"}
                className={"w-auto"}
              />
            </div>

            {/*-- Storage Used --*/}
            <div className={"flex flex-col gap-1"}>
              <div className={"flex flex-row items-center gap-2"}>
                <DatabaseZap className={"h-4 w-4"} />
                <TypeLabel>Storage Used:</TypeLabel>
              </div>
              <div className={"flex flex-row items-center justify-start gap-1"}>
                <Odometer value={data?.storageUsed} type={"storage"} />
              </div>
            </div>

            {/*-- Storage Available --*/}
            <div className={"flex flex-col gap-1"}>
              <div className={"flex flex-row items-center gap-2"}>
                <Database className={"h-4 w-4"} />
                <TypeLabel>Storage Available:</TypeLabel>
              </div>
              <div className={"flex flex-row items-center justify-start gap-1"}>
                <Odometer value={data?.storageCapacity} type={"storage"} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function FindLeases(props: { address?: string | null }) {
  const { address } = props;
  const { data, isPending } = useFindLeases(address);

  if (!address || (!isPending && !data)) {
    return null;
  }

  if (!isPending && data.length === 0) return null;

  return (
    <div className={"flex flex-row flex-wrap items-center justify-start gap-2"}>
      {isPending && (
        <LoadingBlock
          title={"Resolving address leases"}
          className={"text-sm"}
        />
      )}
      {!isPending &&
        data
          .sort((a: FINDLeaseInfo, b: FINDLeaseInfo) => {
            const aName = a.name || "";
            const bName = b.name || "";

            if (aName === bName) {
              return 0;
            }

            return aName > bName ? 1 : -1;
          })
          .map((item: FINDLeaseInfo) => {
            return (
              <SimpleTag
                key={item.name}
                label={
                  <span>
                    <b>{item.name}</b>.find
                  </span>
                }
                className={"text-prism-primary"}
              />
            );
          })}
    </div>
  );
}
