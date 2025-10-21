"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import useAccountResolver from "@/hooks/useAccountResolver";
import { TypeLabel } from "@/components/ui/typography";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import useStoredItems from "@/hooks/useStoredItems";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountStoredItemsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isPending } = useStoredItems(address);

  console.log({ data });

  const isLoading = isResolving;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <TypeLabel>Account Stored Items:</TypeLabel>
      {isLoading && (
        <LoadingBlock title={`Loading ${address} stored items... `} />
      )}
    </div>
  );
}
