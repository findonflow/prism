/*--------------------------------------------------------------------------------------------------------------------*/
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function NumberOfItems(props: { items?: number }) {
  const { items } = props;

  if (!items) return null;

  return (
    <div
      title={`This collection has ${items} item${items > 1 ? "s" : ""} in it`}
      className={cn(
        "flex flex-row items-center justify-end gap-1",
        items === 0 ? "text-grey-200/10" : "text-blue-500",
      )}
    >
      <Package className={"h-4 w-4"} />
      <b className={"text-copy"}>{items}</b>
    </div>
  );
}
