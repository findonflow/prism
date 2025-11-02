import {
  TypeH1,
  TypeH2,
  TypeP,
  TypeTextBlock,
} from "@/components/ui/typography";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
/*--------------------------------------------------------------------------------------------------------------------*/

function NetworkSelector(props: { link: string; title: string; copy: string }) {
  const { link, title, copy } = props;

  return (
    <Link href={link}>
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full border-1 border-prism-border h-full p-8",
          "hover:bg-prism-level-2 hover:border-prism-interactive",
          "rounded-md",
        )}
      >
        <div className={"space-y-2"}>
          <TypeH2>{title}</TypeH2>
          <TypeP>{copy}</TypeP>
        </div>
      </div>
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-between h-screen text-center space-y-6 p-8">
      <main className="h-full flex flex-col items-center justify-center">
        <TypeTextBlock>
          <TypeH1 className={"font-light"}>
            Welcome to <span className={"font-bold"}>Prism</span>
          </TypeH1>
          <TypeP>
            Dissect full spectrum of blockchain data into narrow spectrum you
            explore
          </TypeP>
        </TypeTextBlock>

        <div className={"flex flex-col space-y-6"}>
          <TypeP>Pick the network you want to work with</TypeP>
          <div className={"full grid grid-cols-2 gap-4 items-center h-20"}>
            <NetworkSelector
              link={"/mainnet"}
              title={"Mainnet"}
              copy={"Mainnet Data"}
            />
            <NetworkSelector
              link={"/testnet"}
              title={"Testnet"}
              copy={"Testnet Data"}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
