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
  horizontal?: boolean;
}) {
  const { children, title } = props;
  const { className, labelClassName } = props;
  const { horizontal } = props;

  const code = constructCode(children, false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-start space-y-2",
        "border border-gray-400/20 p-4 pr-8",
        horizontal && "flex-row items-center gap-4 space-y-0",
        className,
      )}
    >
      <div className={"flex flex-row items-center gap-1"}>
        <CopyText
          text={code}
          className={"text-sm opacity-30 hover:opacity-100"}
        />
        <TypeLabel className={cn("flex-0 text-nowrap", labelClassName)}>
          {title}
        </TypeLabel>
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
