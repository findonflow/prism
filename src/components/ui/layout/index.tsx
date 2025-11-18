/*--------------------------------------------------------------------------------------------------------------------*/
import type { ReactNode } from "react";
import { Suspense } from "react";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeSubsection } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function PageLayout(props: {
  title: string;
  children: ReactNode;
}) {
  const { title, children } = props;
  return (
    <div className={"w-full space-y-4"}>
      <TypeSubsection className={"capitalize"}>{title}</TypeSubsection>
      <Suspense fallback={<LoadingBlock />}>{children}</Suspense>
    </div>
  );
}
