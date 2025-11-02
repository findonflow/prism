import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <input
        {...rest}
        ref={ref}
        className={cn(
          "input input-sm input-bordered",
          "border-prism-border bg-prism-level-3 text-prism-text text-base",
          "focus:border-prism-interactive focus:bg-prism-level-4",
          "w-full",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
