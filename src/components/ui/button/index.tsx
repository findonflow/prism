import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
}

export function Button(props: ButtonProps) {
  const { onClick, title } = props;
  const { children } = props;

  return (
    <button
      title={title || ""}
      onClick={onClick}
      type={"button"}
      className={cn(
        "rounded-md px-3 py-2 border-1 cursor-pointer",
        "bg-gray-50 border-gray-400",
        "hover:bg-gray-200",
        "text-sm font-normal",
        "transition-colors duration-150",
      )}
    >
      {children}
    </button>
  );
}
