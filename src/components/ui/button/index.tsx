/*--------------------------------------------------------------------------------------------------------------------*/
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export const buttonClasses = cn(
  "rounded-md px-3 py-2 border-1 cursor-pointer",
  "bg-prism-level-2 border-prism-border",
  "text-sm font-normal",
  "transition-colors duration-150",
  "cursor-pointer"
);

export const primaryHover = "bg-prism-primary/10 hover:bg-prism-primary/25";
export const hoverClasses = "bg-prism-level-3 hover:bg-prism-level-4";

/*--------------------------------------------------------------------------------------------------------------------*/
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function Button(props: ButtonProps) {
  const { onClick, title, className } = props;
  const { children } = props;

  return (
    <button
      title={title || ""}
      onClick={onClick}
      type={"button"}
      className={cn(buttonClasses, className)}
    >
      {children}
    </button>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function BigButton(props: ButtonProps) {
  const { onClick, title, className } = props;
  const { children, disabled } = props;

  return (
    <button
      title={title || ""}
      onClick={onClick}
      type={"button"}
      disabled={disabled}
      className={cn(buttonClasses, "p-3", className)}
    >
      {children}
    </button>
  );
}
