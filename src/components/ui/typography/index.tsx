/*--------------------------------------------------------------------------------------------------------------------*/
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TextProps {
  children: ReactNode;
  className?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeH1(props: TextProps) {
  const { children, className } = props;

  return (
    <h1
      className={cn(
        "text-4xl text-center font-extrabold",
        "tracking-tight text-balance", // tight interline space and balanced wrap
        "scroll-m-20", // add space when navigating to this header
        className,
      )}
    >
      {children}
    </h1>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeH2(props: TextProps) {
  const { children, className } = props;

  return (
    <h1
      className={cn(
        "text-2xl text-center font-bold",
        "tracking-tight text-balance", // tight interline space and balanced wrap
        "scroll-m-12", // add space when navigating to this header
        className,
      )}
    >
      {children}
    </h1>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeP(props: TextProps) {
  const { children, className } = props;

  return (
    <p className={cn("text-md leading-6 opacity-80", className)}>{children}</p>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeFineprint(props: TextProps) {
  const { children, className } = props;

  return (
    <p className={cn("text-muted-foreground text-sm", "leading-7", className)}>
      {children}
    </p>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeTextBlock(props: TextProps) {
  const { children, className } = props;

  return <div className={cn("space-y-2", className)}>{children}</div>;
}
