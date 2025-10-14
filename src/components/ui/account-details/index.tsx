"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useBasicDetails } from "@/hooks/useBasicDetails";
import { Database, DatabaseZap, Wallet } from "lucide-react";
import { TypeLabel } from "@/components/ui/typography";
import Odometer from "@/components/flowscan/Odometer";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function BasicAccountDetails(props: { address?: string }) {
  const { address } = props;

  const { data, isLoading, error } = useBasicDetails(address);

  const showData = !isLoading && Boolean(data);
  return (
    <div
      className={cn(
        "w-full grid grid-cols-1 items-start justify-start gap-2",
        "md:grid-cols-2 md:gap-10",
      )}
    >
      {isLoading && <LoadingBlock title={"Loading basic details"} />}
      {showData && (
        <>
          <div
            className={cn(
              "grid grid-cols-2 items-start justify-start gap-1 w-full",
            )}
          >
            {/*-- Balance --*/}
            <div className={"flex flex-row items-center gap-2 w-full"}>
              <Wallet className={"h-5 w-5"} />
              <TypeLabel>Balance:</TypeLabel>
            </div>
            <FlowTokens
              animated
              digits={6}
              value={data?.balance}
              iconClassName={"w-4 h-4"}
              className={"w-auto"}
            />

            {/*-- Available Balance --*/}
            <div className={"flex flex-row items-center gap-2"}>
              <Wallet className={"h-5 w-5"} />
              <TypeLabel className={"whitespace-nowrap"}>
                Available Balance:
              </TypeLabel>
            </div>
            <FlowTokens
              animated
              digits={6}
              value={data?.availableBalance}
              iconClassName={"w-4 h-4"}
              className={"w-auto"}
            />
          </div>


          <div className={"grid w-full grid-cols-2 gap-1"}>
            {/*-- Storage Used --*/}
            <div className={"flex flex-row items-center gap-2"}>
              <DatabaseZap className={"h-5 w-5"} />
              <TypeLabel className={"whitespace-nowrap "}>
                Storage Used:
              </TypeLabel>
            </div>
            <div className={"flex flex-row items-center justify-end gap-1"}>
              <Odometer value={data?.storageUsed} type={"storage"} />
            </div>

            {/*-- Storage Available --*/}
            <div className={"flex flex-row items-center gap-2"}>
              <Database className={"h-5 w-5"} />
              <TypeLabel className={"whitespace-nowrap "}>
                Storage Available:
              </TypeLabel>
            </div>
            <div className={"flex flex-row items-center justify-end gap-1"}>
              <Odometer value={data?.storageCapacity} type={"storage"} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
