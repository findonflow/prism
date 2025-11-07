/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import { constructCode } from "@/app/design/utils";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function Showcase(props: {
  children: ReactNode;
  title: string;
  className?: string;
  labelClassName?: string;
}) {
  const { children, title } = props;
  const { className, labelClassName } = props;

  const code = constructCode(children, false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-start space-y-2",
        "border border-gray-400/20 p-6",
        className,
      )}
    >
      <div className={"flex flex-row gap-2"}>
        <TypeLabel className={cn("mr-8", labelClassName)}>{title}</TypeLabel>
        <CopyText
          text={code}
          className={
            "absolute top-2 right-2 text-sm opacity-30 hover:opacity-100"
          }
        />
      </div>
      {children}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function ShowcaseGroup(props: {
  children: ReactNode | Array<ReactNode>;
}) {
  const { children } = props;
  return (
    <div className={"flex flex-row items-start space-x-6"}>{children}</div>
  );
}
