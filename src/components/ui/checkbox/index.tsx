import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function Checkbox(props: CheckboxProps) {
  const { label, className, labelClassName, ...rest } = props;

  const checkbox = (
    <input
      {...rest}
      type="checkbox"
      style={{
        "--size-selector": "0.35rem",
        padding: "0.35rem",
        borderRadius: "0.2rem"
      } as React.CSSProperties}
      className={cn(
        "checkbox checkbox-sm checkbox-primary",
        "bg-prism-level-3 border-prism-border",
        className
      )}
    />
  );

  if (label) {
    return (
      <label
        className={cn(
          "flex select-none flex-row items-center gap-2 whitespace-nowrap text-prism-text cursor-pointer",
          labelClassName
        )}
      >
        {checkbox}
        {label}
      </label>
    );
  }

  return checkbox;
}
