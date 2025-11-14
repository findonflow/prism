"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { createContext, ReactNode, useContext } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/flowscan/text/Label";
import JumpingDots from "@/components/flowscan/JumpingDots";

export const FetchProgressContext = createContext<{ isLoading: boolean }>({ isLoading: false });

/*--------------------------------------------------------------------------------------------------------------------*/
type DetailsElementProps = {
  className?: string;
  heading: string;
  children: ReactNode;
};

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DetailsElement(props: DetailsElementProps) {
  const { className, heading, children } = props;
  const { isLoading } = useContext(FetchProgressContext);

  return (
    <div className={cn("flex w-full flex-col items-start gap-1", className)}>
      <Label text={heading} className={"shrink-0"} />
      <div className={cn("flex w-full flex-row items-center text-copy-color", className)}>
        {isLoading && <JumpingDots />}
        {!isLoading && children}
      </div>
    </div>
  );
}