import { Pyramid } from "lucide-react";
import ConnectWallet from "@/components/ui/connect-wallet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import HeaderSearch from "@/components/ui/header-search";

/*--------------------------------------------------------------------------------------------------------------------*/

function PrismLogo(props: { link: string }) {
  const { link } = props;
  return (
    <Link href={link}>
      <div className={"flex flex-row items-center gap-1 text-xl"}>
        <Pyramid className={"h-5 w-5"} />
        <span className={"font-bold"}>Prism</span>
      </div>
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Header(props: { network: string }) {
  const { network } = props;
  return (
    <div
      className={cn(
        "bg-prism-level-1 flex w-full flex-row items-center justify-between gap-2",
        "border-prism-border border-b",
        "px-4 py-2",
      )}
    >
      <div className={"flex flex-row items-center justify-start gap-2"}>
        <PrismLogo link={"/"} />

        <span
          className={
            "border-prism-primary text-prism-primary rounded-xs border-1 p-0.5 px-1 text-xs"
          }
        >
          {network}
        </span>
      </div>

      <div
        className={"flex h-full w-1/2 flex-row items-stretch justify-end gap-4"}
      >
        <HeaderSearch />
        <ConnectWallet />
      </div>
    </div>
  );
}
