/*--------------------------------------------------------------------------------------------------------------------*/
import type { ReactNode } from "react";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeSubsection } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function PageLayout(props: {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}) {
  const { title, children, extra } = props;

  return (
    <div className={"w-full space-y-4"}>
      <div className={"flex w-full justify-between items-center"}>
        <TypeSubsection className={"capitalize"}>{title}</TypeSubsection>
        {extra}
      </div>
      <Suspense fallback={<LoadingBlock />}>{children}</Suspense>
    </div>
  );
}
