"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { CircleX, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import BigSearch from "@/components/ui/big-search";
import { TypeP } from "@/components/ui/typography";
import useNavigationShift from "@/hooks/layout/useNavigationShift";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function HeaderSearchMobile() {
  const { id, hash } = useParams();
  const [showOverlay, setShowOverlay] = useState(false);

  if (!id && !hash) {
    return null;
  }

  return (
    <>
      <div className={"block lg:hidden"}>
        <button
          onClick={() => setShowOverlay(true)}
          className={cn(
            "border border-white px-3",
            "flex h-full items-center justify-center",
          )}
        >
          <Search className={"h-5 w-5 flex-none"} />
        </button>
      </div>
      {showOverlay && <SearchOverlay close={() => setShowOverlay(false)} />}
    </>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SearchOverlay(props: { close: () => void }) {
  const { close } = props;

  useNavigationShift(close);

  return (
    <div
      className={cn(
        "bg-prism-level-1/90 fixed z-[100] flex h-screen w-full flex-col items-center justify-center backdrop-blur-sm",
        "top-0 right-0",
      )}
    >
      <div className={"flex w-full flex-col gap-4 px-4"}>
        <TypeP className={"text-center"}>
          Search address, transaction hash or{" "}
          <span className={"font-bold"}>.find</span> name
        </TypeP>
        <BigSearch />
      </div>
      <button className={"absolute top-4 right-4"} onClick={close}>
        <CircleX className={"h-6 w-6 text-white"} />
      </button>
    </div>
  );
}
