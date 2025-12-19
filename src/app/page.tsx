/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { FlaskConical, Globe, Pyramid } from "lucide-react";
import Footer from "@/components/ui/footer";
import { TypeH1, TypeP, TypeTextBlock } from "@/components/ui/typography";
import NetworkSelector from "@/components/ui/network-selector";
import { FAQAccordion } from "@/components/ui/faq";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Home() {
  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* Anchor */}
      <div className={"absolute top-0"} id={"welcome-to-prism"}></div>

      {/* First section - Full height with network selector */}
      <div className={"max-w-5xl px-4 lg:px-6"}>
        <div className="flex h-dvh w-full flex-col items-center justify-between">
          <main className="flex h-full flex-col items-center justify-center">
            <TypeTextBlock className={"mb-8"}>
              <TypeH1
                className={cn(
                  "inline-flex w-full flex-row flex-wrap items-center justify-center gap-2 font-light",
                )}
              >
                <span>Welcome to</span>
                <span className={"inline-flex items-center gap-2 font-bold"}>
                  <Pyramid className={"h-9 w-9 stroke-[0.125rem]"} />
                  <span>Prism</span>
                </span>
              </TypeH1>
              <TypeP className={"text-lg text-balance"}>
                Dissect full spectrum of blockchain data into narrow spectrum
                you explore
              </TypeP>
            </TypeTextBlock>

            <div className={"flex flex-col space-y-6"}>
              <TypeP className={"text-md text-prism-text-muted"}>
                Pick the network you want to access
              </TypeP>
              <div
                className={
                  "full grid grid-cols-1 items-center gap-6 md:grid-cols-2"
                }
              >
                <NetworkSelector
                  icon={<Globe className={"h-5 w-5"} />}
                  link={"/mainnet"}
                  title={"Mainnet"}
                  copy={"Production & Live Assets"}
                  className={"text-prism-primary"}
                />
                <NetworkSelector
                  icon={<FlaskConical className={"h-5 w-5"} />}
                  link={"/testnet"}
                  title={"Testnet"}
                  copy={"Development & Staging Environment"}
                  className={"text-prism-secondary"}
                />
              </div>

              <Link
                href={"#what-is-prism"}
                className={"text-prism-primary underline"}
                scroll={true}
              >
                What is Prism?
              </Link>
            </div>
          </main>
        </div>

        {/* FAQ Section */}
        <FAQAccordion />
      </div>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
