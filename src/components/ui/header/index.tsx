import { Pyramid } from "lucide-react";
import ConnectWallet from "@/components/ui/connect-wallet";
import Link from "next/link";

/*--------------------------------------------------------------------------------------------------------------------*/

function PrismLogo(props: { link: string }) {
  const { link } = props;
  return (
    <Link href={link}>
      <div className={"flex flex-row text-xl items-center gap-1"}>
        <Pyramid className={"w-5 h-5"} />
        <span className={"font-bold"}>Prism</span>
      </div>
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Header(props: { network: string }) {
  const { network } = props;
  return (
    <div className={"flex flex-row justify-between items-center w-full gap-2"}>
      <div className={"flex flex-row gap-2 items-center justify-start"}>
        <PrismLogo link={"/"} />
        <span
          className={"px-2 py-1 text-sm border-gray-300 border-1 rounded-sm"}
        >
          {network}
        </span>
      </div>

      <ConnectWallet />
    </div>
  );
}
