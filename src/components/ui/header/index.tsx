import { FlaskConical, Globe, Pyramid } from "lucide-react";
import ConnectWallet from "@/components/ui/connect-wallet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import HeaderSearch from "@/components/ui/header-search";
import SimpleTag from "@/components/flowscan/SimpleTag";
import HeaderSearchMobile from "@/components/ui/header-search/mobile";

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
        "bg-prism-level-1 flex w-full flex-row items-center justify-between gap-4",
        "border-prism-border border-b",
        "px-4 py-2",
      )}
    >
      <div className={"flex flex-row items-center justify-start gap-2"}>
        <PrismLogo link={"/"} />

        {network === "mainnet" && (
          <>
            <SimpleTag
              className={"text-prism-primary hidden flex-none lg:flex"}
              label={"Mainnet"}
              category={<Globe className={"h-4 w-4"} />}
            />
            <SimpleTag
              className={"text-prism-primary block lg:hidden"}
              label={<Globe className={"h-4 w-4"} />}
            />
          </>
        )}

        {network === "testnet" && (
          <>
            <SimpleTag
              className={"text-prism-primary hidden lg:flex"}
              label={"Testnet"}
              category={<FlaskConical className={"h-4 w-4"} />}
            />
            <SimpleTag
              className={"text-prism-primary block lg:hidden"}
              label={<FlaskConical className={"h-4 w-4"} />}
            />
          </>
        )}
      </div>

      <div
        className={"flex h-full w-1/2 flex-row items-stretch justify-end gap-2"}
      >
        <HeaderSearch />
        <HeaderSearchMobile />

        <ConnectWallet />
      </div>
    </div>
  );
}
