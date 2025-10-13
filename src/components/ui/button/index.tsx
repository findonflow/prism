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
        "bg-gray-300 border-gray-400",
        "hover:bg-green-500 hover:text-white hover:border-green-600",
        "text-sm font-normal",
        "transition-colors duration-150",
      )}
    >
      {children}
    </button>
  );
}
