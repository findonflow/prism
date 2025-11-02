/*--------------------------------------------------------------------------------------------------------------------*/
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export const buttonClasses = cn(
  "rounded-md px-3 py-2 border-1 cursor-pointer",
  "bg-prism-level-2 border-prism-border",
  "hover:bg-prism-interactive-hover",
  "text-sm font-normal",
  "transition-colors duration-150",
);

/*--------------------------------------------------------------------------------------------------------------------*/
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function Button(props: ButtonProps) {
  const { onClick, title } = props;
  const { children } = props;

  return (
    <button
      title={title || ""}
      onClick={onClick}
      type={"button"}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}
