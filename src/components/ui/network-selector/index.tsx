/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TypeP } from "@/components/ui/typography";
import SimpleTag from "@/components/flowscan/SimpleTag";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function NetworkSelector(props: {
  link: string;
  title: string;
  copy: string;
  className?: string;
  icon: ReactNode;
}) {
  const { link, title, copy } = props;
  const { className, icon } = props;

  const network = title.toLowerCase();
  const colorClass =
    network === "mainnet" ? "text-prism-mainnet" : "text-prism-testnet";

  return (
    <Link href={link}>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center border-1 pt-6 pb-4",
          "hover:bg-prism-level-2 hover:border-current hover:shadow-[0_0_3rem_0]",
          "border-current/75 shadow-[0_0_0_0] shadow-current/50",
          "md:border-prism-text-muted/40 md:p-6 md:px-8",
          "group rounded-sm transition-colors duration-500",
          colorClass,
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
              "max-w-[10em] text-center group-hover:text-current",
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
