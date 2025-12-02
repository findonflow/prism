import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function Divider(props: { className?: String }) {
  const { className } = props;
  return <hr className={cn("bg-prism-text-muted/5 h-px w-full", className)} />;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function Panel(props: {
  className?: string;
  children: ReactNode | Array<ReactNode>;
}) {
  const { children, className } = props;
  return (
    <div
      className={cn(
        "bg-prism-level-2 border-prism-border w-full space-y-6 border-1 p-6 text-left relative",
        className,
      )}
    >
      {children}
    </div>
  );
}
