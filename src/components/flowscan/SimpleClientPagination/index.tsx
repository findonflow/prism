"use client";
/* --------------------------------------------------------------------------------------------- */
import { usePathname, useSearchParams } from "next/navigation";
import Select from "../Select";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
/* --------------------------------------------------------------------------------------------- */

const defaultLimit = "25";

export default function SimpleClientPagination(props: {
  totalItems: number;
  className?: string;
  prefix?: string;
}) {
  const { className, totalItems, prefix = "" } = props;
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const offset = parseInt(searchParams.get(`${prefix}offset`) || "0");
  let limit = parseInt(searchParams.get(`${prefix}limit`) || defaultLimit);

  const btnClass = cn(
    "w-16 border border-bsn-layer-5 bg-bsn-layer-5 py-2 text-colors-white hover:cursor-pointer hover:bg-colors-gray-medium",
    "disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-bsn-layer-5"
  );

  const prevDisabled = offset === 0;
  const nextDisabled = offset + limit >= totalItems;

  function handleClick(direction: "next" | "prev") {
    const offset = parseInt(searchParams.get(`${prefix}offset`) || "0");
    let limit = parseInt(searchParams.get(`${prefix}limit`) || defaultLimit);
    if (direction === "prev") {
      limit *= -1;
    }
    let newOffset = offset + limit;
    if (newOffset < 0) {
      newOffset = 0;
    }

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(`${prefix}offset`, newOffset.toString());
    window.history.pushState(null, "", pathName + "?" + params.toString());
  }
  function handleLimit(newLimit: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(`${prefix}limit`, newLimit);
    window.history.pushState(null, "", pathName + "?" + params.toString());
  }

  if (totalItems < 5 || totalItems < limit) {
    return null;
  }

  /* Render ------------------------------------------------------------------------------------ */
  return (
    <div className={cn("flex w-full flex-row justify-between", className)}>
      <div className={"flex flex-row items-center justify-start gap-2"}>
        <span className={"whitespace-nowrap"}>Per page:</span>
        <Select
          initialValue={limit.toString()}
          options={["5", "10", "25", "50"]}
          onChange={handleLimit}
          className={"w-15"}
          width={"auto"}
        />
      </div>

      {totalItems >= limit && (
        <div className={"flex flex-row gap-2"}>
          <button
            disabled={prevDisabled}
            className={cn(
              buttonClasses,
              prevDisabled && "disabled:cursor-not-allowed opacity-50"
            )}
            onClick={() => handleClick("prev")}
          >
            Prev
          </button>
          <button
            disabled={nextDisabled}
            className={cn(
              buttonClasses,
              nextDisabled && "disabled:cursor-not-allowed opacity-50"
            )}
            onClick={() => handleClick("next")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
