"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useBasicDetails } from "@/hooks/useBasicDetails";
import { Database, DatabaseZap, Wallet } from "lucide-react";
import { TypeLabel } from "@/components/ui/typography";
import Odometer from "@/components/flowscan/Odometer";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { useFindLeases } from "@/hooks/useFindLeases";
import { cn } from "@/lib/utils";
import { TagDomain } from "@/components/ui/tags/client";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function BasicAccountDetails(props: {
  address?: string | null;
}) {
  const { address } = props;

  const { data, isLoading, error } = useBasicDetails(address);

  const showData = !isLoading && Boolean(data);
  if (!address) {
    return null;
  }

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <FindLeases address={address} />
      <div className={"flex w-full flex-col gap-2 md:gap-4"}>
        {isLoading && <LoadingBlock title={"Loading basic details"} />}
        {showData && (
          <>
            <div className={"flex w-full flex-row justify-start gap-10"}>
              <BalanceBlock title={"Balance"} balance={data?.balance} />
              <BalanceBlock
                title={"Available Balance"}
                balance={data?.availableBalance}
              />
            </div>

            <div className={"flex w-full flex-row justify-start gap-10"}>
              <StorageBlock
                active
                size={data?.storageUsed}
                title={"Storage Used"}
              />
              <StorageBlock
                size={data?.storageCapacity}
                title={"Storage Available"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function StorageBlock(props: {
  title: string;
  size?: number;
  active?: boolean;
}) {
  const { title, size, active } = props;
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-1",
        "justify-between md:flex-col md:items-start",
      )}
    >
      <div className={"flex flex-row items-center gap-2"}>
        {!active && <Database className={"h-4 w-4"} />}
        {active && <DatabaseZap className={"h-4 w-4"} />}
        <TypeLabel>{title}:</TypeLabel>
      </div>
      <div className={"flex flex-row items-center justify-start gap-1"}>
        <Odometer value={size} type={"storage"} className={"font-bold"} />
      </div>
    </div>
  );
}

export function BalanceBlock(props: { title: string; balance?: string }) {
  const { balance, title } = props;
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-4",
        "justify-between md:flex-row md:flex-wrap md:items-center",
      )}
    >
      <TypeLabel className={"text-prism-text-muted text-md"}>
        {title}:
      </TypeLabel>
      <FlowTokens
        animated
        digits={4}
        value={balance}
        iconClassName={"w-4 h-4"}
        className={"w-auto"}
      />
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
    <div className={"flex flex-col gap-2"}>
      <TypeLabel>.find Domains</TypeLabel>
      <div
        className={"flex flex-row flex-wrap items-center justify-start gap-2"}
      >
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
                <TagDomain
                  key={item.name}
                  name={item.name}
                  address={item.address}
                />
              );
            })}
      </div>
    </div>
  );
}
