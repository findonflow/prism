/*--------------------------------------------------------------------------------------------------------------------*/
import {
  TypeH1,
  TypeH2,
  TypeP,
  TypeTextBlock,
} from "@/components/ui/typography";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FAQAccordion } from "@/components/ui/faq";
import { FlaskConical, Globe, Pyramid } from "lucide-react";
import SimpleTag from "@/components/flowscan/SimpleTag";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
function NetworkSelector(props: {
  link: string;
  title: string;
  copy: string;
  className?: string;
  icon: ReactNode;
}) {
  const { link, title, copy } = props;
  const { className, icon } = props;

  return (
    <Link href={link}>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center border-1 pt-6 pb-4",
          "hover:bg-prism-level-2 hover:border-current hover:shadow-[0_0_3rem_0]",
          "border-current/75 shadow-current/50 shadow-[0_0_0_0]",
          "md:border-prism-text-muted/40 md:p-6 md:px-8",
          "group rounded-sm transition-colors duration-500",
          className,
        )}
      >
        <div className={"flex flex-col items-center justify-center space-y-2"}>
          <SimpleTag
            label={title}
            category={icon}
            hideArrow
            className={"text-md px-2"}
          />
          <TypeP
            className={cn(
              "max-w-[10em] group-hover:text-current",
              "[.group:not(:hover)_&]:text-prism-text-muted",
              "transition duration-300",
            )}
          >
            {copy}
          </TypeP>
        </div>
      </div>
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Home() {
  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* First section - Full height with network selector */}

      <div className={"max-w-5xl px-4 lg:px-6"}>
        <div className="flex h-screen w-full flex-col items-center justify-between">
          <main className="flex h-full flex-col items-center justify-center">
            <TypeTextBlock className={"mb-8"}>
              {/* Anchor */}
              <div className={"fixed top-0"} id={"welcome-to-prism"}></div>

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
                Pick the network you want to work with
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
