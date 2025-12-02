/*--------------------------------------------------------------------------------------------------------------------*/
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TextProps {
  id?: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeH1(props: TextProps) {
  const { id, children, className } = props;

  return (
    <h1
      id={id}
      className={cn(
        "text-center text-4xl font-extrabold",
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
  const { children, className, title } = props;

  return (
    <h2
      title={title}
      className={cn(
        "text-center text-2xl font-bold",
        "tracking-tight text-balance", // tight interline space and balanced wrap
        "scroll-m-12", // add space when navigating to this header
        className,
      )}
    >
      {children}
    </h2>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeH3(props: TextProps) {
  const { children, className } = props;

  return (
    <h3
      className={cn(
        "text-md text-left font-bold",
        "tracking-tight text-balance", // tight interline space and balanced wrap
        "scroll-m-6", // add space when navigating to this header
        className,
      )}
    >
      {children}
    </h3>
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
    <p className={cn("text-muted-foreground text-sm", "leading-6", className)}>
      {children}
    </p>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeTextBlock(props: TextProps) {
  const { children, className } = props;

  return <div className={cn("space-y-2", className)}>{children}</div>;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeLabel(props: TextProps) {
  const { children, className } = props;

  return <span className={cn("text-sm text-prism-text-muted", className)}>{children}</span>;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TypeSubsection(props: TextProps){
  const { children, className } = props;

  return (
    <h3
      className={cn(
        "text-xl text-left font-light text-prism-text-muted",
        "tracking-tight text-balance", // tight interline space and balanced wrap
        "scroll-m-6", // add space when navigating to this header
        className,
      )}
    >
      {children}
    </h3>
  );
}
